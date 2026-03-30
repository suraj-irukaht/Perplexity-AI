import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default function authUser(req, res, next) {
    const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : "";

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, config.ACCESS_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token",
    });
  }
}
