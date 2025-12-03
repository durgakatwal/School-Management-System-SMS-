import { body } from "express-validator";
import Sclass from "../models/sclass.js";
import mongoose from "mongoose";
import Admin from "../models/admin.js";

export const createsclassValidation = [
  // Validate Class Name
  body("sclassName")
    .notEmpty()
    .withMessage("Class Name is required")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Class name must be at most 50 characters"),

  // ✅ CHANGED from "schoolName" to "school" to match frontend
  body("school")
    .notEmpty()
    .withMessage("School is required")
    .trim()
    .custom(async (value) => {
      // Check if a school with this name exists
      const school = await Admin.findOne({
        schoolName: new RegExp(`^${value}$`, "i"),
      });
      if (!school) {
        throw new Error("No school found with this name");
      }
      return true;
    }),
];
