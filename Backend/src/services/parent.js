import Parent from "../models/parent.js";
import Student from "../models/students.js";
import StudentFee from "../models/studentFee.js";
import BookIssue from "../models/bookIssue.js";
import ParentMessage from "../models/parentMessage.js";
import SchoolEvent from "../models/schoolEvent.js";
import Notice from "../models/notice.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ========== PARENT AUTHENTICATION ==========

// Parent Registration
export const parentRegister = async (req, res) => {
  try {
    const { password, children, ...parentData } = req.body;

    // Check if parent already exists
    const existingParent = await Parent.findOne({ email: parentData.email });
    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: "Parent with this email already exists",
      });
    }

    // Verify all children exist and belong to the school
    for (const child of children) {
      const student = await Student.findById(child.student);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${child.student} not found`,
        });
      }
      if (student.school.toString() !== parentData.school) {
        return res.status(400).json({
          success: false,
          message: "All children must belong to the same school",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create parent
    const parent = new Parent({
      ...parentData,
      password: hashedPassword,
      children,
    });

    await parent.save();

    // Remove password from response
    const parentResponse = parent.toObject();
    delete parentResponse.password;

    res.status(201).json({
      success: true,
      message: "Parent registered successfully",
      data: parentResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering parent",
      error: error.message,
    });
  }
};

// Parent Login
export const parentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find parent
    const parent = await Parent.findOne({ email, isActive: true }).populate(
      "children.student",
      "name rollNum sclassName"
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found or account inactive",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, parent.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Update last login
    parent.lastLogin = new Date();
    await parent.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: parent._id, role: parent.role, email: parent.email },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const parentResponse = parent.toObject();
    delete parentResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        parent: parentResponse,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

// Get Parent Profile
export const getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.parentId)
      .populate("children.student", "name rollNum sclassName")
      .populate("school", "schoolName")
      .select("-password");

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent profile retrieved successfully",
      data: parent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving parent profile",
      error: error.message,
    });
  }
};

// Update Parent Profile
export const updateParentProfile = async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.parentId,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedParent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent profile updated successfully",
      data: updatedParent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating parent profile",
      error: error.message,
    });
  }
};

// ========== STUDENT PROGRESS TRACKING ==========

// Get Child's Academic Performance
export const getChildAcademicPerformance = async (req, res) => {
  try {
    const { parentId, studentId } = req.params;

    // Verify parent-child relationship
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const isParentChild = parent.children.some(
      (child) => child.student.toString() === studentId
    );
    if (!isParentChild) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your child",
      });
    }

    // Get student details with academic data
    const student = await Student.findById(studentId)
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName subCode")
      .select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Calculate academic statistics
    const totalMarks = student.examResult.reduce(
      (sum, result) => sum + result.marksObtained,
      0
    );
    const averageMarks = student.examResult.length > 0 
      ? (totalMarks / student.examResult.length).toFixed(2)
      : 0;

    // Get attendance statistics
    const totalAttendance = student.attendance.length;
    const presentDays = student.attendance.filter(
      (att) => att.status === "Present"
    ).length;
    const attendancePercentage = totalAttendance > 0 
      ? ((presentDays / totalAttendance) * 100).toFixed(2)
      : 0;

    const academicData = {
      student: {
        name: student.name,
        rollNum: student.rollNum,
        class: student.sclassName,
      },
      examResults: student.examResult,
      academicStats: {
        totalSubjects: student.examResult.length,
        averageMarks: parseFloat(averageMarks),
        totalMarks,
      },
      attendance: {
        totalDays: totalAttendance,
        presentDays,
        absentDays: totalAttendance - presentDays,
        attendancePercentage: parseFloat(attendancePercentage),
      },
      recentAttendance: student.attendance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10),
    };

    res.status(200).json({
      success: true,
      message: "Academic performance retrieved successfully",
      data: academicData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving academic performance",
      error: error.message,
    });
  }
};

// Get Child's Attendance Details
export const getChildAttendance = async (req, res) => {
  try {
    const { parentId, studentId } = req.params;
    const { month, year } = req.query;

    // Verify parent-child relationship
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const isParentChild = parent.children.some(
      (child) => child.student.toString() === studentId
    );
    if (!isParentChild) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your child",
      });
    }

    // Get student attendance
    const student = await Student.findById(studentId)
      .populate("attendance.subName", "subName")
      .select("name rollNum attendance");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    let attendance = student.attendance;

    // Filter by month and year if provided
    if (month && year) {
      attendance = attendance.filter((att) => {
        const attDate = new Date(att.date);
        return (
          attDate.getMonth() + 1 === parseInt(month) &&
          attDate.getFullYear() === parseInt(year)
        );
      });
    }

    // Sort by date (most recent first)
    attendance.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter((att) => att.status === "Present").length;
    const absentDays = attendance.filter((att) => att.status === "Absent").length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      message: "Attendance details retrieved successfully",
      data: {
        student: {
          name: student.name,
          rollNum: student.rollNum,
        },
        period: month && year ? `${month}/${year}` : "All time",
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage: parseFloat(attendancePercentage),
        },
        attendance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving attendance details",
      error: error.message,
    });
  }
};

// ========== FEE MANAGEMENT ==========

// Get Child's Fee Details
export const getChildFeeDetails = async (req, res) => {
  try {
    const { parentId, studentId } = req.params;
    const { academicYear } = req.query;

    // Verify parent-child relationship
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const isParentChild = parent.children.some(
      (child) => child.student.toString() === studentId
    );
    if (!isParentChild) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your child",
      });
    }

    // Get fee details
    let filter = { student: studentId, isActive: true };
    if (academicYear) filter.academicYear = academicYear;

    const feeDetails = await StudentFee.find(filter)
      .populate("student", "name rollNum")
      .populate("feeStructure")
      .populate("sclassName", "sclassName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fee details retrieved successfully",
      data: feeDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving fee details",
      error: error.message,
    });
  }
};

// ========== LIBRARY TRACKING ==========

// Get Child's Library Records
export const getChildLibraryRecords = async (req, res) => {
  try {
    const { parentId, studentId } = req.params;
    const { status } = req.query;

    // Verify parent-child relationship
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const isParentChild = parent.children.some(
      (child) => child.student.toString() === studentId
    );
    if (!isParentChild) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not your child",
      });
    }

    // Get library records
    let filter = { student: studentId, isActive: true };
    if (status) filter.status = status;

    const libraryRecords = await BookIssue.find(filter)
      .populate("book", "title author isbn category")
      .populate("student", "name rollNum")
      .sort({ issueDate: -1 });

    // Calculate statistics
    const totalIssued = libraryRecords.length;
    const currentlyIssued = libraryRecords.filter(
      (record) => record.status === "Issued" || record.status === "Overdue"
    ).length;
    const overdue = libraryRecords.filter(
      (record) => record.status === "Overdue"
    ).length;
    const totalFines = libraryRecords.reduce(
      (sum, record) => sum + record.fine.amount,
      0
    );
    const unpaidFines = libraryRecords.reduce(
      (sum, record) => sum + (record.fine.isPaid ? 0 : record.fine.amount),
      0
    );

    res.status(200).json({
      success: true,
      message: "Library records retrieved successfully",
      data: {
        statistics: {
          totalIssued,
          currentlyIssued,
          overdue,
          totalFines,
          unpaidFines,
        },
        records: libraryRecords,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving library records",
      error: error.message,
    });
  }
};

// ========== COMMUNICATION ==========

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { parentId } = req.params;
    const messageData = {
      ...req.body,
      sender: parentId,
      senderModel: "parent",
      school: req.body.school || req.user.school,
    };

    const message = new ParentMessage(messageData);
    await message.save();

    const populatedMessage = await ParentMessage.findById(message._id)
      .populate("sender", "firstName lastName")
      .populate("recipient", "firstName lastName name")
      .populate("student", "name rollNum");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Get Parent Messages
export const getParentMessages = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { type, unread, page = 1, limit = 10 } = req.query;

    let filter = {
      $or: [{ sender: parentId }, { recipient: parentId }],
      isActive: true,
    };

    if (type) filter.messageType = type;
    if (unread === "true") {
      filter.recipient = parentId;
      filter.isRead = false;
    }

    const skip = (page - 1) * limit;

    const messages = await ParentMessage.find(filter)
      .populate("sender", "firstName lastName name")
      .populate("recipient", "firstName lastName name")
      .populate("student", "name rollNum")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ParentMessage.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
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
      message: "Error retrieving messages",
      error: error.message,
    });
  }
};

// Mark Message as Read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { parentId } = req.body;

    const message = await ParentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not the message recipient",
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    message.status = "Read";
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking message as read",
      error: error.message,
    });
  }
};

// ========== SCHOOL EVENTS & NOTICES ==========

// Get School Events
export const getSchoolEvents = async (req, res) => {
  try {
    const { school, eventType, upcoming, page = 1, limit = 10 } = req.query;

    let filter = { isActive: true };
    if (school) filter.school = school;
    if (eventType) filter.eventType = eventType;
    if (upcoming === "true") {
      filter.startDate = { $gte: new Date() };
    }

    const skip = (page - 1) * limit;

    const events = await SchoolEvent.find(filter)
      .populate("school", "schoolName")
      .populate("targetClasses", "sclassName")
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SchoolEvent.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "School events retrieved successfully",
      data: events,
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
      message: "Error retrieving school events",
      error: error.message,
    });
  }
};

// Get School Notices
export const getSchoolNotices = async (req, res) => {
  try {
    const { school, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (school) filter.school = school;

    const skip = (page - 1) * limit;

    const notices = await Notice.find(filter)
      .populate("school", "schoolName")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "School notices retrieved successfully",
      data: notices,
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
      message: "Error retrieving school notices",
      error: error.message,
    });
  }
};

// ========== DASHBOARD ==========

// Get Parent Dashboard Data
export const getParentDashboard = async (req, res) => {
  try {
    const { parentId } = req.params;

    const parent = await Parent.findById(parentId).populate(
      "children.student",
      "name rollNum sclassName"
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const dashboardData = {
      parent: {
        name: parent.fullName,
        children: parent.children,
      },
      summary: {
        totalChildren: parent.children.length,
      },
    };

    // Get data for each child
    for (const child of parent.children) {
      const studentId = child.student._id;

      // Get recent attendance
      const student = await Student.findById(studentId).select("attendance");
      const recentAttendance = student.attendance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Get fee status
      const feeStatus = await StudentFee.findOne({
        student: studentId,
        isActive: true,
      }).sort({ createdAt: -1 });

      // Get library status
      const libraryStatus = await BookIssue.countDocuments({
        student: studentId,
        status: { $in: ["Issued", "Overdue"] },
      });

      child.recentAttendance = recentAttendance;
      child.feeStatus = feeStatus;
      child.currentlyIssuedBooks = libraryStatus;
    }

    // Get recent messages
    const recentMessages = await ParentMessage.find({
      $or: [{ sender: parentId }, { recipient: parentId }],
      isActive: true,
    })
      .populate("sender", "firstName lastName name")
      .populate("student", "name rollNum")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const upcomingEvents = await SchoolEvent.find({
      school: parent.school,
      startDate: { $gte: new Date() },
      isActive: true,
    })
      .sort({ startDate: 1 })
      .limit(5);

    // Get recent notices
    const recentNotices = await Notice.find({
      school: parent.school,
    })
      .sort({ date: -1 })
      .limit(3);

    dashboardData.recentMessages = recentMessages;
    dashboardData.upcomingEvents = upcomingEvents;
    dashboardData.recentNotices = recentNotices;

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving dashboard data",
      error: error.message,
    });
  }
};
