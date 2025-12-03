import { Router } from "express";
import {
  adminRegister,
  adminLogin,
  getAdminDetail,
  updateAdmin,
  deleteAdmin,
} from "../services/admin.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createAdminValidation } from "../validation/adminValidation.js";

import Student from "../models/students.js";
import Teacher from "../models/teacher.js";
import Class from "../models/sclass.js";
import Subject from "../models/subject.js";

const router = Router();
router.get("/stats", async (req, res) => {
  try {
    // console.log("/admin/stats called");
    const [totalStudents, totalTeachers, totalClasses, totalSubjects] =
      await Promise.all([
        Student.countDocuments({}),
        Teacher.countDocuments({}),
        Class.countDocuments({}),
        Subject.countDocuments({}),
      ]);

    // console.log(" Stats fetched successfully");
    res.json({
      students: totalStudents,
      teachers: totalTeachers,
      classes: totalClasses,
      subjects: totalSubjects,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

router.post("/register", useValidator(createAdminValidation), adminRegister);
router.post("/login", adminLogin);
router.get("/:id", getAdminDetail);
router.patch("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
