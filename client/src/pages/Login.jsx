
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../services/api";

function Login() {
  const navigate = useNavigate();

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

      // Save authentication data
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("✅ Login successful!");

      // Redirect to Home page
      navigate("/", { replace: true });
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
    <main className="auth-page">
      <div className="login-container">
        <section className="login-intro">
          <div className="brand-label">🌱 SMART PLANT CARE</div>

          <h1>
            Welcome
            <br />
            Back!
          </h1>

          <p className="intro-description">
            Glad to see you again 🌿
            <br />
            Login to your account and continue your journey towards
            healthier plants.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">🌿</div>
              <h2>Smart Plant Identification</h2>
              <p>Identify plants with AI technology</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">💧</div>
              <h2>Care Recommendations</h2>
              <p>Get personalized plant care tips</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h2>Plant Health Monitor</h2>
              <p>Keep your plants healthy and happy</p>
            </div>
          </div>
        </section>

        <section className="login-card">
          <header className="login-header">
            <div className="login-icon" aria-hidden="true">
              🌱
            </div>

            <h2 className="auth-title">Login to your account</h2>

            <p className="auth-subtitle">
              Enter your credentials to access your account
            </p>
          </header>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "⏳ Logging in..." : "🌿 Login"}
            </button>
          </form>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={
                message.startsWith("❌")
                  ? "scanner-error"
                  : "scanner-success"
              }
              style={{ marginTop: "16px", marginBottom: 0 }}
            >
              {message}
            </div>
          )}

          <div className="login-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="auth-button google-login-button"
            onClick={() =>
              setMessage("Google login is not configured yet.")
            }
          >
            <span className="google-icon" aria-hidden="true">
              G
            </span>
            Login with Google
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <a href="/register">Create an account</a>
          </p>
        </section>
      </div>

      <div className="login-tagline" aria-hidden="true">
        🌿 Grow green, live clean 🌍
      </div>
    </main>
  );
}

export default Login;
