import { body } from "express-validator";
import mongoose from "mongoose";
import Admin from "../models/admin.js";
import Sclass from "../models/sclass.js";
import Subject from "../models/subject.js";
import Student from "../models/students.js";

export const createStudentValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (value) => {
      const existing = await Student.findOne({ email: value });
      if (existing) {
        throw new Error("Email already in use");
      }
      return true;
    }),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .custom((value) => {
      // Try to parse the value as a date
      const date = new Date(value);

      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }

      // Optional: Ensure it's not in the future
      const today = new Date();
      if (date > today) {
        throw new Error("Date of birth cannot be in the future");
      }

      return true;
    }),

  body("rollNum")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Roll number must be a positive integer")
    .toInt(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  // ✅ Class: allow ID or className
  body("sclassName")
    .notEmpty()
    .withMessage("Class is required")
    .custom(async (value, { req }) => {
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const sclass = await Sclass.findOne({ sclassName: value });
      if (!sclass) {
        throw new Error("Class not found with this name");
      }

      req.body.sclassName = sclass._id;
      return true;
    }),

  // ✅ School: allow ID or schoolName
  body("school")
    .notEmpty()
    .withMessage("School is required")
    .custom(async (value, { req }) => {
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const school = await Admin.findOne({ schoolName: value });
      if (!school) {
        throw new Error("School not found with this name");
      }

      req.body.school = school._id;
      return true;
    }),

  body("role").optional().isIn(["Student"]),

  // ✅ Exam Results: subName can be ObjectId or subject name
  body("examResult.*.subName")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const subject = await Subject.findOne({ subName: value });
      if (!subject) {
        throw new Error(`Subject "${value}" not found`);
      }

      const idx = req.body.examResult.findIndex((r) => r.subName === value);
      if (idx !== -1) req.body.examResult[idx].subName = subject._id;

      return true;
    }),

  // ✅ Attendance: subName can be ObjectId or subject name
  body("attendance.*.subName")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const subject = await Subject.findOne({ subName: value });
      if (!subject) {
        throw new Error(`Subject "${value}" not found`);
      }

      const idx = req.body.attendance.findIndex((r) => r.subName === value);
      if (idx !== -1) req.body.attendance[idx].subName = subject._id;

      return true;
    }),
];
