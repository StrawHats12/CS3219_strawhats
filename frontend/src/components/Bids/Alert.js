import { Button, Modal } from "react-bootstrap";

const Alert = (props) => {
  return (
    <Modal centered show={props.show} onHide={props.onDismiss}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.text}</Modal.Body>
      <Modal.Footer>
        {props.showCancelButton && (
          <Button variant="secondary" onClick={props.onDismiss}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={props.onConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Alert;
