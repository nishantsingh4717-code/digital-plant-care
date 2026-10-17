import React, { useState } from "react";
import API_URL from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setMessage("❌ Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from server.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Login failed. Token not received.");
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("✅ Login successful!");

      if (onLogin) {
        onLogin(data.user);
      }
    } catch (error) {
      console.error("Login Error:", error);

      setMessage(
        `❌ ${error.message || "Unable to connect to server."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container">

        <div className="login-intro">
          <h1>
            Welcome
            <br />
            Back!
          </h1>

          <p>
            Glad to see you again 🌱
            <br />
            Login to your account and continue your
            journey towards healthier plants.
          </p>

          <div style={{ marginTop: "35px" }}>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "10px",
                }}
              >
                🌿
              </div>

              <h2
                style={{
                  color: "#174c27",
                  fontSize: "21px",
                  marginBottom: "6px",
                }}
              >
                Smart Plant Identification
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                Identify plants with AI technology
              </p>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "10px",
                }}
              >
                💧
              </div>

              <h2
                style={{
                  color: "#174c27",
                  fontSize: "21px",
                  marginBottom: "6px",
                }}
              >
                Care Recommendations
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                Get personalized plant care tips
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "10px",
                }}
              >
                🛡️
              </div>

              <h2
                style={{
                  color: "#174c27",
                  fontSize: "21px",
                  marginBottom: "6px",
                }}
              >
                Plant Health Monitor
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                Keep your plants healthy & happy
              </p>
            </div>
          </div>
        </div>

        <div className="login-card">

          <div
            style={{
              textAlign: "center",
              marginBottom: "22px",
            }}
          >
            <div
              className="login-icon"
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              🌱
            </div>

            <h2 className="auth-title">
              Login to your account
            </h2>

            <p className="auth-subtitle">
              Enter your credentials to access your account
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            <div className="input-group">
              <label htmlFor="email">
                Email
              </label>

              <div className="input-wrapper">
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

            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  style={{
                    width: "auto",
                    minWidth: "auto",
                  }}
                />
                Remember me
              </label>

              <a href="/forgot-password">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "⏳ Logging in..."
                : "🌿 Login"}
            </button>

          </form>

          {message && (
            <div
              className={
                message.startsWith("❌")
                  ? "scanner-error"
                  : "scanner-success"
              }
              style={{
                marginTop: "18px",
                marginBottom: 0,
              }}
            >
              {message}
            </div>
          )}

          <div className="login-divider">
            OR
          </div>

          <button
            type="button"
            className="auth-button"
            style={{
              background: "#ffffff",
              color: "#333333",
              border: "1px solid #d5ddd7",
            }}
            onClick={() =>
              setMessage(
                "Google login is not configured yet."
              )
            }
          >
            🔵 Login with Google
          </button>

          <div
            className="auth-switch"
            style={{ marginTop: "20px" }}
          >
            Don't have an account?{" "}
            <a href="/register">
              Create an account
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;