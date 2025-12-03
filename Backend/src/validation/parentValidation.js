import { body } from "express-validator";
import mongoose from "mongoose";

// Parent Registration Validation
export const parentRegistrationValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  body("alternatePhone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Alternate phone number must be exactly 10 digits"),

  body("address.street")
    .notEmpty()
    .withMessage("Street address is required")
    .isLength({ max: 100 })
    .withMessage("Street address must not exceed 100 characters"),

  body("address.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 50 })
    .withMessage("City must not exceed 50 characters"),

  body("address.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 50 })
    .withMessage("State must not exceed 50 characters"),

  body("address.zip")
    .notEmpty()
    .withMessage("ZIP code is required")
    .isLength({ max: 10 })
    .withMessage("ZIP code must not exceed 10 characters"),

  body("occupation")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Occupation must not exceed 100 characters"),

  body("children.*.relationship")
    .notEmpty()
    .withMessage("Relationship is required")
    .isIn(["Father", "Mother", "Guardian", "Other"])
    .withMessage("Invalid relationship type"),

  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("children")
    .isArray({ min: 1 })
    .withMessage("At least one child must be specified"),

  body("children.*.student")
    .notEmpty()
    .withMessage("Student ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student ID");
      }
      return true;
    }),

  body("children.*.relationship")
    .notEmpty()
    .withMessage("Child relationship is required")
    .isIn(["Father", "Mother", "Guardian", "Other"])
    .withMessage("Invalid child relationship type"),

  body("emergencyContact.name")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Emergency contact name must not exceed 100 characters"),

  body("emergencyContact.phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Emergency contact phone must be exactly 10 digits"),
];

// Parent Login Validation
export const parentLoginValidation = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Update Parent Profile Validation
export const updateParentProfileValidation = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  body("alternatePhone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Alternate phone number must be exactly 10 digits"),

  body("occupation")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Occupation must not exceed 100 characters"),

  body("address.street")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Street address must not exceed 100 characters"),

  body("address.city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("City must not exceed 50 characters"),

  body("address.state")
    .optional()
    .isLength({ max: 50 })
    .withMessage("State must not exceed 50 characters"),

  body("address.zip")
    .optional()
    .isLength({ max: 10 })
    .withMessage("ZIP code must not exceed 10 characters"),
];

// Send Message Validation
export const sendMessageValidation = [
  body("recipient")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid recipient ID");
      }
      return true;
    }),

  body("recipientModel")
    .notEmpty()
    .withMessage("Recipient model is required")
    .isIn(["parent", "teacher", "admin"])
    .withMessage("Invalid recipient model"),

  body("student")
    .notEmpty()
    .withMessage("Student ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid student ID");
      }
      return true;
    }),

  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Subject must be between 5-200 characters"),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10-2000 characters"),

  body("messageType")
    .optional()
    .isIn(["General", "Academic", "Behavioral", "Fee", "Health", "Other"])
    .withMessage("Invalid message type"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Invalid priority level"),
];

// Create School Event Validation
export const createEventValidation = [
  body("title")
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5-200 characters"),

  body("description")
    .notEmpty()
    .withMessage("Event description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10-1000 characters"),

  body("eventType")
    .notEmpty()
    .withMessage("Event type is required")
    .isIn([
      "Academic",
      "Sports",
      "Cultural",
      "Holiday",
      "Exam",
      "Meeting",
      "Workshop",
      "Competition",
      "Field Trip",
      "Other",
    ])
    .withMessage("Invalid event type"),

  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date cannot be before start date");
      }
      return true;
    }),

  body("startTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),

  body("endTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),

  body("location")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Location must not exceed 200 characters"),

  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid school ID");
      }
      return true;
    }),

  body("targetAudience")
    .optional()
    .isIn(["All", "Students", "Parents", "Teachers", "Staff", "Specific Class"])
    .withMessage("Invalid target audience"),

  body("organizer.name")
    .notEmpty()
    .withMessage("Organizer name is required")
    .isLength({ max: 100 })
    .withMessage("Organizer name must not exceed 100 characters"),

  body("organizer.contact")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Organizer contact must be 10-15 digits"),

  body("organizer.email")
    .optional()
    .isEmail()
    .withMessage("Invalid organizer email format"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority level"),

  body("registrationRequired")
    .optional()
    .isBoolean()
    .withMessage("Registration required must be a boolean"),

  body("maxParticipants")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max participants must be at least 1"),

  body("registrationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Registration deadline must be a valid date"),

  body("fee.amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Fee amount must be 0 or more"),

  body("createdBy")
    .notEmpty()
    .withMessage("Created by field is required")
    .isLength({ max: 100 })
    .withMessage("Created by must not exceed 100 characters"),
];

// Change Password Validation
export const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
];

// Reset Password Validation
export const resetPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
];

// Update Password with Token Validation
export const updatePasswordWithTokenValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
];
