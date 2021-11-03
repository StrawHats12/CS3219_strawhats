require("dotenv").config();
var cors = require("cors");
const express = require("express");
// const basicAuth = require("basic-auth");
const app = express();
app.use(cors());


const {
  addOrUpdateKeys,
  deleteKeys,
  getKeysByStreamerId
} = require("./dynamoDb");


const webhookUser = {
  name: 'muxer',
  pass: 'muxology',
}

const http = require("http").createServer(app);
const morgan = require("morgan");
const io = require("socket.io")(http);
const {Server} = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(morgan("tiny"));

const chatIo = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
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

const Mux = require("@mux/mux-node");
const stream = require("stream");
const {Video} = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
);

const {auth, roles} = require("./auth");

// Livestream messages
chatIo.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("Connection with: " + id);
  socket.join(id);

  socket.on("send-message", ({livestream_id, text, sender_id}) => {
    socket.broadcast.to(livestream_id).emit("receive-message", {
      sender_id: sender_id,
      text,
      livestream_id,
    });
  });
});

let STREAM;

// Authentication Configuration
// const webhookUser = {
//   name: "muxer",
//   pass: "muxology",
// };

const streamIds = {};

// ========= todo: add auth,  middleware would be necessary ==========
// Authentication Middleware
// const auth = (req, res, next) => {
// function unauthorized(res) {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     return res.send(401);
// };
// const user = basicAuth(req);
// if (!user || !user.name || !user.pass) {
//     return unauthorized(res);
// };
// if (user.name === webhookUser.name && user.pass === webhookUser.pass) {
//     return next();
// } else {
//     return unauthorized(res);
// };
// };

// Creates a new Live Stream so we can get a Stream Key
const createLiveStream = async () => {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    console.error(
        "It looks like you haven't set up your Mux token in the .env file yet."
    );
    return;
  }

  // Create a new Live Stream!
  return await Video.LiveStreams.create({
    playback_policy: "public",
    reconnect_window: 10,
    new_asset_settings: {playback_policy: "public"},
  });
};

const initStream = async () => {
  STREAM = await createLiveStream();
  return STREAM;
};

// Lazy way to find a public playback ID (Just returns the first...)
const getPlaybackId = (stream) => stream["playback_ids"][0].id;

// Gets a trimmed public stream details from a stream for use on the client side
const publicStreamDetails = (stream) => ({
  status: stream.status,
  playbackId: getPlaybackId(stream),
  recentAssets: stream["recent_asset_ids"],
});

const getPrivateStreamDetails = (streamerId) => {
  const stream = streamIds[streamerId];
  return stream
      ? {
        streamer_id: streamerId,
        stream_key: stream.stream_key,
        playback_ids: stream.playback_ids,
        live_stream_id: stream.id,
      }
      : {};
};


// const showPrivateStreamDetails = (item) => {
//
//   return item.Item;
// };

const showPublicStreamDetails = (item) => {
  return item.Item;
  return {
    streamer_id: item.streamer_id,
    playback_ids: item.playback_ids,
  }
};


// API for getting the current live stream and its state for bootstrapping the app
app.get("/fetchStream/:id", async (req, res) => {
  const id = req.params.id.toString();
  console.log("trying to fetch stream details for id:", id);
  console.log("streams id is now:", streamIds);
  const item = await getKeysByStreamerId(id)
  console.log("item.Item:", item.Item)
  return res.json(item.Item);
  // return res.json(getPrivateStreamDetails(id));
});

// function getPublicStreamDetails(Item) {
//   const publicItem = {
//     streamer_id:
//   }
// }

app.get("/fetchPublicStream/:id", async (req, res) => {
  const id = req.params.id.toString();
  console.log("trying to fetch stream details for id:", id);
  console.log("streams id is now:", streamIds);
  const item = await getKeysByStreamerId(id)
  const publicInfo = {
    streamer_id: item.Item.streamer_id,
    playback_ids: item.Item.playback_ids
  }
  return res.json(publicInfo);
});


const addNewStreamToDB = async (stream, streamer_id) => {
  let item = {
    streamer_id: streamer_id,
    stream_key: stream.stream_key,
    playback_ids: stream.playback_ids,
    live_stream_id: stream.id
  }
  await addOrUpdateKeys(item);
}

app.get("/", (req, res) => {
  return res.status(200).send("things working");
});

app.post("/create"/*, auth(roles.USER)*/, (req, res) => {
  const streamerId = req.body.id;

  if (!streamerId) {
    res.status(500).send(`Unknown ID}`); // Change status code
  }

  // if (req.user.username !== streamerId) {
  //   res
  //       .status(403)
  //       .json({err: "User is not authorised to update this account"});
  // }

  console.log("req:", req);
  initStream()
      .then((stream) => {
        console.log("HERE ARE YOUR STREAM DETAILS, KEEP THEM SECRET!");
        const streamKey = stream.stream_key;
        console.log(`Stream Key: ${streamKey}`);
        console.log(`Live stream id: ${streamIds}`);
        streamIds[streamerId] = stream;
        addNewStreamToDB(stream, streamerId)
            .then(() => console.log("yay added to dynamodb"))
            .catch(e => {
              console.error(e)
            });
        console.log(streamIds);
        // res.status(200).send(showPrivateStreamDetails(streamerId));
        const payload = getPrivateStreamDetails(streamerId);
        console.log("payload", payload)
        res.status(200).send(payload);
      })
      .catch((err) => {
        res
            .status(500)
            .send(
                `Stream could not be created due to an unknown error. Please try again.\nError: ${err.toString()}`
            );
      });
});

app.delete("/destroy/:id", /*auth(roles.USER),*/ async (req, res) => {
  console.log("[destroy api called user livestream id: ", req.params.id);
  const streamerId = req.params.id;
  let existing_item = await getKeysByStreamerId(streamerId);
  const livestreamId = existing_item.Item.live_stream_id
  console.log(`streamerId ${streamerId}'s livestream id ${livestreamId} needs to be deleted`);

  // if (req.user.username !== streamerId) {
  //   res .status(403).json({err: "User is not authorised to update this account"});
  // }

  Video.LiveStreams.del(livestreamId)
      .then(
          (r) => deleteKeys(streamerId) // cleanup
      )
      .catch((e) => {
        console.error(
            "Something wrong happened when livestream backend tried to make api" +
            " call to delete the livestream via mux", e);
      });
  res.status(200)
      .send(
          `deleted ${streamerId}'s stream. previous livestream id: ${livestreamId}`
      );
});

app.post('/mux-hook', (req, res) => {
  STREAM.status = req.body.data.status; // probably need to poll mux?

  switch(req.body.type) {
    case 'video.live_stream.active':
      io.emit('stream_update', publicStreamDetails(STREAM));
      break;
    default:
      // Relaxing.
  }
  res.status(200).send("Got stream status update from mux!")
})


app.listen(process.env.SERVER_PORT, function () {
  console.log("Your app is listening on port " + process.env.SERVER_PORT);
});

app.get("/test", async (req, res) => {
  console.log("called test")
  const streamer_id = "rtshkmr"
  let item = {
    streamer_id: streamer_id,
    stream_key: "aabcd",
    playback_ids: [{
      policy: 'public',
      id: 'uCdjYgcSZMu5SrO02lLs6L2hv7KcOB12pXVGNkhfK9Ac'
    }],
    live_stream_id: "12312"
  }
  let ret_val_put = await addOrUpdateKeys(item)
  let return_val_get = await getKeysByStreamerId(streamer_id);
  let del_ret_val = await deleteKeys(streamer_id)
  console.log(ret_val_put)
  console.log(return_val_get)
  console.log(del_ret_val)
  res.send("done, ")
})