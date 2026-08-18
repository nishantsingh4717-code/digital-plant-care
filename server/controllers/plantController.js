const Plant = require("../models/Plant");

// =====================================
// Add New Plant
// =====================================
exports.addPlant = async (req, res) => {
  try {
    const {
      plantName,
      scientificName,
      plantType,
      description,
      waterFrequency,
      sunlight,
      temperature,
      humidity,
      fertilizer,
    } = req.body;

    // =====================================
    // Handle Location
    // =====================================
    const location = Array.isArray(req.body.location)
      ? req.body.location[0]
      : req.body.location || "";

    // =====================================
    // Validate Required Fields
    // =====================================
    if (!plantName || !plantType) {
      return res.status(400).json({
        success: false,
        message: "Plant name and plant type are required",
      });
    }

    // =====================================
    // Create Plant
    // =====================================
    const plant = await Plant.create({
      plantName: plantName.trim(),
      scientificName: scientificName || "",
      plantType: plantType.trim(),
      description: description || "",
      waterFrequency: waterFrequency || "",
      sunlight: sunlight || "",
      temperature: temperature || "",
      humidity: humidity || "",
      fertilizer: fertilizer || "",
      location: location,

      // Cloudinary image URL
      image: req.file ? req.file.path : "",

      // Logged-in user's ID
      owner: req.user.id,
    });

    // =====================================
    // Success Response
    // =====================================
    res.status(201).json({
      success: true,
      message: "Plant added successfully",
      plant,
    });
  } catch (error) {
    console.error("❌ Add Plant Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================
// Get All Plants
// =====================================
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalPlants: plants.length,
      plants,
    });
  } catch (error) {
    console.error("❌ Get Plants Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================
// Get Single Plant
// =====================================
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    res.status(200).json({
      success: true,
      plant,
    });
  } catch (error) {
    console.error("❌ Get Plant Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================
// Update Plant
// =====================================
exports.updatePlant = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // =====================================
    // Fix Location if sent as Array
    // =====================================
    if (Array.isArray(updateData.location)) {
      updateData.location = updateData.location[0];
    }

    // =====================================
    // Update Image if New Image Uploaded
    // =====================================
    if (req.file) {
      updateData.image = req.file.path;
    }

    // =====================================
    // Find and Update Plant
    // =====================================
    const plant = await Plant.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plant updated successfully",
      plant,
    });
  } catch (error) {
    console.error("❌ Update Plant Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================
// Delete Plant
// =====================================
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plant deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Plant Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};