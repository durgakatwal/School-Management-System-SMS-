import { body } from "express-validator";
import Admin from "../models/admin.js";

export const createAdminValidation = [
  body("firstName").trim().notEmpty().withMessage("First Name is required"),

  body("lastName").trim().notEmpty().withMessage("Last Name is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(97|98)\d{8}$/)
    .withMessage("Invalid Nepali phone number"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const existingAdmin = await Admin.findOne({ email: value });
      if (existingAdmin) {
        throw new Error("Email is already in use");
      }
      return true;
    }),

  body("role").optional().isIn(["Admin"]).withMessage("Role must be 'Admin'"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*#?&]/)
    .withMessage("Password must contain at least one special character"),

  body("schoolName")
    .notEmpty()
    .withMessage("School name is required")
    .custom(async (value) => {
      const existingAdmin = await Admin.findOne({ schoolName: value });
      if (existingAdmin) {
        throw new Error("School name is already in use");
      }
      return true;
    }),

  body("address.street").optional().isString(),
  body("address.city").optional().isString(),
  body("address.state").optional().isString(),
  body("address.zip")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid ZIP code"),

  body("profilePicture").optional().isString(),
];
