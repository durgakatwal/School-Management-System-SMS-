import { Router } from "express";
import {
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
} from "../services/teacher.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createTeacherValidation } from "../validation/teacherValidation.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  useValidator(createTeacherValidation),
  teacherRegister
);
router.post("/login", teacherLogIn);
router.use(authMiddleware);

router.get("/", getTeachers);
router.get("/:id", getTeacherDetail);

router.delete("/school/:id", deleteTeachers);
router.delete("/class/:id", deleteTeachersByClass);
router.delete("/:id", deleteTeacher);

router.patch("/", updateTeacherSubject);

router.post("/:id", teacherAttendance);

router.get("/Attendance/:id", getTeacherAttendance);

export default router;
