import {generateStream} from "../../services/livestream-service";
import {Button, Card, Container, Form} from "react-bootstrap";
import {useState} from "react";

// todo: change to stream controls element which can create, delete streams
const StreamCreator = () => {
  const [sellerId, setSellerId] = useState("12")
  const [livestreamId, setLivestreamId] = useState(undefined)
  const [playbackIds, setPlaybackIds] = useState([])

  const handleCreation = async (e) => {
    e.preventDefault();
    generateStream(sellerId).then(streamData => {
      console.log("Registered for a stream, here's the stream data", streamData)
      setPlaybackIds(streamData.playback_ids)
    })
  }

  const playbackIdDisplay = playbackIds.length > 0
      ? playbackIds.map((pid, idx) => {
        return <Card> Playback id: {pid.id}</Card>
      })
      : <p>No playback ids to show</p>

  return <>
    <Container>
      <Form>
        <Form.Group className={"mb-3"} controlId={"sellerId"}>
          <Form.Label>Stream Key</Form.Label>
          <Form.Control
              type={"text"}
              placeholder={"Type your unique creator ID here"}
              onChange={(e) => {
                setSellerId(e.target.value)
              }}
          />
          <Button size={"sm"} variant={"primary"} onClick={handleCreation}>
            <p>Generate stream key</p>
          </Button>
        </Form.Group>
      </Form>
      {playbackIdDisplay}
    </Container>
  </>
}
export default StreamCreator;