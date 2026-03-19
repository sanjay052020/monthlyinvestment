import React, { useEffect, useRef } from "react";
import "./Popup.css";

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  const okButtonRef = useRef<HTMLButtonElement>(null);

  // ✅ Focus the OK button when popup opens
  useEffect(() => {
    okButtonRef.current?.focus();
  }, []);

  // ✅ Handle keyboard events globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(); // close popup on Escape
      }
      if (e.key === "Enter") {
        onClose(); // close popup on Enter
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-box">
        <p>{message}</p>
        <button ref={okButtonRef} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;