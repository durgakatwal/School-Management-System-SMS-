import { body, validationResult } from "express-validator";
import attendanceList from "../models/AttendanceList.js";
import { isValidObjectId } from "mongoose"; // this will validate the id of each student from the mongoDB

export const createAttendanceValdation = [
  body("date").isISO8601().isEmpty().withMessage("Invalid Date Format"),

  body("class").notEmpty().withMessage("Class is required"),

  body("section").notEmpty().withMessage("Section is required"),

  body("students")
    .isArray({ min: 1 })
    .withMessage("Students must be non empty"),

  body("students.*.student")
    .custom((value) => isValidObjectId(value))
    .withMessage("Each student must have avalid id"),

  body("students.*.status")
    .isIn(["present", "absent", "late"])
    .withMessage("Status must be one of : present,absent,late"),
];
