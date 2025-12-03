import { body } from "express-validator";
import mongoose from "mongoose";

// Fee Structure Validation
export const createFeeStructureValidation = [
  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("sclassName")
    .notEmpty()
    .withMessage("Class ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid class ID");
      }
      return true;
    }),

  body("academicYear")
    .notEmpty()
    .withMessage("Academic year is required")
    .isLength({ min: 9, max: 9 })
    .withMessage("Academic year must be in format YYYY-YYYY"),

  body("feeCategories")
    .isArray({ min: 1 })
    .withMessage("At least one fee category is required"),

  body("feeCategories.*.categoryName")
    .notEmpty()
    .withMessage("Category name is required")
    .isIn([
      "Tuition Fee",
      "Admission Fee",
      "Library Fee",
      "Laboratory Fee",
      "Sports Fee",
      "Transport Fee",
      "Examination Fee",
      "Development Fee",
      "Computer Fee",
      "Other",
    ])
    .withMessage("Invalid fee category"),

  body("feeCategories.*.amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be positive"),

  body("paymentSchedule")
    .optional()
    .isIn(["Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"])
    .withMessage("Invalid payment schedule"),

  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("lateFeeAmount")
    .optional()
    .isNumeric()
    .withMessage("Late fee amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Late fee amount must be positive"),

  body("lateFeeAfterDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Late fee after days must be at least 1"),
];

// Fee Structure Update Validation (all fields optional)
export const updateFeeStructureValidation = [
  body("school")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("sclassName")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid class ID");
      }
      return true;
    }),

  body("academicYear")
    .optional()
    .isLength({ min: 9, max: 9 })
    .withMessage("Academic year must be in format YYYY-YYYY"),

  body("feeCategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one fee category is required if provided"),

  body("feeCategories.*.categoryName")
    .optional()
    .isIn([
      "Tuition Fee",
      "Admission Fee",
      "Library Fee",
      "Laboratory Fee",
      "Sports Fee",
      "Transport Fee",
      "Examination Fee",
      "Development Fee",
      "Computer Fee",
      "Other",
    ])
    .withMessage("Invalid fee category"),

  body("feeCategories.*.amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be positive"),

  body("paymentSchedule")
    .optional()
    .isIn(["Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"])
    .withMessage("Invalid payment schedule"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("lateFeeAmount")
    .optional()
    .isNumeric()
    .withMessage("Late fee amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Late fee amount must be positive"),

  body("lateFeeAfterDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Late fee after days must be at least 1"),
];

// Student Fee Assignment Validation
export const assignFeeToStudentValidation = [
  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student ID");
      }
      return true;
    }),

  body("feeStructureId")
    .notEmpty()
    .withMessage("Fee structure ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid fee structure ID");
      }
      return true;
    }),

  body("discountAmount")
    .optional()
    .isNumeric()
    .withMessage("Discount amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Discount amount must be positive"),

  body("discountReason")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Discount reason must not exceed 200 characters"),
];

// Payment Recording Validation
export const recordPaymentValidation = [
  body("studentFeeId")
    .notEmpty()
    .withMessage("Student fee ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student fee ID");
      }
      return true;
    }),

  body("amount")
    .isNumeric()
    .withMessage("Payment amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Payment amount must be greater than 0"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["Cash", "Bank Transfer", "Online", "Cheque", "Card"])
    .withMessage("Invalid payment method"),

  body("transactionId")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Transaction ID must not exceed 100 characters"),

  body("receivedBy")
    .notEmpty()
    .withMessage("Received by field is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Received by must be between 2-100 characters"),

  body("remarks")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Remarks must not exceed 200 characters"),

  body("paymentDate")
    .optional()
    .isISO8601()
    .withMessage("Payment date must be a valid date"),
];

// Fee Exemption Validation
export const addFeeExemptionValidation = [
  body("studentFeeId")
    .notEmpty()
    .withMessage("Student fee ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student fee ID");
      }
      return true;
    }),

  body("categoryName")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2-100 characters"),

  body("exemptedAmount")
    .isNumeric()
    .withMessage("Exempted amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Exempted amount must be greater than 0"),

  body("reason")
    .notEmpty()
    .withMessage("Exemption reason is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Reason must be between 5-200 characters"),

  body("approvedBy")
    .notEmpty()
    .withMessage("Approved by field is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Approved by must be between 2-100 characters"),
];
