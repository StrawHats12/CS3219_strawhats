import React from 'react';
import Modal from 'react-modal';
import { AddBid } from '../../services/bidding-service';
import ModalButton from './ModalButton';

class PopUp extends React.Component {
  constructor(contact) {
    super(contact);
    this.state = { 
        modalOpened: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({ modalOpened: !prevState.modalOpened }));
  }

  render() {
    const listingInfo = this.props.listingInfo;

    return (
      <div>
        <ModalButton handleClick={this.toggleModal}>
          Add Bid
        </ModalButton>
        <Modal
          isOpen={this.state.modalOpened}
          onRequestClose={this.toggleModal}
          contentLabel="Modal with image"
        >
       <AddBid listingInfo = {listingInfo}/>
       <br/>
        <button onClick={this.toggleModal}
        className="btn btn-lg btn-info"> Close </button>
        </Modal>
      </div>
    );
  }
}

export default PopUp;