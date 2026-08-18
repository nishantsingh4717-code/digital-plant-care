import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PlantScanner from "./components/PlantScanner";
import MyPlants from "./components/MyPlants";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function Home() {
  return (
    <div className="app">

      <Navbar />

      <section
        className="hero"
        id="home"
      >
        <div className="hero-content">

          <span className="badge">
            🤖 AI Powered Plant Assistant
          </span>

          <h1>
            Smart Digital
            <br />
            <span>
              Plant Care Assistant
            </span>
          </h1>

          <p>
            Identify your plants, detect possible
            diseases, and get personalized plant-care
            recommendations using Artificial Intelligence.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              document
                .getElementById("scanner")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            🌿 Scan Your Plant
          </button>

        </div>

        <div className="hero-card">

          <div className="plant-icon">
            🌱
          </div>

          <h2>
            Healthy Plant
          </h2>

          <p>
            Your intelligent assistant for better
            plant care and monitoring.
          </p>

          <div className="status">
            <span>●</span>
            AI System Ready
          </div>

        </div>

      </section>

      <section
        className="scanner-section"
        id="scanner"
      >

        <div className="section-heading">

          <span className="small-title">
            AI PLANT SCANNER
          </span>

          <h2>
            Identify Your Plant
          </h2>

          <p>
            Upload a plant image or use your camera
            to scan your plant.
          </p>

        </div>

        <div className="scanner-card">
          <PlantScanner />
        </div>

      </section>

      <section
        className="features"
        id="care"
      >

        <div className="section-heading">

          <span className="small-title">
            SMART FEATURES
          </span>

          <h2>
            Everything Your Plant Needs
          </h2>

          <p>
            Our system will help you understand and
            take better care of your plants.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div>
              🌿
            </div>

            <h3>
              Plant Identification
            </h3>

            <p>
              AI identifies the plant from an
              uploaded or captured image.
            </p>

          </div>

          <div className="feature-card">

            <div>
              🦠
            </div>

            <h3>
              Disease Detection
            </h3>

            <p>
              Detect possible plant diseases
              from leaf and plant images.
            </p>

          </div>

          <div className="feature-card">

            <div>
              💧
            </div>

            <h3>
              Watering Guide
            </h3>

            <p>
              Get personalized watering
              recommendations for your plant.
            </p>

          </div>

          <div className="feature-card">

            <div>
              ☀️
            </div>

            <h3>
              Sunlight Advice
            </h3>

            <p>
              Know how much sunlight your
              plant needs for healthy growth.
            </p>

          </div>

        </div>

      </section>

      <section className="about">

        <div className="section-heading">

          <span className="small-title">
            HOW IT WORKS
          </span>

          <h2>
            Smart Plant Care in 3 Steps
          </h2>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div>
              📷
            </div>

            <h3>
              1. Scan
            </h3>

            <p>
              Upload a plant image or capture
              one using your camera.
            </p>

          </div>

          <div className="feature-card">

            <div>
              🤖
            </div>

            <h3>
              2. AI Analysis
            </h3>

            <p>
              AI analyzes the plant image and
              identifies the plant.
            </p>

          </div>

          <div className="feature-card">

            <div>
              🌱
            </div>

            <h3>
              3. Get Care Advice
            </h3>

            <p>
              Receive information about watering,
              sunlight, fertilizer and diseases.
            </p>

          </div>

        </div>

      </section>

      <section
        className="about"
        id="about"
      >

        <div className="section-heading">

          <span className="small-title">
            ABOUT PROJECT
          </span>

          <h2>
            About Smart Plant Care
          </h2>

          <p>
            Smart AI Plant Care Assistant is a MERN
            stack based digital plant-care platform.
            It combines Artificial Intelligence,
            image processing and smart hardware to
            help users monitor and care for their plants.
          </p>

        </div>

      </section>

      <section className="features">

        <div className="section-heading">

          <span className="small-title">
            FUTURE HARDWARE INTEGRATION
          </span>

          <h2>
            Connect Software With Smart Hardware
          </h2>

          <p>
            Sensors can be connected to monitor
            real-time plant conditions.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div>
              💧
            </div>

            <h3>
              Soil Moisture
            </h3>

            <p>
              Monitor soil moisture using
              a moisture sensor.
            </p>

          </div>

          <div className="feature-card">

            <div>
              🌡️
            </div>

            <h3>
              Temperature
            </h3>

            <p>
              Monitor the temperature around
              the plant.
            </p>

          </div>

          <div className="feature-card">

            <div>
              💡
            </div>

            <h3>
              Light Level
            </h3>

            <p>
              Monitor the amount of light
              reaching the plant.
            </p>

          </div>

          <div className="feature-card">

            <div>
              📊
            </div>

            <h3>
              Live Dashboard
            </h3>

            <p>
              Display sensor data on the
              web dashboard in real time.
            </p>

          </div>

        </div>

      </section>

      <footer>

        <p>
          🌱 Smart AI Plant Care System
        </p>

        <span>
          DTI Project • MERN Stack
        </span>

      </footer>

    </div>
  );
}

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function MyPlantsPage() {
  return (
    <div className="app">

      <Navbar />

      <MyPlants />

    </div>
  );
}

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-plants"
          element={
            <ProtectedRoute>
              <MyPlantsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <div className="app">
                <Navbar />
                <section className="scanner-section">
                  <div className="section-heading">
                    <span className="small-title">
                      AI PLANT SCANNER
                    </span>

                    <h2>
                      Identify Your Plant
                    </h2>

                    <p>
                      Upload a plant image or use your
                      camera to scan your plant.
                    </p>
                  </div>

                  <div className="scanner-card">
                    <PlantScanner />
                  </div>
                </section>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;