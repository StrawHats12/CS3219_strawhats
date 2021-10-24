import {destroyStream, fetchPrivateStreamDetails, generateStream} from "../../services/livestream-service";
import {Button, Card, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";

// todo: change to stream controls element which can create, delete streams
const StreamControlPanel = (props) => {
  const {streamerId/* ,playbackIds, updatePlaybackIds*/} = props
  const [livestreamId, setLivestreamId] = useState(undefined)
  const [playbackIds, setPlaybackIds] = useState([])
  const [streamKey, setStreamKey] = useState(undefined)

  const handleStreamCreation = async (e) => {
    e.preventDefault();
    generateStream(streamerId).then(streamData => {
      console.log("Registered for a stream, here's the stream data", streamData)
      setPlaybackIds(streamData.playback_ids) // to deprecate
      // updatePlaybackIds(streamData.playback_ids)
      setStreamKey(streamData.stream_key)
      setLivestreamId(streamData.live_stream_id)
    })
  }

  const handleStreamDestroy = async (e) => {
    e.preventDefault();
    destroyStream(streamerId).then(() => {
      console.log("deleted livestream for streamer id:", streamerId)
    })
    setLivestreamId(undefined)
    // updatePlaybackIds([])
    setPlaybackIds([])
    setStreamKey(undefined)
  }

  // attempt to fetch private stream details from the backend:
  useEffect(async () => {
    const response = await fetchPrivateStreamDetails(streamerId)
    if (response) {
      const {live_stream_id, playback_ids, stream_key} = response
      setLivestreamId(live_stream_id);
      setPlaybackIds(playback_ids);
      // updatePlaybackIds(playback_ids);
      console.log("synced w backend, playback ids: ", playback_ids)
      setStreamKey(stream_key)
    }
  }, [])

  const streamKeyDisplay = streamKey && <Card> Your Stream Key: {streamKey}</Card>;

  const playbackIdDisplay = playbackIds && playbackIds.length > 0
      ? playbackIds.map((pid, idx) => {
        return <div key={idx}>
          <Card> Playback id: {pid.id}</Card>
          <Button
              onClick={handleStreamDestroy}
          >Destroy Stream</Button>
        </div>
      })
      : <p>No playback ids to show</p>


  const generatorForm = <Form>
    <Button size={"sm"} variant={"primary"} onClick={handleStreamCreation}>
      Generate stream key
    </Button>
  </Form>

  return <>
    <Container>
      {livestreamId ? playbackIdDisplay : generatorForm}
      {streamKeyDisplay}
    </Container>
  </>
}
export default StreamControlPanel;