import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ensure no duplicate student emails
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    rollNum: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sclassName: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "Student",
    },
    examResult: [
      {
        subName: {
          type: String,
          trim: true,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
      },
    ],
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true,
        },
        subName: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
