import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ================================
    // Validation
    // ================================

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // ================================
      // Register API
      // ================================

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      // ================================
      // Read Response
      // ================================

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message:
            responseText ||
            "Invalid response from server.",
        };
      }

      console.log(
        "Register API Status:",
        response.status
      );

      console.log(
        "Register API Response:",
        data
      );

      // ================================
      // Handle Error
      // ================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Registration failed."
        );
      }

      // ================================
      // Success
      // ================================

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Clear form

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "❌ Register Error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =====================================
          DECORATIVE LEAVES
      ===================================== */}

      <div className="leaf-decoration leaf-one">
        🍃
      </div>

      <div className="leaf-decoration leaf-two">
        🌿
      </div>

      <div className="leaf-decoration leaf-three">
        🍃
      </div>


      {/* =====================================
          REGISTER CONTAINER
      ===================================== */}

      <div className="login-container">

        {/* ===================================
            LEFT CONTENT
        =================================== */}

        <div className="login-intro">

          <span className="intro-badge">
            🌱 SMART PLANT CARE
          </span>

          <h1>
            Start Your
            <br />
            <span>Green Journey!</span>
          </h1>

          <p className="intro-subtitle">
            Create your account 🌿
          </p>

          <div className="intro-line"></div>

          <p className="intro-description">
            Join Smart Plant Care and use AI-powered
            technology to identify and care for your
            plants.
          </p>


          {/* Feature 1 */}

          <div className="login-feature">

            <div className="feature-icon">
              🌿
            </div>

            <div>
              <h3>
                AI Plant Identification
              </h3>

              <p>
                Identify plants using AI technology
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
                Personalized Care
              </h3>

              <p>
                Get useful plant care recommendations
              </p>
            </div>

          </div>


          {/* Feature 3 */}

          <div className="login-feature">

            <div className="feature-icon">
              🌱
            </div>

            <div>
              <h3>
                Save Your Plants
              </h3>

              <p>
                Keep your plants in your collection
              </p>
            </div>

          </div>

        </div>


        {/* ===================================
            REGISTER CARD
        =================================== */}

        <div className="login-card">

          {/* Plant Logo */}

          <div className="login-logo">
            🌱
          </div>


          <h2>
            Create your account
          </h2>

          <p className="login-subtitle">
            Register to start managing your plants
          </p>


          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}


          {/* =================================
              SUCCESS
          ================================= */}

          {success && (
            <div className="scanner-success">
              ✅ {success}
            </div>
          )}


          {/* =================================
              FORM
          ================================= */}

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="login-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* Email */}

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


            {/* Password */}

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div className="login-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔐
                </span>

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* Register Button */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "🌱 Create Account"}
            </button>

          </form>


          {/* =================================
              LOGIN LINK
          ================================= */}

          <div className="register-text">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login here
            </Link>

          </div>

        </div>

      </div>


      {/* =====================================
          BOTTOM TAG
      ===================================== */}

      <div className="login-bottom-tag">
        🌿 Grow green, live clean 🌍
      </div>

    </div>
  );
}

export default Register;