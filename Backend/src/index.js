import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./handlers/index.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" })); //  This must come before app.use("/", router)
// app.use(authMiddleware);

app.use("/", router); //  Your route handlers

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected with the school management system");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });
