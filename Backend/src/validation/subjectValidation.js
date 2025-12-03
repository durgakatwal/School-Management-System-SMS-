import { body } from "express-validator";

export const createSubjectValidation = [
  body("subjects")
    .isArray({ min: 1 })
    .withMessage("At least one subject must be provided"),

  // Use the OLD field names that match your frontend
  body("subjects.*.subName") // Changed from name to subName
    .notEmpty()
    .withMessage("Subject Name is required")
    .trim(),

  body("subjects.*.subCode") // Changed from code to subCode
    .notEmpty()
    .withMessage("Subject Code is required")
    .trim(),

  body("subjects.*.sessions") // Changed from classes to sessions
    .notEmpty()
    .withMessage("Session count is required")
    .isInt({ min: 1, max: 7 })
    .withMessage("Sessions must be between 1–7 per week")
    .toInt(),

  body("subjects.*.sclassName") // Changed from className to sclassName
    .notEmpty()
    .withMessage("Class name is required")
    .isString(),

  body("school").notEmpty().withMessage("School name is required").isString(),

  body("subjects.*.teacher")
    .optional()
    .isString()
    .withMessage("Teacher must be a string if provided"),
];
