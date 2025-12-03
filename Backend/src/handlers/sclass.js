import { Router } from "express";
import { useValidator } from "../middlewares/useValidator.js";
import { createsclassValidation } from "../validation/sclassValidation.js";
import {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
  updateSclass,
} from "../services/sclass.js";
import Sclass from "../models/sclass.js";
import Student from "../models/students.js";
import Teacher from "../models/teacher.js";
import Subject from "../models/subject.js";

const router = Router();
// Add this simple route that will definitely work
router.get("/all-classes", async (req, res) => {
  try {
    // console.log(" Getting ALL classes...");
    const allClasses = await Sclass.find({});
    // console.log(` Found ${allClasses.length} classes total`);

    // Send the raw data - no filtering
    res.json(allClasses);
  } catch (error) {
    console.error(" Error getting all classes:", error);
    res.status(500).json({ error: "Failed to get classes" });
  }
});
router.get("/stats", async (req, res) => {
  try {
    console.log("/admin/stats called");
    const [totalStudents, totalTeachers, totalClasses, totalSubjects] =
      await Promise.all([
        Student.countDocuments({}),
        Teacher.countDocuments({}),
        Sclass.countDocuments({}),
        Subject.countDocuments({}),
      ]);

    console.log(" Stats fetched successfully");
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

router.post("/", useValidator(createsclassValidation), sclassCreate);
router.get("/students/:id", getSclassStudents);
router.get("/school/:id", sclassList);

router.get("/:id", getSclassDetail);
router.delete("/:id", deleteSclass);
router.delete("/school/:id", deleteSclasses);
router.patch("/update/:id", updateSclass);

router.get("/school/name/:schoolName", async (req, res) => {
  try {
    const { schoolName } = req.params;
    const decodedSchoolName = decodeURIComponent(schoolName);

    console.log("Fetching classes for school:", decodedSchoolName);

    const classes = await Sclass.find({ school: decodedSchoolName });

    console.log("Found classes:", classes.length);
    console.log("Classes data:", classes);

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        message: `No classes found for school: ${decodedSchoolName}`,
      });
    }

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes by school name:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

//this is for debugging

// router.get("/debug/all-classes", async (req, res) => {
//   try {
//     const allClasses = await Sclass.find({});
//     console.log("🔍 ALL CLASSES IN DATABASE:");
//     allClasses.forEach((cls, index) => {
//       console.log(
//         `${index + 1}. ${cls.sclassName} - School: ${cls.school} - ID: ${
//           cls._id
//         }`
//       );
//     });
//     res.json({ total: allClasses.length, classes: allClasses });
//   } catch (error) {
//     console.error("Error fetching all classes:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
