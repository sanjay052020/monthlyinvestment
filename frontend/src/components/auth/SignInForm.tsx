import React, { useState, FormEvent, useEffect } from "react";
import { EnvelopeSimple, LockSimple, Eye, EyeSlash } from "phosphor-react";
import "./LoginForm.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loginUser } from "../../features/auth/authSlice";
import Popup from "../common/Popup";
import Cookies from "js-cookie";
import CircleLoader from "../common/CircleLoader";
import { useNavigate } from "react-router-dom";
import ForgotPasswordPopup from "./ForgotPasswordPopup";
import ResetPasswordPopup from "./ResetPasswordPopup";

const SignInForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepLoggedIn: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Validation error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigator = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  // Forgot/reset popup states
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [forgotToken, setForgotToken] = useState(""); // ✅ store token from forgot flow

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!regex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    dispatch(loginUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then((data) => {
        Cookies.set("authToken", data.token, {
          expires: formData.keepLoggedIn ? 7 : undefined,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("userEmail", formData.email);

        setShowPopup(true);
        setFormData({ email: "", password: "", keepLoggedIn: false });
      })
      .catch(() => { });
  };

  useEffect(() => {
    if (token) {
      navigator("/dashboard");
    }
  }, [token, navigator]);

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Email field */}
        <div className="input-wrapper">
          <EnvelopeSimple size={20} weight="bold" className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setEmailError(validateEmail(formData.email))}
            className="login-input"
          />
        </div>
        {emailError && <p className="error-text">{emailError}</p>}

        {/* Password field */}
        <div className="input-wrapper">
          <LockSimple size={20} weight="bold" className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => setPasswordError(validatePassword(formData.password))}
            className="login-input"
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
        {passwordError && <p className="error-text">{passwordError}</p>}

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              name="keepLoggedIn"
              checked={formData.keepLoggedIn}
              onChange={handleChange}
            />
            Keep me logged in
          </label>
          <a
            href="#"
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotPopup(true);
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* Forgot Password Popup */}
        {showForgotPopup && (
          <ForgotPasswordPopup
            onClose={() => setShowForgotPopup(false)}
            onTokenGenerated={(generatedToken) => {
              setForgotToken(generatedToken); // ✅ store token from forgot flow
              setShowForgotPopup(false);
              setShowResetPopup(true);
            }}
          />
        )}

        {/* Reset Password Popup */}
        {showResetPopup && (
          <ResetPasswordPopup
            token={forgotToken} // ✅ use forgotToken, not login token
            onClose={() => setShowResetPopup(false)}
          />
        )}

        <button type="submit" className="login-button">
          SIGN IN
        </button>
      </form>

      {loading && <CircleLoader />}
      {showPopup && (
        <Popup message={token ? "Login successful!" : "Invalid credentials"} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default SignInForm;