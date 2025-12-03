import { body } from "express-validator";
import mongoose from "mongoose";

// Book Validation
export const createBookValidation = [
  body("title")
    .notEmpty()
    .withMessage("Book title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1-200 characters"),

  body("author")
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Author name must be between 1-100 characters"),

  body("category")
    .notEmpty()
    .withMessage("Book category is required")
    .isIn([
      "Fiction",
      "Non-Fiction",
      "Science",
      "Mathematics",
      "History",
      "Geography",
      "Literature",
      "Biography",
      "Reference",
      "Textbook",
      "Children",
      "Technology",
      "Arts",
      "Sports",
      "Other",
    ])
    .withMessage("Invalid book category"),

  body("publisher")
    .notEmpty()
    .withMessage("Publisher is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Publisher must be between 1-100 characters"),

  body("publicationYear")
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage("Invalid publication year"),

  body("language")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Language must not exceed 50 characters"),

  body("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive number"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("totalCopies")
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),

  body("availableCopies")
    .isInt({ min: 0 })
    .withMessage("Available copies must be 0 or more")
    .custom((value, { req }) => {
      if (value > req.body.totalCopies) {
        throw new Error("Available copies cannot exceed total copies");
      }
      return true;
    }),

  body("location.shelf")
    .notEmpty()
    .withMessage("Shelf location is required")
    .isLength({ max: 20 })
    .withMessage("Shelf location must not exceed 20 characters"),

  body("location.section")
    .notEmpty()
    .withMessage("Section location is required")
    .isLength({ max: 50 })
    .withMessage("Section location must not exceed 50 characters"),

  body("condition")
    .optional()
    .isIn(["Excellent", "Good", "Fair", "Poor", "Damaged"])
    .withMessage("Invalid book condition"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or more"),

  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("addedBy")
    .notEmpty()
    .withMessage("Added by field is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Added by must be between 1-100 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isLength({ max: 30 })
    .withMessage("Each tag must not exceed 30 characters"),
];

// Book Update Validation (all fields optional)
export const updateBookValidation = [
  body("title")
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1-200 characters"),

  body("author")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author name must be between 1-100 characters"),

  body("category")
    .optional()
    .isIn([
      "Fiction",
      "Non-Fiction",
      "Science",
      "Mathematics",
      "History",
      "Geography",
      "Literature",
      "Biography",
      "Reference",
      "Textbook",
      "Children",
      "Technology",
      "Arts",
      "Sports",
      "Other",
    ])
    .withMessage("Invalid book category"),

  body("publisher")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Publisher must be between 1-100 characters"),

  body("publicationYear")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage("Invalid publication year"),

  body("totalCopies")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),

  body("availableCopies")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available copies must be 0 or more"),

  body("condition")
    .optional()
    .isIn(["Excellent", "Good", "Fair", "Poor", "Damaged"])
    .withMessage("Invalid book condition"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or more"),
];

// Book Issue Validation
export const issueBookValidation = [
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid book ID");
      }
      return true;
    }),

  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student ID");
      }
      return true;
    }),

  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),

  body("issuedBy")
    .notEmpty()
    .withMessage("Issued by field is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Issued by must be between 1-100 characters"),

  body("condition")
    .optional()
    .isIn(["Excellent", "Good", "Fair", "Poor"])
    .withMessage("Invalid book condition"),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

// Book Return Validation
export const returnBookValidation = [
  body("issueId")
    .notEmpty()
    .withMessage("Issue ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid issue ID");
      }
      return true;
    }),

  body("returnedTo")
    .notEmpty()
    .withMessage("Returned to field is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Returned to must be between 1-100 characters"),

  body("condition")
    .optional()
    .isIn(["Excellent", "Good", "Fair", "Poor", "Damaged"])
    .withMessage("Invalid book condition"),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),

  body("fineAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Fine amount must be 0 or more"),

  body("fineReason")
    .optional()
    .isIn(["Late Return", "Damage", "Lost Book", "Other"])
    .withMessage("Invalid fine reason"),
];

// Book Renewal Validation
export const renewBookValidation = [
  body("issueId")
    .notEmpty()
    .withMessage("Issue ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid issue ID");
      }
      return true;
    }),

  body("newDueDate")
    .isISO8601()
    .withMessage("New due date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("New due date must be in the future");
      }
      return true;
    }),

  body("renewedBy")
    .notEmpty()
    .withMessage("Renewed by field is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Renewed by must be between 1-100 characters"),
];

// Book Reservation Validation
export const reserveBookValidation = [
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid book ID");
      }
      return true;
    }),

  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student ID");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Notes must not exceed 300 characters"),
];

// Fine Payment Validation
export const payFineValidation = [
  body("issueId")
    .notEmpty()
    .withMessage("Issue ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid issue ID");
      }
      return true;
    }),

  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Payment amount must be greater than 0"),

  body("paidTo")
    .notEmpty()
    .withMessage("Paid to field is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Paid to must be between 1-100 characters"),
];
