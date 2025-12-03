// models/notice.js
import mongoose from "mongoose";

const noticeImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
});

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    details: { type: String, required: true },
    date: { type: Date, required: true },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    noticeImage: [noticeImageSchema],
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema); // Use singular name
export default Notice;
