import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Login API URL:", `${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      // Get response safely
      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Invalid JSON response:", responseText);

        data = {
          message:
            responseText || "Invalid response received from server.",
        };
      }

      console.log("Login API Status:", response.status);
      console.log("Login API Response:", data);

      // API error
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      // Check token
      if (!data.token) {
        throw new Error("Login failed. Token not received.");
      }

      // User may sometimes be returned as data.user
      if (!data.user) {
        throw new Error("Login failed. User information not received.");
      }

      // Save login information
      login(data.user, data.token);

      // Remember Me
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Successful login
      console.log("✅ Login successful");

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.error("❌ Login Error:", err);

      // Network error
      if (
        err.name === "TypeError" &&
        err.message === "Failed to fetch"
      ) {
        setError(
          "Unable to connect to server. Please make sure backend is running on port 5000."
        );
      } else {
        setError(
          err.message || "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Decorative Leaves */}
      <div className="leaf-decoration leaf-one">
        🍃
      </div>

      <div className="leaf-decoration leaf-two">
        🌿
      </div>

      <div className="leaf-decoration leaf-three">
        🍃
      </div>

      <div className="login-container">

        {/* =========================
            LEFT CONTENT
        ========================= */}

        <div className="login-intro">

          <span className="intro-badge">
            🌱 SMART PLANT CARE
          </span>

          <h1>
            Welcome
            <br />
            <span>Back!</span>
          </h1>

          <p className="intro-subtitle">
            Glad to see you again 🌿
          </p>

          <div className="intro-line"></div>

          <p className="intro-description">
            Login to your account and continue
            your journey towards healthier plants.
          </p>

          {/* Feature 1 */}
          <div className="login-feature">

            <div className="feature-icon">
              🌿
            </div>

            <div>
              <h3>
                Smart Plant Identification
              </h3>

              <p>
                Identify plants with AI technology
              </p>
            </div>

          </div>

          {/* Feature 2 */}
          <div className="login-feature">

            <div className="feature-icon">
              💧
            </div>

            <div>
              <h3>
                Care Recommendations
              </h3>

              <p>
                Get personalized plant care tips
              </p>
            </div>

          </div>

          {/* Feature 3 */}
          <div className="login-feature">

            <div className="feature-icon">
              🛡️
            </div>

            <div>
              <h3>
                Plant Health Monitor
              </h3>

              <p>
                Keep your plants healthy & happy
              </p>
            </div>

          </div>

        </div>

        {/* =========================
            LOGIN CARD
        ========================= */}

        <div className="login-card">

          <div className="login-logo">
            🌱
          </div>

          <h2>
            Login to your account
          </h2>

          <p className="login-subtitle">
            Enter your credentials to access your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* =========================
                EMAIL
            ========================= */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* =========================
                PASSWORD
            ========================= */}

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* =========================
                REMEMBER ME / FORGOT
            ========================= */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert(
                    "Password recovery will be added soon."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* =========================
                LOGIN BUTTON
            ========================= */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  🍃 Login
                </>
              )}
            </button>

          </form>

          {/* =========================
              DIVIDER
          ========================= */}

          <div className="login-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>

          {/* =========================
              GOOGLE LOGIN
          ========================= */}

          <button
            type="button"
            className="google-button"
            onClick={() =>
              alert(
                "Google login will be added later."
              )
            }
          >

            <span className="google-icon">
              G
            </span>

            Login with Google

          </button>

          {/* =========================
              REGISTER
          ========================= */}

          <div className="register-text">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

      {/* Bottom Tag */}
      <div className="login-bottom-tag">
        🌿 Grow green, live clean 🌍
      </div>

    </div>
  );
}

export default Login;