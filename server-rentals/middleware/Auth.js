import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Authenticate admin
export const authenticateAdmin = (req, res, next) => {
  const token =
    req.cookies.adminToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin info to request
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};
