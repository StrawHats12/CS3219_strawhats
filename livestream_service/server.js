require("dotenv").config();
var cors = require("cors");
const express = require("express");
// const basicAuth = require("basic-auth");
const app = express();
app.use(cors());

const http = require("http").Server(app);
const morgan = require("morgan");
const io = require("socket.io")(http); //TODO remove socket.io if not needed (from package.json)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("tiny"));

const Mux = require("@mux/mux-node");
const stream = require("stream");
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

const { auth, roles } = require("./auth");

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
    new_asset_settings: { playback_policy: "public" },
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

// API for getting the current live stream and its state for bootstrapping the app
app.get("/fetchStream/:id", async (req, res) => {
  const id = req.params.id.toString();
  console.log("trying to fetch stream details for id:", id);
  console.log("streams id is now:", streamIds);
  return res.json(getPrivateStreamDetails(id));
});

// API which Listens for callbacks from Mux
// app.post("/mux-hook", auth, function (req, res) {
//   STREAM.status = req.body.data.status;

//   switch (req.body.type) {
//     // When a stream goes idle, we want to capture the automatically created
//     // asset IDs, so we can let people watch the on-demand copies of our live streams
//     case "video.live_stream.idle":
//       STREAM["recent_asset_ids"] = req.body.data["recent_asset_ids"];
//     // We deliberately don't break; here

//     // When a Live Stream is active or idle, we want to push a new event down our
//     // web socket connection to our frontend, so that it update and display or hide
//     // the live stream.
//     case "video.live_stream.active":
//       io.emit("stream_update", publicStreamDetails(STREAM));
//       break;
//     default:
//     // Relaxing.
//   }

app.get("/", (req, res) => {
  return res.status(200).send("things working");
});

app.post("/create", auth(roles.USER), (req, res) => {
  const streamerId = req.body.id;

  if (!streamerId) {
    res.status(500).send(`Unknown ID}`); // Change status code
  }

  if (req.user.username !== streamerId) {
    res
      .status(403)
      .json({ err: "User is not authorised to update this account" });
  }

  console.log("req:", req);
  // todo: create only if the stream details don't exist yet:
  initStream()
    .then((stream) => {
      console.log("HERE ARE YOUR STREAM DETAILS, KEEP THEM SECRET!");
      const streamKey = stream.stream_key;
      console.log(`Stream Key: ${streamKey}`);
      console.log(`Live stream id: ${streamIds}`);
      streamIds[streamerId] = stream;
      console.log(streamIds);
      res.status(200).send(getPrivateStreamDetails(streamerId));
    })
    .catch((err) => {
      res
        .status(500)
        .send(
          `Stream could not be created due to an unknown error. Please try again.\nError: ${err.toString()}`
        );
    });
});

app.delete("/destroy/:id", auth(roles.USER), (req, res) => {
  console.log("[destroy api called user livestream id: ", req.params.id);
  const streamerId = req.params.id;
  const livestreamId = streamIds[streamerId].id;
  console.log(
    `streamerId ${streamerId}'s livestream id ${livestreamId} needs to be deleted`
  );

  if (req.user.username !== streamerId) {
    res
      .status(403)
      .json({ err: "User is not authorised to update this account" });
  }

  Video.LiveStreams.del(livestreamId)
    .then(
      (r) => delete streamIds[streamerId] // cleanup
    )
    .catch((e) => {
      console.error(
        "Something wrong happened when livestream backend tried to make api" +
          " call to delete the livestream",
        e
      );
    });
  res
    .status(200)
    .send(
      `deleted ${streamerId}'s stream. previous livestream id: ${livestreamId}`
    );
});

app.listen(process.env.SERVER_PORT, function () {
  console.log("Your app is listening on port " + process.env.SERVER_PORT);
});
