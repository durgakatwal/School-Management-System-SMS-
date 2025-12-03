// import mongoose, { Schema, model } from "mongoose";
// const attendanceListSchema = new Schema({
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   class: {
//     type: String,
//     required: true,
//   },
//   section: {
//     type: String,
//     required: true,
//   },
//   students: [
//     {
//       student: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Student",
//         required: true,
//       },
//       status: {
//         type: String,
//         enum: ["present", "absent", "late"],
//         required: true,
//       },
//     },
//   ],
// });

// //the below line prevent duplicate attendance for same date/class/section
// attendanceListSchema.index({ date: 1, class: 1, section: 1 }, { unique: true });
// const attendanceList = model("AttendanceList", attendanceListSchema);
// export default attendanceList;

// import mongoose from "mongoose";

// const attendanceListSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "student",
//       required: false,
//     },
//     teacher: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "teacher",
//       required: false,
//     },
//     type: {
//       type: String,
//       enum: ["student", "teacher"],
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     class: {
//       type: String,
//       required: false,
//     },
//     date: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     status: {
//       type: String,
//       enum: ["Present", "Absent", "Late"],
//       default: "Present",
//     },
//   },
//   { timestamps: true }
// );

// const attendanceList = mongoose.model("AttendanceList", attendanceListSchema);
// export default attendanceList;

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: false,
    },
    type: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
