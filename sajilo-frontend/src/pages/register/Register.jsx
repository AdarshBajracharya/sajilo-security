import React, { useState } from 'react';
import '../CSS/Authentication.css';
import { registerUserApi } from '../../apis/Api';
import { verifyOtpApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // State variables
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP modal states
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Handle inputs
  const handleFullName = (e) => setFullName(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return "";
    let score = 0;
    Object.values(requirements).forEach(({ test }) => {
      if (test(pwd)) score++;
    });

    if (score <= 2) return "Weak";
    if (score === 3) return "Moderate";
    if (score === 4) return "Good";
    if (score === 5) return "Excellent";
    return "";
  };

  const requirements = {
    length: { test: (pwd) => pwd.length >= 8, label: "At least 8 characters" },
    uppercase: { test: (pwd) => /[A-Z]/.test(pwd), label: "One uppercase letter" },
    lowercase: { test: (pwd) => /[a-z]/.test(pwd), label: "One lowercase letter" },
    number: { test: (pwd) => /[0-9]/.test(pwd), label: "One number" },
    specialChar: { test: (pwd) => /[@$!%*?&]/.test(pwd), label: "One special character (@$!%*?&)" }
  };

  const handleOtp = (e) => setOtp(e.target.value);

  const validate = () => {
    let isValid = true;
    setFullNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");

    if (fullName.trim() === "") {
      setFullNameError("Fullname is Required");
      isValid = false;
    }
    if (phone.trim() === "") {
      setPhoneError("Phone is Required");
      isValid = false;
    }
    if (email.trim() === "") {
      setEmailError("Email is Required");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Password is Required");
      isValid = false;
    } else {
      const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordStrengthRegex.test(password)) {
        setPasswordError("Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOtpError("");

    if (!validate()) return;

    registerUserApi({ fullName, phone, email, password })
      .then(res => {
        if (res.data.success) {
          toast.success("OTP sent to your email.");
          setIsOtpModalVisible(true);
        } else {
          toast.error(res.data.message || "Failed to send OTP.");
        }
      })
      .catch(() => {
        toast.error("Failed to send OTP.");
      });
  };

  const handleOtpSubmit = () => {
    if (otp.trim() === "") {
      setOtpError("OTP is required");
      return;
    }

    verifyOtpApi({ email, otp })
      .then(res => {
        if (res.data.success) {
          toast.success("OTP verified successfully");
          const userData = { fullName, phone, email, password };
          registerUserApi(userData)
            .then(res => {
              if (res.data.success) {
                toast.success("Registration successful!");
                setIsOtpModalVisible(false);
                navigate('/');
              } else {
                toast.error("Registration failed.");
              }
            })
            .catch(() => toast.error("Error creating user"));
        } else {
          toast.error("Invalid OTP.");
        }
      })
      .catch(() => {
        toast.error("OTP verification failed.");
      });
  };

  return (
    <div className="login-green-wrapper">
      <div className="login-green-container">
        <h1 className="login-green-title">Register</h1>
        <form className="login-green-form" onSubmit={handleSubmit} noValidate>
          <label className="login-green-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            className={`login-green-input ${fullNameError ? "error-input" : ""}`}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={handleFullName}
          />
          {fullNameError && <p className="error-text">{fullNameError}</p>}

          <label className="login-green-label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            className={`login-green-input ${phoneError ? "error-input" : ""}`}
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={handlePhone}
          />
          {phoneError && <p className="error-text">{phoneError}</p>}

          <label className="login-green-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            className={`login-green-input ${emailError ? "error-input" : ""}`}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmail}
          />
          {emailError && <p className="error-text">{emailError}</p>}

          <label className="login-green-label" htmlFor="password">Password</label>
          <input
            id="password"
            className={`login-green-input ${passwordError ? "error-input" : ""}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />
          {passwordError && <p className="error-text">{passwordError}</p>}

          {password.length > 0 && (
            <>
              <ul className="password-requirements" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {Object.entries(requirements).map(([key, { test, label }]) => {
                  const passed = test(password);
                  return (
                    <li key={key} style={{ color: passed ? 'lightgreen' : 'pink', marginBottom: 3 }}>
                      {passed ? "✅" : "❌"} {label}
                    </li>
                  );
                })}
              </ul>

              {passwordStrength && (
                <p
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                  style={{
                    color:
                      passwordStrength === "Weak" ? "pink" :
                      passwordStrength === "Moderate" ? "orange" :
                      passwordStrength === "Good" ? "lightblue" :
                      "lightgreen"
                  }}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </>
          )}

          <button type="submit" className="login-green-submit">Register</button>
        </form>

        <p className="signup-text">
          Already have an account? <a href="/login" className="signup-link">Login here</a>
        </p>
      </div>

      {/* Custom modal */}
      {isOtpModalVisible && (
        <div className="modal-backdrop" onClick={() => setIsOtpModalVisible(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setIsOtpModalVisible(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="modal-title">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtp}
              className="modal-input"
            />
            {otpError && <p className="error-text">{otpError}</p>}
            <button className="modal-button green" onClick={handleOtpSubmit}>Verify OTP</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
