import React, { useEffect, useState } from "react";

const MyPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/plants",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("My Plants Response:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch plants"
          );
        }

        setPlants(data.plants || []);
      } catch (error) {
        console.error("❌ My Plants Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) {
    return (
      <div className="my-plants-page">
        <div className="loading-box">
          🌱 Loading your plants...
        </div>
      </div>
    );
  }

  return (
    <div className="my-plants-page">

      <div className="my-plants-header">
        <div>
          <span className="small-title">
            MY COLLECTION
          </span>

          <h1>
            🌱 My Plants
          </h1>

          <p>
            View and manage all your saved plants.
          </p>
        </div>

        <div className="plant-count">
          {plants.length} Plant
          {plants.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="plant-error">
          ❌ {error}
        </div>
      )}

      {!error && plants.length === 0 && (
        <div className="empty-plants">
          <div className="empty-icon">
            🌿
          </div>

          <h2>
            No Plants Saved Yet
          </h2>

          <p>
            Scan a plant and save it to your collection.
          </p>

          <a href="/#scanner">
            🌱 Scan Your First Plant
          </a>
        </div>
      )}

      {plants.length > 0 && (
        <div className="my-plants-grid">

          {plants.map((plant) => (
            <div
              className="saved-plant-card"
              key={plant._id}
            >

              {plant.image ? (
                <img
                  src={plant.image}
                  alt={plant.plantName || "Plant"}
                  className="saved-plant-image"
                />
              ) : (
                <div className="no-plant-image">
                  🌱
                </div>
              )}

              <div className="saved-plant-content">

                <h2>
                  🌿 {plant.plantName || "Unknown Plant"}
                </h2>

                <p className="scientific-name">
                  {plant.scientificName ||
                    "Scientific name unavailable"}
                </p>

                <div className="plant-info-grid">

                  <div>
                    <span>🌱 Plant Type</span>
                    <strong>
                      {plant.plantType ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>❤️ Health</span>
                    <strong>
                      {plant.healthStatus ||
                        "Healthy"}
                    </strong>
                  </div>

                  <div>
                    <span>🦠 Disease</span>
                    <strong>
                      {plant.disease || "None"}
                    </strong>
                  </div>

                  <div>
                    <span>💧 Water</span>
                    <strong>
                      {plant.waterFrequency ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>☀️ Sunlight</span>
                    <strong>
                      {plant.sunlight ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>🌡️ Temperature</span>
                    <strong>
                      {plant.temperature ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>💦 Humidity</span>
                    <strong>
                      {plant.humidity ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>🌾 Fertilizer</span>
                    <strong>
                      {plant.fertilizer ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {plant.description && (
                  <div className="plant-description">
                    <h3>
                      📖 About This Plant
                    </h3>

                    <p>
                      {plant.description}
                    </p>
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyPlants;