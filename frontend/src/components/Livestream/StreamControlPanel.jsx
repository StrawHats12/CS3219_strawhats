import {destroyStream, fetchPrivateStreamDetails, generateStream} from "../../services/livestream-service";
import {Button, Card, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";

// todo: change to stream controls element which can create, delete streams
const StreamControlPanel = () => {
  const [streamerId, setStreamerId] = useState("12")
  const [livestreamId, setLivestreamId] = useState(undefined)
  const [playbackIds, setPlaybackIds] = useState([])
  const [streamKey, setStreamKey] = useState(undefined)

  const handleStreamCreation = async (e) => {
    e.preventDefault();
    generateStream(streamerId).then(streamData => {
      console.log("Registered for a stream, here's the stream data", streamData)
      setPlaybackIds(streamData.playback_ids)
      setStreamKey(streamData.stream_key)
      setLivestreamId(streamData.live_stream_id)
      setStreamerId(streamData.streamer_id)
    })
  }

  const handleStreamDestroy = async (e) => {
    e.preventDefault();
    destroyStream(livestreamId).then(() => {
      console.log("deleted livestream")
    })
  }

  // attempt to fetch private stream details from the backend:
  useEffect(async () => {
    const response  = await fetchPrivateStreamDetails(streamerId)
    const {live_stream_id, playback_ids, stream_key} = response
    setLivestreamId(live_stream_id);
    setPlaybackIds(playback_ids);
    setStreamKey(stream_key)
  }, [])

  const streamKeyDisplay = streamKey && <Card> Your Stream Key: {streamKey}</Card>;

  const playbackIdDisplay = playbackIds.length > 0
      ? playbackIds.map((pid, idx) => {
        return <div id={idx}>
          <Card> Playback id: {pid.id}</Card>
          <Button
              onClick={handleStreamDestroy}
          >Destroy Stream</Button>
        </div>
      })
      : <p>No playback ids to show</p>


  const generatorForm = <Form>
    <Form.Group className={"mb-3"} controlId={"sellerId"}>
      <Form.Label>Stream Key</Form.Label>
      <Form.Control
          type={"text"}
          placeholder={"Type your unique creator ID here"}
          onChange={(e) => {
            setStreamerId(e.target.value)
          }}
      />
      <Button size={"sm"} variant={"primary"} onClick={handleStreamCreation}>
        Generate stream key
      </Button>
    </Form.Group>
  </Form>

  return <>
    <Container>
      {livestreamId ? playbackIdDisplay: generatorForm}
      {streamKeyDisplay}
    </Container>
  </>
}
export default StreamControlPanel;