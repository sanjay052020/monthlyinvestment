import React, { useState } from "react";
import "./LoginForm.css";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="login-container">
      <div className="login-tabs">
        <span
          className={activeTab === "signin" ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </span>
        <span
          className={activeTab === "signup" ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </span>
      </div>

      {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
};

export default LoginForm;