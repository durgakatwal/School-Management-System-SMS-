import { Router } from "express";

import attendanceList from "./attendanceList.js";
import student from "./students.js";
import teacher from "./teacher.js";
import admin from "./admin.js";
import Subject from "./subject.js";
import sclass from "./sclass.js";
import complain from "./complain.js";
import notice from "./notice.js";
import feeRoutes from "./fee.js";
import libraryRoutes from "./library.js";
import parentRoutes from "./parent.js";
import schoolEventRoutes from "./schoolEvent.js";
const router = Router();

router.use("/admin", admin);
router.use("/subject", Subject);
router.use("/sclass", sclass);
router.use("/attendance-lists", attendanceList);
router.use("/students", student);
router.use("/teachers", teacher);
router.use("/complain", complain);
router.use("/notice", notice);
router.use("/fees", feeRoutes);
router.use("/library", libraryRoutes);
router.use("/parents", parentRoutes);
router.use("/schoolEvents", schoolEventRoutes);
export default router;
