import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { resetPassword } from "../features/auth/resetPasswordSlice";
import { Eye, EyeSlash } from "phosphor-react"; // 👈 import icons
import "./ResetPasswordPopup.css";

interface ResetPasswordPopupProps {
  token: string;
  onClose: () => void;
}

const ResetPasswordPopup: React.FC<ResetPasswordPopupProps> = ({ token, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.resetPassword);

  const handleReset = () => {
    dispatch(resetPassword({ token, newPassword }));
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h3>Reset Password</h3>
          <span className="popup-close" onClick={onClose}>&times;</span>
        </div>

        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlash size={20} weight="bold" />
            ) : (
              <Eye size={20} weight="bold" />
            )}
          </span>
        </div>

        <div className="popup-actions">
          <button onClick={handleReset} disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPopup;