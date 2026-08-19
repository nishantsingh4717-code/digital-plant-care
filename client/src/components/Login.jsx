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

      console.log(
        "Login API URL:",
        `${API_URL}/auth/login`
      );

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Status:", response.status);
      console.log("Login Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      if (!data.token) {
        throw new Error(
          "Login failed. Token not received."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("✅ Login successful!");

      if (onLogin) {
        onLogin(data.user);
      }

    } catch (error) {
      console.error(
        "❌ Login Error:",
        error
      );

      setMessage(
        `❌ ${
          error.message ||
          "Unable to connect to server."
        }`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-icon">
          🌱
        </div>

        <h1>
          Smart Plant Care
        </h1>

        <h2>
          Login
        </h2>

        <p>
          Login to scan and manage your plants.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "⏳ Logging in..."
              : "🔐 Login"}
          </button>

        </form>

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default Login;