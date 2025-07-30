import React, { useState } from 'react'
import '../CSS/Authentication.css'
import { toast } from 'react-toastify';
import { loginUserApi } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        let isValid = true;
        if (email.trim() === "") {
            setEmailError("Email is empty or invalid");
            isValid = false;
        } else {
            setEmailError("");
        }
        if (password.trim() === "") {
            setPasswordError("Password is Required");
            isValid = false;
        } else {
            setPasswordError("");
        }
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        const data = { email, password };

        loginUserApi(data)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    localStorage.setItem("token", res.data.token);

                    localStorage.setItem("user", JSON.stringify(res.data.userData));

                    console.log("🔐 Stored token:", localStorage.getItem("token"));
                    navigate('/');
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                toast.error(error?.response?.data?.message || "Unexpected error");
            });
    };

    const handleForgotPassword = () => {
        setShowModal(true);
        setStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSendOtp = async () => {
        if (!forgotEmail) return toast.error("Please enter your email");
        try {
            const response = await fetch("https://localhost:5000/api/user/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error sending OTP");
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword || !confirmPassword) {
            return toast.error("Enter OTP, new password and confirm password");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        try {
            const response = await fetch("https://localhost:5000/api/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail, otp, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Password reset successful");
                setShowModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error resetting password");
        }
    };

    return (
        <div className="login-green-wrapper">
            <div className="login-green-container">
                <h1 className="login-green-title">Welcome to Sajilo</h1>
                <p className="login-green-subtitle">Your friendly grocery store online</p>

                <form className="login-green-form" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="email" className="login-green-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="e.g. you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`login-green-input ${emailError ? 'error-input' : ''}`}
                    />
                    {emailError && <p className="error-text">{emailError}</p>}

                    <label htmlFor="password" className="login-green-label">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`login-green-input ${passwordError ? 'error-input' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="show-hide-btn"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {passwordError && <p className="error-text">{passwordError}</p>}

                    <button type="submit" className="login-green-submit">Log In</button>
                </form>

                <p className="forgot-password-text" onClick={handleForgotPassword}>
                    Forgot your password?
                </p>

                <p className="signup-text">
                    Don't have an account? <a href="/register" className="signup-link">Register here</a>
                </p>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={() => setShowModal(false)}>×</button>

                        {step === 1 && (
                            <>
                                <h3 className="modal-title">Forgot Password</h3>
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="modal-input"
                                />
                                <button onClick={handleSendOtp} className="modal-button green">Send OTP</button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h3 className="modal-title">Reset Password</h3>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="modal-input"
                                />

                                <div className="password-input-wrapper">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="modal-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="show-hide-btn modal-show-hide"
                                    >
                                        {showNewPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="modal-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="show-hide-btn modal-show-hide"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <button onClick={handleResetPassword} className="modal-button yellow">Reset Password</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
};

export default Login;
