import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyPlants() {
  const navigate = useNavigate();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlant, setEditingPlant] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/plants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        throw new Error(
          data.message || "Failed to load plants"
        );
      }

      setPlants(data.plants || []);
    } catch (err) {
      console.error("My Plants Error:", err);
      setError(
        err.message || "Failed to load your plants."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const openEdit = (plant) => {
    setEditingPlant({
      ...plant,
    });

    setError("");
  };

  const closeEdit = () => {
    setEditingPlant(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingPlant((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updatePlant = async (event) => {
    event.preventDefault();

    if (!editingPlant) return;

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append(
        "plantName",
        editingPlant.plantName || ""
      );

      formData.append(
        "scientificName",
        editingPlant.scientificName || ""
      );

      formData.append(
        "plantType",
        editingPlant.plantType || ""
      );

      formData.append(
        "description",
        editingPlant.description || ""
      );

      formData.append(
        "waterFrequency",
        editingPlant.waterFrequency || ""
      );

      formData.append(
        "sunlight",
        editingPlant.sunlight || ""
      );

      formData.append(
        "temperature",
        editingPlant.temperature || ""
      );

      formData.append(
        "humidity",
        editingPlant.humidity || ""
      );

      formData.append(
        "fertilizer",
        editingPlant.fertilizer || ""
      );

      formData.append(
        "location",
        editingPlant.location || ""
      );

      const response = await fetch(
        `http://localhost:5000/api/plants/${editingPlant._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Update Plant Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update plant"
        );
      }

      setPlants((previousPlants) =>
        previousPlants.map((plant) =>
          plant._id === data.plant._id
            ? data.plant
            : plant
        )
      );

      setEditingPlant(null);
    } catch (err) {
      console.error("Update Plant Error:", err);

      setError(
        err.message || "Failed to update plant."
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePlant = async (plantId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plant?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/plants/${plantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete plant"
        );
      }

      setPlants((previousPlants) =>
        previousPlants.filter(
          (plant) => plant._id !== plantId
        )
      );
    } catch (err) {
      console.error("Delete Plant Error:", err);

      setError(
        err.message || "Failed to delete plant."
      );
    }
  };

  if (loading) {
    return (
      <div className="my-plants-page">
        <div className="my-plants-loading">
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

          <h1>🌿 My Plants</h1>

          <p>
            Manage and monitor all your saved plants.
          </p>
        </div>

        <button
          type="button"
          className="add-plant-button"
          onClick={() => navigate("/")}
        >
          🌱 Scan New Plant
        </button>

      </div>

      {error && (
        <div className="my-plants-error">
          ❌ {error}
        </div>
      )}

      {plants.length === 0 ? (
        <div className="empty-plants">

          <div className="empty-plants-icon">
            🌱
          </div>

          <h2>
            No Plants Saved Yet
          </h2>

          <p>
            Scan a plant and save it to build
            your personal plant collection.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            🌿 Scan Your First Plant
          </button>

        </div>
      ) : (
        <div className="plants-grid">

          {plants.map((plant) => (
            <div
              className="saved-plant-card"
              key={plant._id}
            >

              <div className="saved-plant-image">

                {plant.image ? (
                  <img
                    src={plant.image}
                    alt={plant.plantName}
                  />
                ) : (
                  <div className="no-plant-image">
                    🌱
                  </div>
                )}

              </div>

              <div className="saved-plant-content">

                <span className="plant-type">
                  {plant.plantType || "Plant"}
                </span>

                <h2>
                  {plant.plantName ||
                    "Unknown Plant"}
                </h2>

                {plant.scientificName && (
                  <p className="scientific-name">
                    {plant.scientificName}
                  </p>
                )}

                <div className="saved-plant-info">

                  <div>
                    <span>💧</span>
                    <strong>Water</strong>
                    <p>
                      {plant.waterFrequency ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <span>☀️</span>
                    <strong>Sunlight</strong>
                    <p>
                      {plant.sunlight ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <span>🌡️</span>
                    <strong>Temperature</strong>
                    <p>
                      {plant.temperature ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <span>💦</span>
                    <strong>Humidity</strong>
                    <p>
                      {plant.humidity ||
                        "Not available"}
                    </p>
                  </div>

                </div>

                {plant.description && (
                  <div className="saved-plant-description">
                    <strong>
                      📖 About
                    </strong>

                    <p>
                      {plant.description}
                    </p>
                  </div>
                )}

                <div className="saved-plant-actions">

                  <button
                    type="button"
                    className="edit-plant-button"
                    onClick={() =>
                      openEdit(plant)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    className="delete-plant-button"
                    onClick={() =>
                      deletePlant(plant._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {editingPlant && (
        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>
                <span className="small-title">
                  UPDATE PLANT
                </span>

                <h2>
                  ✏️ Edit Plant
                </h2>
              </div>

              <button
                type="button"
                className="close-edit-button"
                onClick={closeEdit}
              >
                ✕
              </button>

            </div>

            <form onSubmit={updatePlant}>

              <div className="edit-form-grid">

                <div className="edit-form-group">
                  <label>
                    Plant Name
                  </label>

                  <input
                    type="text"
                    name="plantName"
                    value={
                      editingPlant.plantName || ""
                    }
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Scientific Name
                  </label>

                  <input
                    type="text"
                    name="scientificName"
                    value={
                      editingPlant.scientificName ||
                      ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Plant Type
                  </label>

                  <input
                    type="text"
                    name="plantType"
                    value={
                      editingPlant.plantType || ""
                    }
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Water Frequency
                  </label>

                  <input
                    type="text"
                    name="waterFrequency"
                    value={
                      editingPlant.waterFrequency ||
                      ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Sunlight
                  </label>

                  <input
                    type="text"
                    name="sunlight"
                    value={
                      editingPlant.sunlight || ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Temperature
                  </label>

                  <input
                    type="text"
                    name="temperature"
                    value={
                      editingPlant.temperature || ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Humidity
                  </label>

                  <input
                    type="text"
                    name="humidity"
                    value={
                      editingPlant.humidity || ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    Fertilizer
                  </label>

                  <input
                    type="text"
                    name="fertilizer"
                    value={
                      editingPlant.fertilizer || ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

              </div>

              <div className="edit-form-group full-width">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    editingPlant.location || ""
                  }
                  onChange={handleEditChange}
                />
              </div>

              <div className="edit-form-group full-width">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={
                    editingPlant.description || ""
                  }
                  onChange={handleEditChange}
                />
              </div>

              <div className="edit-modal-actions">

                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-button"
                  disabled={saving}
                >
                  {saving
                    ? "💾 Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyPlants;