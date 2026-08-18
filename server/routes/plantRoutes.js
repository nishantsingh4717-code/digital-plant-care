const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  addPlant,
  getPlants,
  getPlant,
  updatePlant,
  deletePlant,
} = require("../controllers/plantController");

// =====================================
// Add New Plant (Image Upload)
// =====================================
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  addPlant
);

// =====================================
// Get All Plants of Logged-in User
// =====================================
router.get("/", authMiddleware, getPlants);

// =====================================
// Get Single Plant
// =====================================
router.get("/:id", authMiddleware, getPlant);

// =====================================
// Update Plant (Optional Image Upload)
// =====================================
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updatePlant
);

// =====================================
// Delete Plant
// =====================================
router.delete("/:id", authMiddleware, deletePlant);

module.exports = router;