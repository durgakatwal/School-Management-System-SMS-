// import mongoose from "mongoose";

// const subjectSchema = new mongoose.Schema(
//   {
//     subName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     subCode: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     sessions: {
//       type: Number, // 🔥 make this number, not string
//       required: true,
//       min: 1,
//       max: 7,
//     },
//     sclassName: {
//       type: String, // 🔥 was ObjectId, now String
//       required: true,
//       trim: true,
//     },
//     school: {
//       type: String, // 🔥 was ObjectId, now String
//       required: true,
//       trim: true,
//     },
//     teacher: {
//       type: String, // 🔥 was ObjectId, now String
//       default: null,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const Subject = mongoose.model("subject", subjectSchema);
// export default Subject;

// import mongoose from "mongoose";

// const subjectSchema = new mongoose.Schema(
//   {
//     name: {
//       // Changed from subName
//       type: String,
//       required: true,
//       trim: true,
//     },
//     code: {
//       // Changed from subCode
//       type: String,
//       required: true,
//       trim: true,
//       unique: true, // Added unique constraint
//     },
//     type: {
//       // NEW FIELD - Add this
//       type: String,
//       required: true,
//       enum: ["Core", "Elective", "Optional"], // Restrict values
//       default: "Core",
//     },
//     classes: {
//       // Changed from sessions
//       type: Number,
//       required: true,
//       min: 1,
//       max: 7,
//     },
//     className: {
//       // Changed from sclassName
//       type: String,
//       required: true,
//       trim: true,
//     },
//     school: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     teacher: {
//       type: String,
//       default: null,
//       trim: true,
//     },
//     teachersCount: {
//       // NEW FIELD - to track number of teachers
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// const Subject = mongoose.model("Subject", subjectSchema);
// export default Subject;

import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subName: {
      // Keep as subName
      type: String,
      required: true,
      trim: true,
    },
    subCode: {
      // Keep as subCode
      type: String,
      required: true,
      trim: true,
    },
    sessions: {
      // Keep as sessions
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    sclassName: {
      // Keep as sclassName
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
