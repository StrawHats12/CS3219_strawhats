require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const Mux = require("@mux/mux-node");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

const {
  addOrUpdateKeys,
  deleteKeys,
  getKeysByStreamerId,
  getItemByStreamId,
} = require("./dynamoDb");

const { auth, roles } = require("./auth");
const { REDIS_HOST } = require("./const");

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

const server = app.listen(9000, function () {
  console.log("Your app is listening on port 9000");
});

//Chat IO
const io = require("socket.io")(server, {
  path: "/livestream/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({ host: REDIS_HOST, port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// Livestream messages
io.on("connection", (socket) => {
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

const getUsernameFromStreamId = async (streamId) => {
  const item = await getItemByStreamId(streamId);
  const username = item?.Items[0]?.streamer_id;
  return username;
};

// MUX Callback when state changes
app.post("/livestream/mux-hook", function (req, res) {
  const status = req.body.type;
  const streamId = req.body.id;

  switch (status) {
    case "video.live_stream.active":
      const username = getUsernameFromStreamId(streamId);
      io.to(username).emit("stream_update");
      break;
    default:
    // Ignore
  }

  res.status(200).send("Thanks, Mux!");
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
  return item?.Item;
};

const getPublicInfo = (item) => {
  return item
    ? {
        streamer_id: item.Item.streamer_id,
        playback_ids: item.Item.playback_ids,
      }
    : {};
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
    return res.json(getPublicInfo(item));
  } catch (error) {
    res.json({});
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
    return res.json(getPrivateInfo(item));
  } catch (error) {
    res.json({});
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
