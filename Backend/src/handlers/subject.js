import { Router } from "express";
import {
  assignTeacherToSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByClass,
  getSubjectsByTeacher,
  getSubjectStats,
  removeTeacherFromSubject,
  subjectCreate,
  updateSubject,
} from "../services/subject.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createSubjectValidation } from "../validation/subjectValidation.js";

const router = Router();
router.post(
  "/addsubject",
  useValidator(createSubjectValidation),
  subjectCreate
);
router.get("/subjects", getAllSubjects);
router.get("/subjects/stats", getSubjectStats);
router.get("/subjects/:id", getSubjectById);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

// Specialized routes
router.get("/subjects/class/:sclassName", getSubjectsByClass);
router.get("/subjects/teacher/:teacherId", getSubjectsByTeacher);
router.patch("/subjects/:id/assign-teacher", assignTeacherToSubject);
router.patch("/subjects/:id/remove-teacher", removeTeacherFromSubject);

export default router;
