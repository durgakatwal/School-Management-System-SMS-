import { Router } from "express";
import {
  noticeCreate,
  noticeList,
  uploadNoticeImage,
  deleteNoticeImage,
} from "../services/notice.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createNoticeValidation } from "../validation/noticeValidation.js";
import multer from "multer";
const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });
router.post(
  "/CreateNotices",
  useValidator(createNoticeValidation),
  noticeCreate
);
router.get("/notices", noticeList);
router.post(
  "/uploadNoticeImage/:id",
  upload.array("images"),
  uploadNoticeImage
); // in postman we need to use the filed name images when uploading the files in upload.array("images")
router.delete("/deleteNoticeImage/:id/:publicId", deleteNoticeImage);

export default router;
