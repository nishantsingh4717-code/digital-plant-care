const jwt = require("jsonwebtoken");

// =====================================
// Authentication Middleware
// =====================================
const authMiddleware = async (req, res, next) => {
  try {
    // =====================================
    // Get Authorization Header
    // =====================================
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided.",
      });
    }

    // =====================================
    // Check Bearer Token
    // =====================================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format.",
      });
    }

    // =====================================
    // Extract Token
    // =====================================
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Token Missing.",
      });
    }

    // =====================================
    // Verify JWT Token
    // =====================================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =====================================
    // Attach User Information
    // =====================================
    req.user = decoded;

    console.log("✅ Authenticated User:", req.user);

    // =====================================
    // Continue Request
    // =====================================
    next();

  } catch (error) {
    console.error("❌ Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token Expired. Please Login Again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid Token. Please Login Again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication Failed.",
    });
  }
};

module.exports = authMiddleware;