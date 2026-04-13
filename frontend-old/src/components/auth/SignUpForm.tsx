import React, { useState, FormEvent } from "react";
import {
    EnvelopeSimple,
    LockSimple,
    Eye,
    EyeSlash,
    User,
    ShieldCheck,
    UsersThree,
    CaretDown
} from "phosphor-react";
import "./LoginForm.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { registerUser } from "../../features/auth/registrationSlice";
import CircleLoader from "../common/CircleLoader";
import Popup from "../common/Popup";

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);


    const dispatch = useDispatch<AppDispatch>();
    const { loading, success, error } = useSelector((state: RootState) => state.registration);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(registerUser({ email, password, role }))
            .unwrap()
            .then(() => setShowPopup(true))
            .catch(() => { });
    };


    // Render icon based on role
    const renderRoleIcon = () => {
        switch (role) {
            case "admin":
                return <ShieldCheck size={28} weight="bold" className="input-icon" />;
            case "manager":
                return <UsersThree size={28} weight="bold" className="input-icon" />;
            default:
                return <User size={28} weight="bold" className="input-icon" />;
        }
    };

    return (
        <>
            <form className="login-form" onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Role dropdown */}
                <div className="input-wrapper">
                    {renderRoleIcon()}
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="login-input dropdown-input"
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                    </select>
                    <CaretDown size={20} weight="bold" className="dropdown-caret" />
                </div>

                {/* Email field */}
                <div className="input-wrapper">
                    <EnvelopeSimple size={22} weight="bold" className="input-icon" />
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                {/* Password field */}
                <div className="input-wrapper">
                    <LockSimple size={22} weight="bold" className="input-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeSlash size={22} weight="bold" />
                        ) : (
                            <Eye size={22} weight="bold" />
                        )}
                    </span>
                </div>

                <button type="submit" className="login-button">SIGN UP</button>
            </form>

            {loading && <CircleLoader />} {/* loader while registering */}

            {showPopup && success && (
                <Popup
                    message="Registration successful!"
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>

    );
};

export default SignUpForm;