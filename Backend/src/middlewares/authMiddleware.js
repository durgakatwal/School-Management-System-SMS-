import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const publicRoutes = [
  "/admin/register",
  "/admin/login",
  "/auth/studentRegister",
  "/auth/studentLogin",
  "/teachers/login",
];
export const authMiddleware = asyncHandler(async (req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next;
  }

  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (!token || type !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});
