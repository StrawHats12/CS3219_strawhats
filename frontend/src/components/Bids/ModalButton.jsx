import React from 'react';

const ModalButton = props => (
  <button className="btn btn-lg btn-info" onClick={props.handleClick}>
    {props.children}
  </button>);

export default ModalButton;