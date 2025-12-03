// validations/teacherValidation.js
import { body } from "express-validator";
import mongoose from "mongoose";
import Teacher from "../models/teacher.js";
import Admin from "../models/admin.js";
import Subject from "../models/subject.js";
import Sclass from "../models/sclass.js";

export const createTeacherValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const existingTeacher = await Teacher.findOne({ email: value });
      if (existingTeacher) {
        throw new Error("Email is already in use");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("role")
    .optional()
    .isIn(["Teacher", "Admin"])
    .withMessage("Role must be Teacher or Admin"),

  // ✅ Accept schoolName or ObjectId
  body("school")
    .notEmpty()
    .withMessage("School is required")
    .custom(async (value, { req }) => {
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const school = await Admin.findOne({ schoolName: value });
      if (!school) {
        throw new Error("School not found with this name");
      }
      req.body.school = school._id; // replace with ObjectId
      return true;
    }),

  // ✅ Accept subject name or ObjectId
  body("teachSubject")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const subject = await Subject.findOne({ subName: value });
      if (!subject) {
        throw new Error("Subject not found with this name");
      }
      req.body.teachSubject = subject._id;
      return true;
    }),

  // ✅ Accept class name or ObjectId
  body("teachSclass")
    .notEmpty()
    .withMessage("Class is required")
    .custom(async (value, { req }) => {
      if (mongoose.Types.ObjectId.isValid(value)) return true;

      const sclass = await Sclass.findOne({ sclassName: value });
      if (!sclass) {
        throw new Error("Class not found with this name");
      }
      req.body.teachSclass = sclass._id;
      return true;
    }),
];
