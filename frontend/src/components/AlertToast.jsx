import { useState, useEffect } from 'react';

const AlertToast = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x" style={{zIndex: 10000, marginTop: '10px'}}>
      <div className="alert alert-success mb-0 px-3 py-3" role="alert" style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>
        Login required to access this feature!
      </div>
    </div>
  );
};

export default AlertToast;