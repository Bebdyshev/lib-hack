import React from 'react';
import './Dialog.css';

const Dialog = ({ open, onClose, description }) => {
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="dialog-close" onClick={onClose}>✖</button>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Dialog;
