// import asyncHandler from "express-async-handler";
// import attendanceList from "../models/AttendanceList.js";

// const create = asyncHandler(async (req, res) => {
//   const { date, class: className, section, students } = req.body;

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email is already in use" });
//   }
//   const newAttendance = await attendanceList.create({
//     date,
//     class: className,
//     section,
//     students,
//   });
//   res.status(201).json(newAttendance);
// });

// const findAll = asyncHandler(async (req, res) => {
//   const attendanceLists = await attendanceList.find();
//   res.status(200).json(attendanceLists);
// });

// const findById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const attendanceById = await attendanceList.findById(id);
//   if (!attendanceById) {
//     res.status(404).json({ message: "Attendance List not found" });
//     return;
//   }
//   res.status(200).json(attendanceById);
// });

// const update = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { student, status } = req.body;

//   const attendance = await attendanceList.findById(id);
//   if (!attendance) {
//     return res.status(404).json({ message: "Attendance list not found" });
//   }

//   // find the student in the list
//   const studentRecord = attendance.students.find(
//     (s) => s.student.toString() === student
//   );

//   if (!studentRecord) {
//     return res.status(404).json({ message: "Student not found in this list" });
//   }

//   studentRecord.status = status;
//   await attendance.save();

//   res.status(200).json({ message: "Student attendance updated", attendance });
// });

// const remove = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const removeByID = await attendanceList.findByIdAndDelete(id);
//   if (!removeByID) {
//     res.status(404).json({ message: "Attendance List not found" });
//     return;
//   }
//   res.status(200).json(removeByID);
// });

// export { create, findAll, findById, update, remove };

import Attendance from "../models/attendanceList.js";
import Student from "../models/students.js";
import Teacher from "../models/teacher.js";

// Get all attendance with proper population
const getAttendanceList = async (req, res) => {
  try {
    const { date, type } = req.query;

    let query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (type) {
      query.type = type;
    }

    const attendance = await Attendance.find(query)
      .populate("student", "name rollNum sclassName")
      .populate("teacher", "name subject")
      .sort({ date: -1, createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

// Create or update attendance
const createOrUpdateAttendance = async (req, res) => {
  try {
    const { student, teacher, type, date, status } = req.body;

    // Validate required fields
    if (!type || !date || !status) {
      return res
        .status(400)
        .json({ error: "Type, date, and status are required" });
    }

    let query = { date: new Date(date) };

    if (type === "student" && student) {
      query.student = student;
      query.type = "student";
    } else if (type === "teacher" && teacher) {
      query.teacher = teacher;
      query.type = "teacher";
    } else {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    // Upsert attendance record
    const attendance = await Attendance.findOneAndUpdate(
      query,
      {
        ...req.body,
        date: new Date(date),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
      .populate("student", "name rollNum sclassName")
      .populate("teacher", "name subject");

    res.json(attendance);
  } catch (error) {
    console.error("Error creating/updating attendance:", error);
    res.status(500).json({ error: "Failed to save attendance record" });
  }
};

// Update attendance status
const updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("student", "name rollNum sclassName")
      .populate("teacher", "name subject");

    if (!updatedAttendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Failed to update attendance record" });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get today's attendance
    const attendance = await Attendance.find({
      date: { $gte: targetDate, $lt: nextDate },
    });

    // Calculate statistics
    const studentAttendance = attendance.filter((a) => a.type === "student");
    const teacherAttendance = attendance.filter((a) => a.type === "teacher");

    const studentStats = calculateStats(studentAttendance);
    const teacherStats = calculateStats(teacherAttendance);
    const overallStats = calculateStats(attendance);

    res.json({
      overall: overallStats,
      students: studentStats,
      teachers: teacherStats,
    });
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    res.status(500).json({ error: "Failed to fetch attendance statistics" });
  }
};

// Helper function to calculate statistics
const calculateStats = (attendance) => {
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const late = attendance.filter((a) => a.status === "Late").length;

  return {
    total,
    present,
    absent,
    late,
    presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
    absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
    latePercentage: total > 0 ? Math.round((late / total) * 100) : 0,
  };
};

export {
  getAttendanceList,
  createOrUpdateAttendance,
  updateAttendanceStatus,
  getAttendanceStats,
};
