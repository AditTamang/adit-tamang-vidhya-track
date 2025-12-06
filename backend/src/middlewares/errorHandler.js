const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err.stack);

  // Handle specific PostgreSQL errors
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({
      status: 409,
      message: "Email already exists",
    });
  }

  if (err.code === "22P02") {
    // Invalid text representation
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  if (err.code === "ECONNREFUSED") {
    // Database connection refused
    return res.status(503).json({
      status: 503,
      message: "Database connection failed",
    });
  }

  if (err.code === "ENOTFOUND") {
    // DNS lookup failed
    return res.status(503).json({
      status: 503,
      message: "Database server not found. Check connection string.",
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: 401,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: 401,
      message: "Token expired",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal server error",
    // ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
