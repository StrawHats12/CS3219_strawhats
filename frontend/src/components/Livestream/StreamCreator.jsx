import {registerStream} from "../../services/livestream-service";
import {Button, Container, Form} from "react-bootstrap";
import {useState} from "react";

// todo: change to stream controls element which can create, delete streams
const StreamCreator = () => {
  const [sellerId, setSellerId] = useState("12")

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerStream(sellerId).then(streamKey => {
      console.log("Registered for a stream, here's the stream key", streamKey)
    })
  }

  return <>
    <Container>
      <Form>
        <Form.Group className={"mb-3"} controlId={"sellerId"}>
          <Form.Label>Stream Key</Form.Label>
          <Form.Control
              type={"text"}
              placeholder={"Type your unique creator ID here"}
              onChange={(e) => {setSellerId(e.target.value)}}
          />
          <Button size={"sm"} variant={"primary"} onClick={handleSubmit}>
            <p>Get stream key</p>
          </Button>
        </Form.Group>
      </Form>
    </Container>
  </>
}
export default StreamCreator;