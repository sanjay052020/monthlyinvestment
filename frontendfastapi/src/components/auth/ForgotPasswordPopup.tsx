import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { forgotPassword } from "../../features/auth/forgotPasswordSlice";
import "./ForgotPasswordPopup.css";

interface ForgotPasswordPopupProps {
  onClose: () => void;
  onTokenGenerated: (generatedToken: string) => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ onClose, onTokenGenerated }) => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.forgotPassword);

  const handleSubmit = () => {
    if (!email) return;

    // Dispatch thunk from slice
    dispatch(forgotPassword(email))
      .unwrap()
      .then((data) => {
        // Slice should return { message, token }
        if (data.reset_token) {
          onTokenGenerated(data.reset_token);
          onClose(); // ✅ close popup after success
        }
      })
      .catch(() => {
        // error is already handled in slice state
      });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h3>Forgot Password</h3>
          <span className="popup-close" onClick={onClose}>&times;</span>
        </div>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <div className="popup-actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Generate Token"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;