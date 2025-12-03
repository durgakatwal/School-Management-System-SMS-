import { Router } from "express";
import {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  // clearAllStudentsAttendanceBySubject,
  // clearAllStudentsAttendance,
  // removeStudentAttendanceBySubject,
  // removeStudentAttendance,
} from "../services/students.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createStudentValidation } from "../validation/studentValidation.js";
const router = Router();

router.post(
  "/StudentReg",
  useValidator(createStudentValidation),
  studentRegister
);
router.post("/StudentLogin", studentLogIn);

router.get("/Students", getStudents);
router.get("/Student/:id", getStudentDetail);

router.delete("/Students/:id", deleteStudents);
router.delete("/StudentsClass/:id", deleteStudentsByClass);
router.delete("/Student/:id", deleteStudent);

router.patch("/StudentUpdate/:id", updateStudent);

router.patch("/UpdateExamResult/:id", updateExamResult);

router.patch("/StudentAttendance/:id", studentAttendance);

// router.patch(
//   "/RemoveAllStudentsSubAtten/:id",
//   clearAllStudentsAttendanceBySubject
// );
// router.patch("/RemoveAllStudentsAtten/:id", clearAllStudentsAttendance);

// router.patch("/RemoveStudentSubAtten/:id", removeStudentAttendanceBySubject);
// router.patch("/RemoveStudentAtten/:id", removeStudentAttendance);
export default router;
