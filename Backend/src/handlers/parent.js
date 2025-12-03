import express from "express";
import {
  parentRegister,
  parentLogin,
  getParentProfile,
  updateParentProfile,
  getChildAcademicPerformance,
  getChildAttendance,
  getChildFeeDetails,
  getChildLibraryRecords,
  sendMessage,
  getParentMessages,
  markMessageAsRead,
  getSchoolEvents,
  getSchoolNotices,
  getParentDashboard,
} from "../services/parent.js";
import {
  parentRegistrationValidation,
  parentLoginValidation,
  updateParentProfileValidation,
  sendMessageValidation,
} from "../validation/parentValidation.js";
import { validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ========== AUTHENTICATION ROUTES ==========

// Parent registration
router.post("/register", parentRegistrationValidation, validateRequest, parentRegister);

// Parent login
router.post("/login", parentLoginValidation, validateRequest, parentLogin);

// ========== PROFILE MANAGEMENT ROUTES ==========

// Get parent profile
router.get("/profile/:parentId", getParentProfile);

// Update parent profile
router.put("/profile/:parentId", updateParentProfileValidation, validateRequest, updateParentProfile);

// ========== DASHBOARD ROUTE ==========

// Get parent dashboard
router.get("/dashboard/:parentId", getParentDashboard);

// ========== STUDENT TRACKING ROUTES ==========

// Get child's academic performance
router.get("/:parentId/child/:studentId/academics", getChildAcademicPerformance);

// Get child's attendance
router.get("/:parentId/child/:studentId/attendance", getChildAttendance);

// Get child's fee details
router.get("/:parentId/child/:studentId/fees", getChildFeeDetails);

// Get child's library records
router.get("/:parentId/child/:studentId/library", getChildLibraryRecords);

// ========== COMMUNICATION ROUTES ==========

// Send message
router.post("/:parentId/messages/send", sendMessageValidation, validateRequest, sendMessage);

// Get parent messages
router.get("/:parentId/messages", getParentMessages);

// Mark message as read
router.put("/messages/:messageId/read", markMessageAsRead);

// ========== SCHOOL INFORMATION ROUTES ==========

// Get school events
router.get("/events", getSchoolEvents);

// Get school notices
router.get("/notices", getSchoolNotices);

export default router;
