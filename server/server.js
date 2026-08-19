const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const plantRoutes = require("./routes/plantRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

connectDB();

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // Vercel Production Frontend
  "https://digital-plant-care-d3he9mejv-nishant-6f3c.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ========================================
// UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🌱 Smart AI Plant Care API is running",
    version: "1.0.0",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/plants",
  plantRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ Server Error:",
      err
    );

    if (
      err.message &&
      err.message.includes("Only")
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (
      err.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "CORS: Origin not allowed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",

      error:
        process.env.NODE_ENV ===
        "development"
          ? err.message
          : undefined,
    });
  }
);

// ========================================
// SERVER
// ========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});