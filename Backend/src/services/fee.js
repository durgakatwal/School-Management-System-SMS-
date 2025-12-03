import FeeStructure from "../models/feeStructure.js";
import StudentFee from "../models/studentFee.js";
import Student from "../models/students.js";

// Create Fee Structure
export const createFeeStructure = async (req, res) => {
  try {
    const feeStructure = new FeeStructure(req.body);
    const savedFeeStructure = await feeStructure.save();

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: savedFeeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating fee structure",
      error: error.message,
    });
  }
};

// Get All Fee Structures
export const getFeeStructures = async (req, res) => {
  try {
    const { school, sclassName, academicYear } = req.query;

    let filter = {};
    if (school) filter.school = school;
    if (sclassName) filter.sclassName = sclassName;
    if (academicYear) filter.academicYear = academicYear;

    const feeStructures = await FeeStructure.find({
      school,
      sclassName,
      academicYear,
    })
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .sort({ createdAt: -1 });

    res.status(200).json(feeStructures);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving fee structures",
      error: error.message,
    });
  }
};

// Get Fee Structure by ID
export const getFeeStructureById = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName");

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure retrieved successfully",
      data: feeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving fee structure",
      error: error.message,
    });
  }
};

// Update Fee Structure
export const updateFeeStructure = async (req, res) => {
  try {
    const updatedFeeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFeeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure updated successfully",
      data: updatedFeeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating fee structure",
      error: error.message,
    });
  }
};

// Delete Fee Structure
export const deleteFeeStructure = async (req, res) => {
  try {
    const deletedFeeStructure = await FeeStructure.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFeeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting fee structure",
      error: error.message,
    });
  }
};

// Assign Fee to Student
export const assignFeeToStudent = async (req, res) => {
  try {
    const {
      studentId,
      feeStructureId,
      discountAmount = 0,
      discountReason,
    } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if fee structure exists
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // Check if fee already assigned for this academic year
    const existingFee = await StudentFee.findOne({
      student: studentId,
      academicYear: feeStructure.academicYear,
      isActive: true,
    });

    if (existingFee) {
      return res.status(400).json({
        success: false,
        message: "Fee already assigned to this student for the academic year",
      });
    }

    // Create student fee record
    const studentFee = new StudentFee({
      student: studentId,
      school: feeStructure.school,
      sclassName: feeStructure.sclassName,
      feeStructure: feeStructureId,
      academicYear: feeStructure.academicYear,
      totalFeeAmount: feeStructure.totalAmount,
      discountAmount,
      discountReason,
      dueDate: feeStructure.dueDate,
      remainingAmount: feeStructure.totalAmount - discountAmount,
    });

    const savedStudentFee = await studentFee.save();

    res.status(201).json({
      success: true,
      message: "Fee assigned to student successfully",
      data: savedStudentFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning fee to student",
      error: error.message,
    });
  }
};

// Record Payment
export const recordPayment = async (req, res) => {
  try {
    const {
      studentFeeId,
      amount,
      paymentMethod,
      transactionId,
      receivedBy,
      remarks,
      paymentDate = new Date(),
    } = req.body;

    const studentFee = await StudentFee.findById(studentFeeId);
    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee record not found",
      });
    }

    // Check if payment amount exceeds remaining amount
    if (amount > studentFee.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds remaining fee amount",
      });
    }

    // Generate unique payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Add payment to history
    studentFee.paymentHistory.push({
      paymentId,
      amount,
      paymentDate,
      paymentMethod,
      transactionId,
      receivedBy,
      remarks,
    });

    // Update paid amount and last payment date
    studentFee.paidAmount += amount;
    studentFee.lastPaymentDate = paymentDate;

    await studentFee.save();

    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: {
        paymentId,
        remainingAmount: studentFee.remainingAmount,
        paymentStatus: studentFee.paymentStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error recording payment",
      error: error.message,
    });
  }
};

// Get Student Fee Details
export const getStudentFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear } = req.query;

    let filter = { student: studentId, isActive: true };
    if (academicYear) filter.academicYear = academicYear;

    const studentFees = await StudentFee.find(filter)
      .populate("student", "name rollNum")
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("feeStructure")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Student fee details retrieved successfully",
      data: studentFees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving student fee details",
      error: error.message,
    });
  }
};

// Get All Student Fees (for admin)
export const getAllStudentFees = async (req, res) => {
  try {
    const {
      school,
      sclassName,
      paymentStatus,
      academicYear,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = { isActive: true };
    if (school) filter.school = school;
    if (sclassName) filter.sclassName = sclassName;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (academicYear) filter.academicYear = academicYear;

    const skip = (page - 1) * limit;

    const studentFees = await StudentFee.find(filter)
      .populate("student", "name rollNum")
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await StudentFee.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Student fees retrieved successfully",
      data: studentFees,
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
      message: "Error retrieving student fees",
      error: error.message,
    });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const { studentFeeId } = req.params;

    const studentFee = await StudentFee.findById(studentFeeId)
      .populate("student", "name rollNum")
      .select("paymentHistory student");

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: {
        student: studentFee.student,
        paymentHistory: studentFee.paymentHistory.sort(
          (a, b) => b.paymentDate - a.paymentDate
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving payment history",
      error: error.message,
    });
  }
};

// Add Fee Exemption
export const addFeeExemption = async (req, res) => {
  try {
    const { studentFeeId, categoryName, exemptedAmount, reason, approvedBy } =
      req.body;

    const studentFee = await StudentFee.findById(studentFeeId);
    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee record not found",
      });
    }

    // Check if exempted amount exceeds remaining amount
    if (exemptedAmount > studentFee.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: "Exempted amount exceeds remaining fee amount",
      });
    }

    // Add exemption
    studentFee.exemptions.push({
      categoryName,
      exemptedAmount,
      reason,
      approvedBy,
    });

    // Update discount amount
    studentFee.discountAmount += exemptedAmount;

    await studentFee.save();

    res.status(200).json({
      success: true,
      message: "Fee exemption added successfully",
      data: {
        remainingAmount: studentFee.remainingAmount,
        paymentStatus: studentFee.paymentStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding fee exemption",
      error: error.message,
    });
  }
};

// Get Fee Statistics
export const getFeeStatistics = async (req, res) => {
  try {
    const { school, academicYear } = req.query;

    let filter = { isActive: true };
    if (school) filter.school = school;
    if (academicYear) filter.academicYear = academicYear;

    const stats = await StudentFee.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          totalFeeAmount: { $sum: "$totalFeeAmount" },
          totalPaidAmount: { $sum: "$paidAmount" },
          totalRemainingAmount: { $sum: "$remainingAmount" },
          totalDiscountAmount: { $sum: "$discountAmount" },
          paidStudents: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0] },
          },
          partialStudents: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "Partial"] }, 1, 0] },
          },
          pendingStudents: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] },
          },
          overdueStudents: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "Overdue"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalStudents: 0,
      totalFeeAmount: 0,
      totalPaidAmount: 0,
      totalRemainingAmount: 0,
      totalDiscountAmount: 0,
      paidStudents: 0,
      partialStudents: 0,
      pendingStudents: 0,
      overdueStudents: 0,
    };

    // Calculate collection percentage
    result.collectionPercentage =
      result.totalFeeAmount > 0
        ? ((result.totalPaidAmount / result.totalFeeAmount) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      message: "Fee statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving fee statistics",
      error: error.message,
    });
  }
};

// Apply Late Fee
export const applyLateFee = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find overdue fees
    const overdueFees = await StudentFee.find({
      dueDate: { $lt: currentDate },
      paymentStatus: { $in: ["Pending", "Partial"] },
      isActive: true,
    }).populate("feeStructure");

    let updatedCount = 0;

    for (const studentFee of overdueFees) {
      const feeStructure = studentFee.feeStructure;
      const daysPastDue = Math.floor(
        (currentDate - studentFee.dueDate) / (1000 * 60 * 60 * 24)
      );

      if (
        daysPastDue >= feeStructure.lateFeeAfterDays &&
        feeStructure.lateFeeAmount > 0
      ) {
        // Apply late fee if not already applied
        if (studentFee.lateFeeApplied === 0) {
          studentFee.lateFeeApplied = feeStructure.lateFeeAmount;
          studentFee.totalFeeAmount += feeStructure.lateFeeAmount;
          await studentFee.save();
          updatedCount++;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Late fee applied to ${updatedCount} student(s)`,
      data: { updatedCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying late fee",
      error: error.message,
    });
  }
};
