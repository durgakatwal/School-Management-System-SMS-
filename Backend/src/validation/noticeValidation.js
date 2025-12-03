// validations/noticeValidation.js
import { body } from "express-validator";
import mongoose from "mongoose";

export const createNoticeValidation = [
  body("title").notEmpty().withMessage("Title is required"),

  body("details").notEmpty().withMessage("Notice details is required"),

  body("date")
    .notEmpty()
    .withMessage("Notice date is required")
    .isISO8601({ strict: true })
    .withMessage(
      "Notice date must be a valid ISO date string (e.g., YYYY-MM-DDTHH:mm:ssZ)"
    ),

  // Optional school ID - must be a valid ObjectId if provided
  body("school")
    .notEmpty()
    .withMessage("School name is required")
    .isString()
    .withMessage("School name must be a string")
    .isLength({ min: 2 })
    .withMessage("School name must be at least 2 characters long"),

  // // Optional adminID - must be a valid ObjectId if provided
  // body("adminID")
  //   .optional({ nullable: false, checkFalsy: true })
  //   .custom((value) => {
  //     if (!mongoose.Types.ObjectId.isValid(value)) {
  //       throw new Error("Invalid adminID");
  //     }
  //     return true;
  //   }),

  // // Custom validator: At least one of school or adminID must be provided
  // body().custom((value, { req }) => {
  //   const { school, adminID } = req.body;

  //   if (!school && !adminID) {
  //     throw new Error("Either school or adminID is required");
  //   }

  //   return true;
  // }),
];
