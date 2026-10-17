import { useEffect, useRef, useState } from "react";
import API_URL from "../services/api";

function PlantScanner() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageUrlRef = useRef(null);

  const clearImageUrl = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  useEffect(() => {
    if (!cameraOpen || !streamRef.current || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    video.play().catch(() => {
      setError("Unable to start camera preview. Please try again.");
    });
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      clearImageUrl();
    };
  }, []);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    resetMessages();
    setResult(null);
    setSaved(false);

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    stopCamera();
    clearImageUrl();

    const previewUrl = URL.createObjectURL(selectedFile);

    imageUrlRef.current = previewUrl;

    setFile(selectedFile);
    setImage(previewUrl);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    resetMessages();
    setResult(null);
    setSaved(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Camera is not supported by this browser. Please upload an image instead."
      );
      return;
    }

    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      if (!stream.getVideoTracks().some((track) => track.readyState === "live")) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("No active camera stream was found.");
      }

      streamRef.current = stream;
      setCameraOpen(true);

      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack?.getCapabilities?.() || {};

      if (capabilities.torch) {
        videoTrack
          .applyConstraints({
            advanced: [{ torch: true }],
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error("Camera error:", err);

      stopCamera();

      if (err.name === "NotAllowedError") {
        setError(
          "Camera permission was denied. Allow camera access or upload an image instead."
        );
      } else if (err.name === "NotFoundError") {
        setError(
          "No camera was found on this device. Please upload an image instead."
        );
      } else {
        setError(
          "Unable to access the camera. Check camera permission and try again."
        );
      }
    }
  };

  const captureImage = () => {
    const video = videoRef.current;

    if (!video) {
      setError("Camera is not ready.");
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      setError("Camera is still loading. Please try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture image.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to create image.");
          return;
        }

        const capturedFile = new File(
          [blob],
          `plant-scan-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );

        stopCamera();
        clearImageUrl();

        const previewUrl = URL.createObjectURL(capturedFile);

        imageUrlRef.current = previewUrl;

        setFile(capturedFile);
        setImage(previewUrl);
        setResult(null);
        setSaved(false);
        setError("");
        setSuccess("Image captured successfully.");
      },
      "image/jpeg",
      0.9
    );
  };

  const removeImage = () => {
    stopCamera();
    clearImageUrl();

    setFile(null);
    setImage(null);
    setResult(null);
    setSaved(false);
    resetMessages();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzePlant = async () => {
    if (!file) {
      setError("Please upload or capture a plant image first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before analyzing a plant.");
      return;
    }

    setLoading(true);
    resetMessages();
    setResult(null);
    setSaved(false);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/ai/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from the server.");
      }

      if (!response.ok) {
        if (data.code === "NOT_A_PLANT" || data.isPlant === false) {
          throw new Error(
            "This doesn't look like a plant. Please upload a clear photo of a real plant."
          );
        }

        throw new Error(
          data.error || data.message || "Failed to analyze plant."
        );
      }

      if (data.isPlant === false) {
        throw new Error(
          "This doesn't look like a plant. Please upload a clear photo of a real plant."
        );
      }

      if (!data.analysis) {
        throw new Error("AI analysis data was not received.");
      }

      setResult(data.analysis);
      setSuccess("Plant analyzed successfully!");
    } catch (err) {
      console.error("Plant analysis error:", err);

      setResult(null);
      setError(
        err.message || "Something went wrong while analyzing the plant."
      );
    } finally {
      setLoading(false);
    }
  };

  const savePlant = async () => {
    if (!file || !result) {
      setError("No plant analysis available to save.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before saving a plant.");
      return;
    }

    setSaving(true);
    resetMessages();

    try {
      const formData = new FormData();

      formData.append("image", file);
      formData.append("plantName", result.plantName || "");
      formData.append("scientificName", result.scientificName || "");
      formData.append("plantType", result.plantType || "");
      formData.append("healthStatus", result.healthStatus || "");
      formData.append("disease", result.disease || "");
      formData.append("description", result.description || "");
      formData.append("waterFrequency", result.waterFrequency || "");
      formData.append("sunlight", result.sunlight || "");
      formData.append("temperature", result.temperature || "");
      formData.append("humidity", result.humidity || "");
      formData.append("fertilizer", result.fertilizer || "");
      formData.append(
        "careTips",
        JSON.stringify(Array.isArray(result.careTips) ? result.careTips : [])
      );

      const response = await fetch(`${API_URL}/plants/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from server.");
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to save plant."
        );
      }

      setSaved(true);
      setSuccess("Plant saved successfully to My Plants!");
    } catch (err) {
      console.error("Save plant error:", err);

      setError(err.message || "Unable to save plant.");
    } finally {
      setSaving(false);
    }
  };

  const scanAgain = () => {
    stopCamera();
    clearImageUrl();

    setFile(null);
    setImage(null);
    setResult(null);
    setSaved(false);
    setLoading(false);
    setSaving(false);
    resetMessages();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="plant-scanner">
      <div className="scanner-header">
        <div>
          <h1>🌱 Plant Scanner</h1>
          <p>
            Upload or capture a plant image to identify it and get
            personalized care recommendations.
          </p>
        </div>
      </div>

      {!cameraOpen && !image && (
        <div className="scanner-empty">
          <div className="scanner-icon">🌿</div>

          <h2>Scan Your Plant</h2>

          <p>
            Take a clear photo of your plant or upload an existing image.
          </p>

          <div className="scanner-actions">
            <button
              type="button"
              className="scanner-upload-button"
              onClick={openFilePicker}
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

          <p className="scanner-note">
            Supported formats: JPG, JPEG, PNG, WEBP
            <br />
            Maximum image size: 5MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            hidden
          />
        </div>
      )}

      {cameraOpen && (
        <div className="camera-container">
          <div className="camera-header">
            <div>
              <span className="camera-live-dot"></span>
              Camera
            </div>

            <button
              type="button"
              className="camera-close"
              onClick={stopCamera}
              aria-label="Close camera"
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

          <p className="scanner-note">
            Position the plant inside the frame and capture a clear image.
          </p>
        </div>
      )}

      {image && !cameraOpen && (
        <div className="image-preview-container">
          <div className="preview-header">
            <div className="preview-check">✓ Image Ready</div>

            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
            >
              ✕ Remove
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
            <span>📷 {file?.name || "Captured image"}</span>

            {file && (
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            )}
          </div>

          {!result && (
            <button
              type="button"
              className="analyze-button"
              onClick={analyzePlant}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Analyzing Plant...
                </>
              ) : (
                <>🔍 Analyze Plant</>
              )}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="scanner-error" role="alert">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {success && !result && (
        <div className="scanner-success" role="status">
          <span>✓</span>
          <p>{success}</p>
        </div>
      )}

      {result && (
        <div className="plant-result">
          <div className="result-header">
            <div className="result-icon">🌱</div>

            <div>
              <span className="result-label">Plant Identified</span>

              <h2>{result.plantName || "Unknown Plant"}</h2>

              {result.scientificName && <p>{result.scientificName}</p>}
            </div>
          </div>

          <div className="result-grid">
            {[
              {
                icon: "🌿",
                label: "Plant Type",
                value: result.plantType,
              },
              {
                icon: "❤️",
                label: "Health Status",
                value: result.healthStatus,
              },
              {
                icon: "🦠",
                label: "Disease",
                value: result.disease || "No obvious disease detected",
              },
              {
                icon: "💧",
                label: "Watering",
                value: result.waterFrequency,
              },
              {
                icon: "☀️",
                label: "Sunlight",
                value: result.sunlight,
              },
              {
                icon: "🌡️",
                label: "Temperature",
                value: result.temperature,
              },
              {
                icon: "💦",
                label: "Humidity",
                value: result.humidity,
              },
              {
                icon: "🌾",
                label: "Fertilizer",
                value: result.fertilizer,
              },
            ].map((item) => (
              <div className="result-card" key={item.label}>
                <span className="result-card-icon">{item.icon}</span>

                <div>
                  <small>{item.label}</small>
                  <strong>{item.value || "Not available"}</strong>
                </div>
              </div>
            ))}
          </div>

          {result.description && (
            <div className="result-description">
              <h3>📖 About This Plant</h3>
              <p>{result.description}</p>
            </div>
          )}

          {Array.isArray(result.careTips) && result.careTips.length > 0 && (
            <div className="care-tips">
              <h3>💡 Care Tips</h3>

              <div className="tips-list">
                {result.careTips.map((tip, index) => (
                  <div className="tip-item" key={`${index}-${tip}`}>
                    <span>{index + 1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
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
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving Plant...
                  </>
                ) : (
                  <>💾 Save to My Plants</>
                )}
              </button>
            ) : (
              <div className="plant-saved-message">
                ✓ Plant saved to My Plants
              </div>
            )}

            <button
              type="button"
              className="scan-again-button"
              onClick={scanAgain}
            >
              🔄 Scan Another Plant
            </button>
          </div>
        </div>
      )}

      {success && result && (
        <div className="scanner-success" role="status">
          <span>✓</span>
          <p>{success}</p>
        </div>
      )}
    </div>
  );
}

export default PlantScanner;