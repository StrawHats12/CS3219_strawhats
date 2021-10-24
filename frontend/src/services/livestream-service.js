import axios from "axios";
import {LIVESTREAM} from "../const";

// todo: add api calls here
const generateStream = async (creatorId) => {
  console.log("Register creator id to get stream key", creatorId)
  const payload = {
    "id": creatorId
  }

  console.log(`Trying to create a stream \n url ${LIVESTREAM.CREATE_STREAM_URL}`)
  console.log("creator id:", creatorId)

  let response = await axios
      .post(LIVESTREAM.CREATE_STREAM_URL, payload)
      .catch((e) => {
        console.error("some kinda error faced when talking to the livestream backend", e)
      })
  const data = await response?.data
  return data;
}

const destroyStream = async (targetStream) => {
  console.log("destorying stream:", targetStream)
  const livestreamId = targetStream // todo: get livestreamId
  const destoryUrl = LIVESTREAM.DESTORY_STREAM_BASE_URL + livestreamId
  const response = await axios.delete(destoryUrl)
      .catch(e => {
        console.error("there was a network error when trying to destroy a stream", e)
      })
}
export {generateStream, destroyStream};