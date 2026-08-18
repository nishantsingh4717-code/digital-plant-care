const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    plantName: {
      type: String,
      required: true,
      trim: true,
    },

    scientificName: {
      type: String,
      default: "",
    },

    plantType: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    waterFrequency: {
      type: String,
      default: "",
    },

    sunlight: {
      type: String,
      default: "",
    },

    temperature: {
      type: String,
      default: "",
    },

    humidity: {
      type: String,
      default: "",
    },

    fertilizer: {
      type: String,
      default: "",
    },

    lastWatered: {
      type: Date,
      default: Date.now,
    },

    healthStatus: {
      type: String,
      default: "Healthy",
    },

    disease: {
      type: String,
      default: "None",
    },

    location: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plant", plantSchema);