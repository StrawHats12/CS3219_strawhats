require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const morgan = require("morgan");
// const io = require("socket.io")(http);
const { Server } = require("socket.io");
const Mux = require("@mux/mux-node");
const stream = require("stream");

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

const {
  addOrUpdateKeys,
  deleteKeys,
  getKeysByStreamerId,
} = require("./dynamoDb");

const { auth, roles } = require("./auth");

// Sanity Checks
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.error("No MUX token in the .env file yet.");
  return;
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("No AWS token in the .env file yet.");
  return;
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

//Chat IO
const chatIo = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

chatIo.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("Connection with: " + id);
  socket.join(id);
});

http.listen(7070, () => {
  console.log("Messaging socket running!");
});

// Livestream messages
chatIo.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("Connection with: " + id);
  socket.join(id);

  socket.on("send-message", ({ livestream_id, text, sender_id }) => {
    socket.broadcast.to(livestream_id).emit("receive-message", {
      sender_id: sender_id,
      text,
      livestream_id,
    });
  });
});

const createLiveStream = async () => {
  return await Video.LiveStreams.create({
    playback_policy: "public",
    reconnect_window: 10,
    new_asset_settings: { playback_policy: "public" },
  });
};

const initStream = async () => {
  return await createLiveStream();
};

const createStreamObject = (stream, streamer_id) => {
  const item = {
    streamer_id: streamer_id,
    stream_key: stream.stream_key,
    playback_ids: stream.playback_ids,
    live_stream_id: stream.id,
  };

  return item;
};

const getPrivateInfo = (item) => {
  return item.Item;
};

const getPublicInfo = (item) => {
  return {
    streamer_id: item.Item.streamer_id,
    playback_ids: item.Item.playback_ids,
  };
};

app.get("/", (req, res) => {
  return res.status(200).send("Server is up!");
});

// API for getting the current live stream and its state for bootstrapping the app
app.get("/livestream/public/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(500).send(`Unknown ID}`);
  }

  try {
    const item = await getKeysByStreamerId(id);
    return res.json(getPrivateInfo(item));
  } catch (error) {
    res.status(500).json({ err: "Error when fetching from dynamoDb" });
  }
});

app.get("/livestream/private/:id", auth(roles.USER), async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(500).send(`Unknown ID}`);
  }

  if (req.user.username !== id) {
    res
      .status(403)
      .json({ err: "User is not authorised to update this account" });
  }

  try {
    const item = await getKeysByStreamerId(id);
    return res.json(getPublicInfo(item));
  } catch (error) {
    res.status(500).json({ err: "Error when fetching from dynamoDb" });
  }
});

app.post("/livestream", auth(roles.USER), (req, res) => {
  const streamerId = req.body.id;

  if (!streamerId) {
    res.status(500).send(`Unknown ID}`);
  }

  if (req.user.username !== streamerId) {
    res
      .status(403)
      .json({ err: "User is not authorised to update this account" });
  }

  initStream()
    .then((stream) => {
      const item = createStreamObject(stream, streamerId);
      addOrUpdateKeys(item)
        .then(() => {
          res.status(200).send(item);
        })
        .catch((err) => {
          res
            .status(500)
            .send(
              `Stream could not be created due to an unknown error. Please try again.\nError: ${err.toString()}`
            );
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send(
          `Stream could not be created due to an unknown error. Please try again.\nError: ${err.toString()}`
        );
    });
});

app.delete("/livestream/:id", auth(roles.USER), async (req, res) => {
  const streamerId = req.params.id;

  if (req.user.username !== streamerId) {
    res
      .status(403)
      .json({ err: "User is not authorised to update this account" });
  }

  const existing_item = await getKeysByStreamerId(streamerId);
  const livestreamId = existing_item?.Item?.live_stream_id;

  if (!livestreamId) {
    res
      .status(500)
      .json({ err: "Unknown error fetching livestream details from dynamodb" });
  }

  Video.LiveStreams.del(livestreamId)
    .then(() =>
      deleteKeys(streamerId).catch((e) => {
        console.error(
          `Error deleting from dynamoDb id: ${livestreamId} user: ${streamerId}`,
          e
        );
      })
    )
    .catch((e) => {
      console.error(
        `Error deleting from mux id: ${livestreamId} user: ${streamerId}`,
        e
      );
    });

  // Fail Silently
  res
    .status(200)
    .send(
      `${streamerId}'s stream deleted. previous livestream id: ${livestreamId}`
    );
});

app.listen(process.env.SERVER_PORT, function () {
  console.log("Your app is listening on port " + process.env.SERVER_PORT);
});
