import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/tokenBlacklist.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res
      .status(401)
      .json({ status: 401, message: "Access token required" });
  }

  const token = header.split(" ")[1];

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ status: 401, message: "Logged out token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid or expired token" });
  }
};
