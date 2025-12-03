import express from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  renewBook,
  getStudentIssuedBooks,
  getAllBookIssues,
  reserveBook,
  cancelReservation,
  getStudentReservations,
  payFine,
  getLibraryStatistics,
} from "../services/library.js";
import {
  createBookValidation,
  updateBookValidation,
  issueBookValidation,
  returnBookValidation,
  renewBookValidation,
  reserveBookValidation,
  payFineValidation,
} from "../validation/libraryValidation.js";
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

// ========== BOOK MANAGEMENT ROUTES ==========

// Add new book
router.post("/book/add", createBookValidation, validateRequest, addBook);

// Get all books
router.get("/books", getAllBooks);

// Get book by ID
router.get("/book/:id", getBookById);

// Update book
router.put("/book/:id", updateBookValidation, validateRequest, updateBook);

// Delete book
router.delete("/book/:id", deleteBook);

// ========== BOOK ISSUE/RETURN ROUTES ==========

// Issue book to student
router.post("/issue", issueBookValidation, validateRequest, issueBook);

// Return book
router.post("/return", returnBookValidation, validateRequest, returnBook);

// Renew book
router.post("/renew", renewBookValidation, validateRequest, renewBook);

// Get student's issued books
router.get("/student/:studentId/issues", getStudentIssuedBooks);

// Get all book issues (admin)
router.get("/issues", getAllBookIssues);

// ========== BOOK RESERVATION ROUTES ==========

// Reserve book
router.post("/reserve", reserveBookValidation, validateRequest, reserveBook);

// Cancel reservation
router.put("/reservation/:reservationId/cancel", cancelReservation);

// Get student reservations
router.get("/student/:studentId/reservations", getStudentReservations);

// ========== FINE MANAGEMENT ROUTES ==========

// Pay fine
router.post("/fine/pay", payFineValidation, validateRequest, payFine);

// ========== STATISTICS AND REPORTS ==========

// Get library statistics
router.get("/statistics", getLibraryStatistics);

export default router;
