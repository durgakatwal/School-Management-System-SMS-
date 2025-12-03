import Book from "../models/book.js";
import BookIssue from "../models/bookIssue.js";
import BookReservation from "../models/bookReservation.js";
import Student from "../models/students.js";

// BOOK MANAGEMENT

// Add New Book
export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: savedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding book",
      error: error.message,
    });
  }
};

// Get All Books
export const getAllBooks = async (req, res) => {
  try {
    const { school, category, author, search } = req.query;

    let filter = {};

    if (school) filter.school = school;
    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, "i");
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const books = await Book.find(filter).populate("school", "schoolName");

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving books",
      error: error.message,
    });
  }
};


// Get Book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "school",
      "schoolName"
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving book",
      error: error.message,
    });
  }
};

// Update Book
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message,
    });
  }
};

// Delete Book
export const deleteBook = async (req, res) => {
  try {
    // Check if book has active issues
    const activeIssues = await BookIssue.countDocuments({
      book: req.params.id,
      status: { $in: ["Issued", "Overdue"] },
    });

    if (activeIssues > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book with active issues",
      });
    }

    const deletedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message,
    });
  }
};

// ========== BOOK ISSUE/RETURN MANAGEMENT ==========

// Issue Book to Student
export const issueBook = async (req, res) => {
  try {
    const { bookId, studentId, dueDate, issuedBy, condition, notes } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available for issue",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if student already has this book issued
    const existingIssue = await BookIssue.findOne({
      book: bookId,
      student: studentId,
      status: { $in: ["Issued", "Overdue"] },
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: "Student already has this book issued",
      });
    }

    // Check student's current book limit (max 5 books)
    const currentIssues = await BookIssue.countDocuments({
      student: studentId,
      status: { $in: ["Issued", "Overdue"] },
    });

    if (currentIssues >= 5) {
      return res.status(400).json({
        success: false,
        message: "Student has reached maximum book limit (5 books)",
      });
    }

    // Create book issue record
    const bookIssue = new BookIssue({
      book: bookId,
      student: studentId,
      school: book.school,
      dueDate,
      issuedBy,
      condition: { atIssue: condition || "Good" },
      notes,
    });

    await bookIssue.save();

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Cancel any active reservations for this book by this student
    await BookReservation.updateMany(
      { book: bookId, student: studentId, status: "Active" },
      { status: "Fulfilled", fulfilledDate: new Date() }
    );

    const populatedIssue = await BookIssue.findById(bookIssue._id)
      .populate("book", "title author isbn")
      .populate("student", "name rollNum");

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: populatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error issuing book",
      error: error.message,
    });
  }
};

// Return Book
export const returnBook = async (req, res) => {
  try {
    const { issueId, returnedTo, condition, notes, fineAmount, fineReason } =
      req.body;

    const bookIssue = await BookIssue.findById(issueId).populate("book");
    if (!bookIssue) {
      return res.status(404).json({
        success: false,
        message: "Book issue record not found",
      });
    }

    if (bookIssue.status === "Returned") {
      return res.status(400).json({
        success: false,
        message: "Book has already been returned",
      });
    }

    // Update issue record
    bookIssue.returnDate = new Date();
    bookIssue.returnedTo = returnedTo;
    bookIssue.condition.atReturn = condition || "Good";
    bookIssue.notes = notes || bookIssue.notes;

    // Calculate and apply fine if applicable
    if (fineAmount && fineAmount > 0) {
      bookIssue.fine.amount = fineAmount;
      bookIssue.fine.reason = fineReason || "Late Return";
    } else {
      // Auto-calculate fine for late return
      const calculatedFine = bookIssue.calculateFine();
      if (calculatedFine > 0) {
        bookIssue.fine.amount = calculatedFine;
        bookIssue.fine.reason = "Late Return";
      }
    }

    await bookIssue.save();

    // Update book availability
    const book = bookIssue.book;
    book.availableCopies += 1;
    await book.save();

    // Notify next person in reservation queue if any
    const nextReservation = await BookReservation.findOne({
      book: book._id,
      status: "Active",
    })
      .sort({ priority: 1, createdAt: 1 })
      .populate("student", "name rollNum");

    let notificationMessage = "";
    if (nextReservation) {
      notificationMessage = `Book is now available for ${nextReservation.student.name}`;
      // Here you could send actual notification (email/SMS)
    }

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: {
        issue: bookIssue,
        fine: bookIssue.fine.amount > 0 ? bookIssue.fine : null,
        notification: notificationMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error returning book",
      error: error.message,
    });
  }
};

// Renew Book
export const renewBook = async (req, res) => {
  try {
    const { issueId, newDueDate, renewedBy } = req.body;

    const bookIssue = await BookIssue.findById(issueId).populate("book");
    if (!bookIssue) {
      return res.status(404).json({
        success: false,
        message: "Book issue record not found",
      });
    }

    if (bookIssue.status !== "Issued") {
      return res.status(400).json({
        success: false,
        message: "Only issued books can be renewed",
      });
    }

    if (bookIssue.renewalCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum renewal limit (3) reached",
      });
    }

    // Check if there are pending reservations for this book
    const pendingReservations = await BookReservation.countDocuments({
      book: bookIssue.book._id,
      status: "Active",
    });

    if (pendingReservations > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot renew book with pending reservations",
      });
    }

    // Add renewal record
    bookIssue.renewalHistory.push({
      renewedDate: new Date(),
      newDueDate,
      renewedBy,
    });

    bookIssue.dueDate = newDueDate;
    bookIssue.renewalCount += 1;

    await bookIssue.save();

    res.status(200).json({
      success: true,
      message: "Book renewed successfully",
      data: bookIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error renewing book",
      error: error.message,
    });
  }
};

// Get Student's Issued Books
export const getStudentIssuedBooks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    let filter = { student: studentId, isActive: true };
    if (status) filter.status = status;

    const issuedBooks = await BookIssue.find(filter)
      .populate("book", "title author category")
      .populate("student", "name rollNum")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      message: "Student issued books retrieved successfully",
      data: issuedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving student issued books",
      error: error.message,
    });
  }
};

// Get All Book Issues
export const getAllBookIssues = async (req, res) => {
  try {
    const { school, status, overdue, page = 1, limit = 10 } = req.query;

    let filter = { isActive: true };
    if (school) filter.school = school;
    if (status) filter.status = status;
    if (overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $in: ["Issued", "Overdue"] };
    }

    const skip = (page - 1) * limit;

    const issues = await BookIssue.find(filter)
      .populate("book", "title author ")
      .populate("student", "name rollNum")
      .populate("school", "schoolName")
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BookIssue.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Book issues retrieved successfully",
      data: issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving book issues",
      error: error.message,
    });
  }
};

// ========== BOOK RESERVATION MANAGEMENT ==========

// Reserve Book
export const reserveBook = async (req, res) => {
  try {
    const { bookId, studentId, notes } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if book is available
    if (book.availableCopies > 0) {
      return res.status(400).json({
        success: false,
        message: "Book is currently available for immediate issue",
      });
    }

    // Check if student already has active reservation for this book
    const existingReservation = await BookReservation.findOne({
      book: bookId,
      student: studentId,
      status: "Active",
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "Student already has an active reservation for this book",
      });
    }

    // Get next priority number
    const lastReservation = await BookReservation.findOne({
      book: bookId,
      status: "Active",
    }).sort({ priority: -1 });

    const priority = lastReservation ? lastReservation.priority + 1 : 1;

    // Create reservation
    const reservation = new BookReservation({
      book: bookId,
      student: studentId,
      school: book.school,
      priority,
      notes,
    });

    await reservation.save();

    const populatedReservation = await BookReservation.findById(reservation._id)
      .populate("book", "title author")
      .populate("student", "name rollNum");

    res.status(201).json({
      success: true,
      message: "Book reserved successfully",
      data: populatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reserving book",
      error: error.message,
    });
  }
};

// Cancel Reservation
export const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { cancelledBy, cancelReason } = req.body;

    const reservation = await BookReservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Only active reservations can be cancelled",
      });
    }

    reservation.status = "Cancelled";
    reservation.cancelledDate = new Date();
    reservation.cancelledBy = cancelledBy;
    reservation.cancelReason = cancelReason;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling reservation",
      error: error.message,
    });
  }
};

// Get Student Reservations
export const getStudentReservations = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    let filter = { student: studentId, isActive: true };
    if (status) filter.status = status;

    const reservations = await BookReservation.find(filter)
      .populate("book", "title author")
      .populate("student", "name rollNum")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Student reservations retrieved successfully",
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving student reservations",
      error: error.message,
    });
  }
};

// ========== FINE MANAGEMENT ==========

// Pay Fine
export const payFine = async (req, res) => {
  try {
    const { issueId, amount, paidTo } = req.body;

    const bookIssue = await BookIssue.findById(issueId);
    if (!bookIssue) {
      return res.status(404).json({
        success: false,
        message: "Book issue record not found",
      });
    }

    if (bookIssue.fine.amount === 0) {
      return res.status(400).json({
        success: false,
        message: "No fine to pay for this issue",
      });
    }

    if (bookIssue.fine.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Fine has already been paid",
      });
    }

    if (amount !== bookIssue.fine.amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match fine amount",
      });
    }

    bookIssue.fine.isPaid = true;
    bookIssue.fine.paidDate = new Date();
    bookIssue.fine.paidTo = paidTo;

    await bookIssue.save();

    res.status(200).json({
      success: true,
      message: "Fine paid successfully",
      data: bookIssue.fine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing fine payment",
      error: error.message,
    });
  }
};

// Get Library Statistics
export const getLibraryStatistics = async (req, res) => {
  try {
    const { school } = req.query;

    let filter = {};
    if (school) filter.school = school;

    // Book statistics
    const totalBooks = await Book.countDocuments({ ...filter, isActive: true });
    const availableBooks = await Book.aggregate([
      { $match: { ...filter, isActive: true } },
      { $group: { _id: null, total: { $sum: "$availableCopies" } } },
    ]);

    const issuedBooks = await BookIssue.countDocuments({
      ...filter,
      status: { $in: ["Issued", "Overdue"] },
    });

    const overdueBooks = await BookIssue.countDocuments({
      ...filter,
      status: "Overdue",
    });

    // Fine statistics
    const totalFines = await BookIssue.aggregate([
      { $match: { ...filter, "fine.amount": { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$fine.amount" } } },
    ]);

    const unpaidFines = await BookIssue.aggregate([
      {
        $match: {
          ...filter,
          "fine.amount": { $gt: 0 },
          "fine.isPaid": false,
        },
      },
      { $group: { _id: null, total: { $sum: "$fine.amount" } } },
    ]);

    // Reservation statistics
    const activeReservations = await BookReservation.countDocuments({
      ...filter,
      status: "Active",
    });

    // Popular books
    const popularBooks = await BookIssue.aggregate([
      { $match: filter },
      { $group: { _id: "$book", issueCount: { $sum: 1 } } },
      { $sort: { issueCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          title: "$book.title",
          author: "$book.author",
          issueCount: 1,
        },
      },
    ]);

    const stats = {
      books: {
        total: totalBooks,
        available: availableBooks[0]?.total || 0,
        issued: issuedBooks,
        overdue: overdueBooks,
      },
      fines: {
        total: totalFines[0]?.total || 0,
        unpaid: unpaidFines[0]?.total || 0,
        paid: (totalFines[0]?.total || 0) - (unpaidFines[0]?.total || 0),
      },
      reservations: {
        active: activeReservations,
      },
      popularBooks,
    };

    res.status(200).json({
      success: true,
      message: "Library statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving library statistics",
      error: error.message,
    });
  }
};
