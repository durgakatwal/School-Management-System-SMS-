import { body } from "express-validator";
import mongoose from "mongoose";

export const createComplainValidation = [
  body("user")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid user ID");
      }
      return true;
    }),

  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),

  body("complaint")
    .trim()
    .notEmpty()
    .withMessage("Complaint text is required")
    .isLength({ min: 10 })
    .withMessage("Complaint must be at least 10 characters long"),
];
