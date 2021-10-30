import React from 'react';

const ModalButton = props => (
  <button class="btn btn-dark" onClick={props.handleClick}>
    {props.children}
  </button>);

export default ModalButton;