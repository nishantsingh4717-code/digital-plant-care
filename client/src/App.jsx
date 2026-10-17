
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
  const scrollToScanner = () => {
    document.getElementById("scanner")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="hero" id="home">
          <div className="hero-container">
            <div className="hero-content">
              <span className="badge">
                🤖 AI-Powered Plant Assistant
              </span>

              <h1>
                Smart Digital
                <br />
                <span>Plant Care Assistant</span>
              </h1>

              <p>
                Identify your plants, discover possible diseases,
                and get personalized plant-care recommendations
                with our intelligent plant-care platform.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={scrollToScanner}
                >
                  🌿 Scan Your Plant
                </button>

                <a className="secondary-button" href="#features">
                  Explore Features
                </a>
              </div>

              <div className="hero-highlights">
                <span>✓ Plant Identification</span>
                <span>✓ Care Recommendations</span>
                <span>✓ Save Your Plants</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card">
                <div className="hero-plant-art" role="img" aria-label="Growing plant">
                  🌱
                </div>

                <span className="hero-card-tag">
                  YOUR PLANT COMPANION
                </span>

                <h2>Grow Better, Naturally</h2>

                <p>
                  Make informed plant-care decisions with
                  helpful digital tools.
                </p>

                <div className="status">
                  <span className="status-dot" />
                  Plant care made simple
                </div>
              </div>

              <div className="floating-leaf leaf-one">🍃</div>
              <div className="floating-leaf leaf-two">🌿</div>
            </div>
          </div>
        </section>

        <section className="scanner-section" id="scanner">
          <div className="section-container">
            <div className="section-heading">
              <span className="small-title">AI PLANT SCANNER</span>
              <h2>Identify Your Plant</h2>
              <p>
                Upload a plant image or use your camera to scan it.
                Get plant information and care guidance from the
                connected AI service.
              </p>
            </div>

            <div className="scanner-card">
              <PlantScanner />
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-container">
            <div className="section-heading">
              <span className="small-title">SMART FEATURES</span>
              <h2>Everything Your Plant Needs</h2>
              <p>
                Helpful features to make everyday plant care easier.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon">🌿</div>
                <h3>Plant Identification</h3>
                <p>
                  Submit a plant image and view identification
                  information returned by the AI service.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🦠</div>
                <h3>Disease Insights</h3>
                <p>
                  Get possible disease information when supported
                  by the image analysis service.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">💧</div>
                <h3>Watering Guidance</h3>
                <p>
                  Learn watering recommendations suited to the
                  plant information returned by the system.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">☀️</div>
                <h3>Sunlight Advice</h3>
                <p>
                  Explore sunlight guidance to help you care
                  for your plant.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🪴</div>
                <h3>My Plants</h3>
                <p>
                  Save plants to your collection and revisit
                  the information stored in your account.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Camera Scanning</h3>
                <p>
                  Capture a plant image directly with a supported
                  device camera.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="steps-section">
          <div className="section-container">
            <div className="section-heading">
              <span className="small-title">HOW IT WORKS</span>
              <h2>Plant Care in Three Steps</h2>
              <p>
                Follow a simple process to get started with
                your digital plant-care assistant.
              </p>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>
                <div className="step-icon">📷</div>
                <h3>Scan Your Plant</h3>
                <p>
                  Upload an image or capture a photo using
                  your device camera.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">02</span>
                <div className="step-icon">🤖</div>
                <h3>Analyze the Image</h3>
                <p>
                  Send the image to the connected AI service
                  for analysis.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">03</span>
                <div className="step-icon">🌱</div>
                <h3>Explore Care Advice</h3>
                <p>
                  Review the returned information and save
                  your plant if the feature is available.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-container about-container">
            <div className="about-visual">
              <div className="about-plant-circle">🪴</div>
              <span className="about-decoration decoration-one">🍃</span>
              <span className="about-decoration decoration-two">🌿</span>
            </div>

            <div className="about-content">
              <span className="small-title">ABOUT THE PROJECT</span>
              <h2>Technology Meets Plant Care</h2>
              <p>
                Smart AI Plant Care Assistant is a web-based
                plant-care project built with a React frontend
                and a Node.js/Express backend. It brings together
                plant image analysis, account authentication,
                and saved-plant management.
              </p>
              <p>
                The aim is to make plant information easier to
                access and help users organize their plant-care
                activities through one platform.
              </p>

              <a href="#scanner" className="primary-button about-button">
                Try Plant Scanner
              </a>
            </div>
          </div>
        </section>

        <section className="hardware-section" id="hardware">
          <div className="section-container">
            <div className="section-heading">
              <span className="small-title">HARDWARE INTEGRATION</span>
              <h2>A Smarter Way to Monitor Plants</h2>
              <p>
                These are potential sensor-based extensions for
                future versions of the project. They require
                suitable hardware and backend integration.
              </p>
            </div>

            <div className="feature-grid hardware-grid">
              <article className="feature-card">
                <div className="feature-icon">💧</div>
                <h3>Soil Moisture</h3>
                <p>
                  A soil moisture sensor can help estimate
                  when a plant may need watering.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🌡️</div>
                <h3>Temperature</h3>
                <p>
                  A compatible temperature sensor can measure
                  the surrounding conditions.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>Light Level</h3>
                <p>
                  A light sensor can measure the light reaching
                  the plant.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Sensor Dashboard</h3>
                <p>
                  With suitable connections, readings can be
                  displayed on a web dashboard.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="footer-brand" href="#home">
            🌱 Smart Plant Care
          </a>

          <p>
            Helping you care for your plants with digital tools.
          </p>

          <span>DTI Project · MERN Stack</span>

          <a className="back-to-top" href="#home">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MyPlantsPage() {
  return (
    <div className="app inner-page">
      <Navbar />
      <MyPlants />
    </div>
  );
}

function ScannerPage() {
  return (
    <div className="app inner-page">
      <Navbar />

      <section className="scanner-section scanner-page-section">
        <div className="section-container">
          <div className="section-heading">
            <span className="small-title">AI PLANT SCANNER</span>
            <h2>Identify Your Plant</h2>
            <p>
              Upload a plant image or use your camera to scan it.
            </p>
          </div>

          <div className="scanner-card">
            <PlantScanner />
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
              <ScannerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
