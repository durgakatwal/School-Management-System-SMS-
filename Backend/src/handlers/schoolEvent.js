import express from "express";
import {
  schoolEventCreate,
  schoolEventList,
  updateSchoolEvent,
  deleteSchoolEvent,
  deleteSchoolEvents,
  uploadSchoolEventImage,
  deleteSchoolEventImage,
} from "../services/schoolEvent.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/create", schoolEventCreate);
router.get("/list/:id", schoolEventList);
router.patch("/updateSchoolEvent/:id", updateSchoolEvent);
router.delete("/deleteSchoolEvent/:id", deleteSchoolEvent);
router.delete("/deleteAllSchoolEvents/:id", deleteSchoolEvents);
router.post("/uploadImage/:id", upload.array("images"), uploadSchoolEventImage);
router.delete("/deleteImage/:id/:publicId", deleteSchoolEventImage);
export default router;
