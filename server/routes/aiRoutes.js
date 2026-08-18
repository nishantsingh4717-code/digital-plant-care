const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  analyzePlant,
} = require("../controllers/aiController");

router.post(
  "/analyze",
  authMiddleware,
  upload.single("image"),
  analyzePlant
);

module.exports = router;