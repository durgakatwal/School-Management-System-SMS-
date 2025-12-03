// import { Router } from "express";
// import {
//   create,
//   findAll,
//   findById,
//   update,
//   remove,
// } from "../services/AttendanceList.js";
// import { useValidator } from "../middlewares/useValidator.js";
// import { createAttendanceValdation } from "../validation/attendanceValidation.js";

// const router = Router();

// router.post("/", useValidator(createAttendanceValdation), create);
// router.get("/", findAll);
// router.get("/:id", findById);
// router.patch("/:id", update);
// router.delete("/:id", remove);

// export default router;import { Router } from "express";

import Attendance from "../models/attendanceList.js";
import { Router } from "express";
import {
  createOrUpdateAttendance,
  getAttendanceList,
  getAttendanceStats,
  updateAttendanceStatus,
} from "../services/AttendanceList.js";

const router = Router();

// Add this debug route to check your database
// router.get("/debug/check-database", async (req, res) => {
//   try {
//     // Check if collection exists and has data
//     const totalRecords = await Attendance.countDocuments({});
//     const sampleRecords = await Attendance.find({}).limit(5);

//     console.log("Attendance Collection Info:");
//     console.log(`Total records: ${totalRecords}`);
//     console.log("Sample records:", sampleRecords);

//     res.json({
//       totalRecords,
//       sampleRecords,
//       message:
//         totalRecords === 0
//           ? "No attendance records found in database"
//           : "Records found",
//     });
//   } catch (error) {
//     console.error("Debug error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Get attendance with filtering
router.get("/", getAttendanceList);

// Create or update attendance
router.post("/", createOrUpdateAttendance);

// Update attendance status
router.patch("/:id", updateAttendanceStatus);

// Get attendance statistics
router.get("/stats/summary", getAttendanceStats);

// Get today's attendance overview for chart
router.get("/stats/overview", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const statusCounts = attendance.reduce(
      (acc, rec) => {
        acc[rec.status] = (acc[rec.status] || 0) + 1;
        return acc;
      },
      { Present: 0, Absent: 0, Late: 0 }
    );

    const chartData = [
      { name: "Present", value: statusCounts.Present, color: "#10B981" },
      { name: "Absent", value: statusCounts.Absent, color: "#EF4444" },
      { name: "Late", value: statusCounts.Late, color: "#F59E0B" },
    ];

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    res.status(500).json({ error: "Failed to fetch attendance overview" });
  }
});

export default router;
