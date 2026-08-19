import React, { useEffect, useRef, useState } from "react";

import API_URL from "../services/api";

function PlantScanner() {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "You are not logged in. Please login again."
      );
    }

    return token;
  };

  // =========================================================
  // FILE UPLOAD
  // =========================================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess("");
    setResult(null);
    setSaved(false);

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setImage(previewUrl);
  };

  // =========================================================
  // TURN FLASHLIGHT ON
  // =========================================================

  const turnFlashlightOn = async (stream) => {
    try {
      const videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        console.log("🔦 No video track found.");
        return false;
      }

      // Check whether torch is supported
      const capabilities =
        typeof videoTrack.getCapabilities === "function"
          ? videoTrack.getCapabilities()
          : {};

      console.log("📷 Camera Capabilities:", capabilities);

      if (!capabilities.torch) {
        console.log(
          "🔦 Flashlight/Torch is not supported on this device."
        );

        return false;
      }

      await videoTrack.applyConstraints({
        advanced: [
          {
            torch: true,
          },
        ],
      });

      console.log("🔦 Flashlight ON");

      return true;
    } catch (err) {
      console.error(
        "🔦 Flashlight ON Error:",
        err
      );

      return false;
    }
  };

  // =========================================================
  // TURN FLASHLIGHT OFF
  // =========================================================

  const turnFlashlightOff = async () => {
    try {
      const stream = streamRef.current;

      if (!stream) {
        return;
      }

      const videoTrack =
        stream.getVideoTracks()[0];

      if (!videoTrack) {
        return;
      }

      const capabilities =
        typeof videoTrack.getCapabilities === "function"
          ? videoTrack.getCapabilities()
          : {};

      if (!capabilities.torch) {
        return;
      }

      await videoTrack.applyConstraints({
        advanced: [
          {
            torch: false,
          },
        ],
      });

      console.log("🔦 Flashlight OFF");
    } catch (err) {
      console.error(
        "🔦 Flashlight OFF Error:",
        err
      );
    }
  };

  // =========================================================
  // OPEN CAMERA
  // =========================================================

  const openCamera = async () => {
    try {
      setError("");
      setSuccess("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Camera is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      // =====================================================
      // TURN FLASHLIGHT ON AUTOMATICALLY
      // =====================================================

      await turnFlashlightOn(stream);

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current
            .play()
            .catch((error) => {
              console.error(
                "Video Play Error:",
                error
              );
            });
        }
      }, 100);
    } catch (err) {
      console.error(
        "Camera Error:",
        err
      );

      setError(
        "Unable to access camera. Please allow camera permission and try again."
      );
    }
  };

  // =========================================================
  // CLOSE CAMERA
  // =========================================================

  const closeCamera = async () => {
    // First turn flashlight OFF
    await turnFlashlightOff();

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // =========================================================
  // CAPTURE IMAGE
  // =========================================================

  const captureImage = () => {
    const video = videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setError(
        "Camera is not ready. Please wait a moment and try again."
      );
      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture image.");
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to capture image.");
          return;
        }

        const capturedFile =
          new File(
            [blob],
            "plant-camera-image.jpg",
            {
              type: "image/jpeg",
            }
          );

        if (image) {
          URL.revokeObjectURL(image);
        }

        const previewUrl =
          URL.createObjectURL(
            capturedFile
          );

        setFile(capturedFile);
        setImage(previewUrl);
        setResult(null);
        setSaved(false);
        setError("");
        setSuccess("");

        // Close camera and turn flashlight OFF
        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setFile(null);
    setImage(null);
    setResult(null);
    setSaved(false);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // ANALYZE PLANT
  // =========================================================

  const analyzePlant = async () => {
    if (!file) {
      setError(
        "Please upload or capture a plant image first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setResult(null);
      setSaved(false);

      const token = getToken();

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/ai/analyze`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const responseText =
        await response.text();

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
        "AI API Status:",
        response.status
      );

      console.log(
        "AI API Response:",
        data
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (!data.analysis) {
        throw new Error(
          "AI analysis data was not received."
        );
      }

      setResult(data.analysis);

      setSuccess(
        "🌱 Plant analyzed successfully!"
      );
    } catch (err) {
      console.error(
        "Plant Analysis Error:",
        err
      );

      setError(
        err.message ||
          "Failed to analyze plant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SAVE PLANT
  // =========================================================

  const savePlant = async () => {
    if (!result) {
      setError(
        "Please analyze the plant first."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      const formData = new FormData();

      formData.append(
        "plantName",
        result.plantName ||
          "Unknown Plant"
      );

      formData.append(
        "scientificName",
        result.scientificName || ""
      );

      formData.append(
        "plantType",
        result.plantType ||
          "Unknown"
      );

      formData.append(
        "healthStatus",
        result.healthStatus ||
          ""
      );

      formData.append(
        "disease",
        result.disease ||
          ""
      );

      formData.append(
        "description",
        result.description ||
          ""
      );

      formData.append(
        "waterFrequency",
        result.waterFrequency ||
          ""
      );

      formData.append(
        "sunlight",
        result.sunlight ||
          ""
      );

      formData.append(
        "temperature",
        result.temperature ||
          ""
      );

      formData.append(
        "humidity",
        result.humidity ||
          ""
      );

      formData.append(
        "fertilizer",
        result.fertilizer ||
          ""
      );

      formData.append(
        "location",
        "My Garden"
      );

      if (
        Array.isArray(result.careTips)
      ) {
        formData.append(
          "careTips",
          JSON.stringify(
            result.careTips
          )
        );
      }

      if (file) {
        formData.append(
          "image",
          file
        );
      }

      const response = await fetch(
        `${API_URL}/plants/add`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const responseText =
        await response.text();

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
        "Save Plant Status:",
        response.status
      );

      console.log(
        "Save Plant Response:",
        data
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to save plant."
        );
      }

      setSaved(true);

      setSuccess(
        "🌱 Plant saved successfully to your collection!"
      );

      console.log(
        "Saved Plant:",
        data.plant
      );
    } catch (err) {
      console.error(
        "Save Plant Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save plant."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CAMERA SCREEN
  // =========================================================

  if (cameraOpen) {
    return (
      <div className="camera-container">

        <div className="camera-header">

          <div>
            <span className="camera-live-dot">
              ●
            </span>

            Camera Scanner
          </div>

          <button
            type="button"
            className="camera-close"
            onClick={closeCamera}
          >
            ✕
          </button>

        </div>

        <div className="camera-preview">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />

          <div className="camera-frame"></div>

        </div>

        <div className="camera-controls">

          <button
            type="button"
            className="capture-button"
            onClick={captureImage}
            aria-label="Capture plant image"
          >
            <span></span>
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN SCANNER
  // =========================================================

  return (
    <div className="plant-scanner">

      {!image && (
        <div className="scanner-empty">

          <div className="scanner-icon">
            🌿
          </div>

          <h3>
            Scan Your Plant
          </h3>

          <p>
            Upload a clear photo of your plant
            or use your camera for AI analysis.
          </p>

          <div className="scanner-actions">

            <button
              type="button"
              className="scanner-upload-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              📁 Upload Image
            </button>

            <button
              type="button"
              className="scanner-camera-button"
              onClick={openCamera}
            >
              📷 Open Camera
            </button>

          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            hidden
          />

          <p className="scanner-note">
            Supported: JPG, JPEG, PNG • Maximum 5MB
          </p>

        </div>
      )}

      {image && (
        <div className="image-preview-container">

          <div className="preview-header">

            <div>
              <span className="preview-check">
                ✓
              </span>

              Plant Image Ready
            </div>

            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
              disabled={
                loading || saving
              }
            >
              ✕
            </button>

          </div>

          <div className="preview-image-wrapper">

            <img
              src={image}
              alt="Selected plant"
              className="preview-image"
            />

          </div>

          <div className="preview-info">

            <div>

              <strong>
                Ready for AI Analysis
              </strong>

              <span>
                {file?.name ||
                  "Camera image"}
              </span>

            </div>

            <button
              type="button"
              className="analyze-button"
              onClick={analyzePlant}
              disabled={
                loading || saving
              }
            >
              {loading
                ? "🤖 Analyzing..."
                : "🤖 Analyze Plant"}
            </button>

          </div>

        </div>
      )}

      {error && (
        <div className="scanner-error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="scanner-success">
          {success}
        </div>
      )}

      {result && (
        <div className="plant-result">

          <div className="result-header">

            <div className="result-icon">
              🌱
            </div>

            <div>

              <span className="result-label">
                AI ANALYSIS COMPLETE
              </span>

              <h2>
                {result.plantName ||
                  "Unknown Plant"}
              </h2>

              {result.scientificName && (
                <p>
                  {result.scientificName}
                </p>
              )}

            </div>

          </div>

          <div className="result-grid">

            <div className="result-card">
              <span>🌿</span>
              <h4>Plant Type</h4>
              <p>
                {result.plantType ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>❤️</span>
              <h4>Health Status</h4>
              <p>
                {result.healthStatus ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>🦠</span>
              <h4>Disease</h4>
              <p>
                {result.disease ||
                  "No obvious disease detected"}
              </p>
            </div>

            <div className="result-card">
              <span>💧</span>
              <h4>Watering</h4>
              <p>
                {result.waterFrequency ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>☀️</span>
              <h4>Sunlight</h4>
              <p>
                {result.sunlight ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>🌡️</span>
              <h4>Temperature</h4>
              <p>
                {result.temperature ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>💦</span>
              <h4>Humidity</h4>
              <p>
                {result.humidity ||
                  "Not available"}
              </p>
            </div>

            <div className="result-card">
              <span>🌾</span>
              <h4>Fertilizer</h4>
              <p>
                {result.fertilizer ||
                  "Not available"}
              </p>
            </div>

          </div>

          {result.description && (
            <div className="result-description">

              <h3>
                📖 About This Plant
              </h3>

              <p>
                {result.description}
              </p>

            </div>
          )}

          {Array.isArray(
            result.careTips
          ) &&
            result.careTips.length > 0 && (
              <div className="care-tips">

                <h3>
                  💡 Care Tips
                </h3>

                <div className="tips-list">

                  {result.careTips.map(
                    (tip, index) => (
                      <div
                        className="tip-item"
                        key={index}
                      >

                        <span>
                          ✓
                        </span>

                        <p>
                          {tip}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          <div className="save-plant-section">

            {!saved ? (
              <button
                type="button"
                className="save-plant-button"
                onClick={savePlant}
                disabled={saving}
              >
                {saving
                  ? "💾 Saving..."
                  : "💾 Save My Plant"}
              </button>
            ) : (
              <div className="plant-saved-message">

                <span>
                  ✓
                </span>

                Plant saved to your collection

              </div>
            )}

          </div>

          {saved && (
            <button
              type="button"
              className="scan-again-button"
              onClick={removeImage}
            >
              🔄 Scan Another Plant
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default PlantScanner;