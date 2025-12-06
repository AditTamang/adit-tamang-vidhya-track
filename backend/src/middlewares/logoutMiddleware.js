import { blacklistToken } from "../utils/tokenBlacklist.js";

export const logoutMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(400).json({
        status: 400,
        message: "Token missing",
      });
    }

    const token = header.split(" ")[1];
    blacklistToken(token);

    return res.status(200).json({
      status: 200,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Middleware Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};
