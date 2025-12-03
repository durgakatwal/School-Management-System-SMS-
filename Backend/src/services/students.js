import Student from "../models/students.js";
import bcrypt from "bcrypt";
import Subject from "../models/subject.js";
import jwt from "jsonwebtoken";

// ===================== REGISTER =====================
export const studentRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingRoll = await Student.findOne({
      rollNum: req.body.rollNum,
      school: req.body.school,
      sclassName: req.body.sclassName,
    });

    if (existingRoll) {
      return res.status(400).json({ message: "Roll Number already exists" });
    }

    const student = new Student({
      ...req.body,
      password: hashedPass,
    });

    const result = await student.save();
    result.password = undefined;

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ===================== LOGIN =====================
export const studentLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1d" }
    );

    student.password = undefined;

    res.status(200).json({
      message: "Login success",
      token,
      student,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// ===================== GET ALL STUDENTS =====================
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("sclassName", "sclassName")
      .populate("school", "schoolName")
      .populate("examResult.subName", "subName");

    res.json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

// ===================== GET SINGLE STUDENT =====================
export const getStudentDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("sclassName", "sclassName")
      .populate("school", "schoolName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student", error: error.message });
  }
};

// ===================== DELETE STUDENT =====================
export const deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};

// ===================== DELETE STUDENTS BY SCHOOL =====================
export const deleteStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id });
    res.json({ message: `${result.deletedCount} students deleted` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting students", error: error.message });
  }
};

// ===================== DELETE STUDENTS BY CLASS =====================
export const deleteStudentsByClass = async (req, res) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    res.json({
      message: `${result.deletedCount} students deleted from this class`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting students", error: error.message });
  }
};

// ===================== UPDATE STUDENT =====================
export const updateStudent = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

// ===================== UPDATE EXAM RESULT =====================
export const updateExamResult = async (req, res) => {
  const { subName, marksObtained } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingResult = student.examResult.find(
      (result) => result.subName.toString() === subName
    );

    if (existingResult) {
      existingResult.marksObtained = marksObtained;
    } else {
      student.examResult.push({ subName, marksObtained });
    }

    const result = await student.save();
    delete result.password;
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating exam result", error: error.message });
  }
};

// ===================== ATTENDANCE =====================
export const studentAttendance = async (req, res) => {
  const { subName, status, date } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingAttendance = student.attendance.find(
      (a) =>
        a.date.toDateString() === new Date(date).toDateString() &&
        a.subName.toString() === subName
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    delete result.password;
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
  }
};

// ===================== GET ATTENDANCE =====================
export const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("attendance");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student.attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};
