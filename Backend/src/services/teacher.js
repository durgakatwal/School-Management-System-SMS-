import Teacher from "../models/teacher.js";
import bcrypt from "bcrypt";
import { body } from "express-validator";
import Subject from "../models/subject.js";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import mongoose from "mongoose";

const teacherRegister = async (req, res) => {
  const { name, email, password, role, school, teachSubject, teachSclass } =
    req.body;
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Check duplicate email
    const existingTeacherByEmail = await Teacher.findOne({ email });
    if (existingTeacherByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create teacher
    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role: role || "Teacher",
      school,
      teachSubject,
      teachSclass,
    });

    let result = await teacher.save();

    // ✅ Only update subject if it's a valid ObjectId
    if (teachSubject && mongoose.Types.ObjectId.isValid(teachSubject)) {
      await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
    }

    result = result.toObject();
    delete result.password;

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Teacher register failed:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (!teacher) return res.status(404).send({ message: "Teacher not found" });

    const validated = await bcrypt.compare(req.body.password, teacher.password);
    if (!validated)
      return res.status(401).send({ message: "Invalid password" });

    teacher = await Teacher.findOne({ email: req.body.email })
      .populate("teachSubject", "subName")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login success",
      token,
      teacher: {
        ...teacher._doc,
        password: undefined,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

const getTeachers = async (req, res) => {
  try {
    let teachers = await Teacher.find()
      .populate("teachSubject", "subName")
      .populate("teachSclass", "sclassName");
    if (teachers.length > 0) {
      let modifiedTeachers = teachers.map((teacher) => {
        return { ...teacher._doc, password: undefined };
      });
      res.send(modifiedTeachers);
    } else {
      res.send({ message: "No teachers found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");
    if (teacher) {
      teacher.password = undefined;
      res.send(teacher);
    } else {
      res.send({ message: "No teacher found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.send(updatedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachers = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachersByClass = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.send({ message: "Teacher not found" });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getTeacherAttendance = async (req, res) => {
  const teacherId = req.params.id;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.send({ message: "Teacher not found" });
    }
    return res.send(teacher.attendance);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
  getTeacherAttendance,
};
