// backend/services/auth.js (for SMS)
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import Teacher from "../models/teacher.js";
import Student from "../models/students.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = generateToken(admin._id, "admin");
  admin.password = undefined;
  res.json({ token, admin });
};

// ✅ Teacher Login
export const teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email });
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = generateToken(teacher._id, "teacher");
  teacher.password = undefined;
  res.json({ token, teacher });
};

// ✅ Student Login
export const studentLogin = async (req, res) => {
  const { rollNum, password } = req.body;
  const student = await Student.findOne({ rollNum });
  if (!student) return res.status(404).json({ message: "Student not found" });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = generateToken(student._id, "student");
  student.password = undefined;
  res.json({ token, student });
};
