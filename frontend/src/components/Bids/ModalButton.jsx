import React from 'react';

const ModalButton = props => (
  <button className="btn btn-dark" onClick={props.handleClick}>
    {props.children}
  </button>);

export default ModalButton;