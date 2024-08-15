import React from 'react';

const Modal = ({ isOpen, onClose, iframeSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <iframe src={iframeSrc} frameBorder="0" title="Job Creation" className="iframe-content"></iframe>
      </div>
    </div>
  );
};

export default Modal;
