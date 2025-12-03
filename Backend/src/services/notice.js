// services/notice.js
import Notice from "../models/notice.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

// CREATE NOTICE
const noticeCreate = async (req, res) => {
  try {
    const { title, details, date, school } = req.body;

    if (!school || school.trim() === "") {
      return res.status(400).json({ error: "School name is required" });
    }

    const notice = new Notice({
      title,
      details,
      date: new Date(date),
      school: school.trim(), // store plain string
    });

    const result = await notice.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Create notice error:", err);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

// GET NOTICES BY SCHOOL (string match now)
const noticeList = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

// UPDATE NOTICE
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details, date, school } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (details) updateData.details = details;
    if (date) updateData.date = new Date(date);
    if (school) updateData.school = school.trim();

    const result = await Notice.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "Notice not found" });

    res.json(result);
  } catch (error) {
    console.error("Update notice error:", error);
    res.status(500).json({ error: "Failed to update notice" });
  }
};
// DELETE NOTICE
const deleteNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

// DELETE ALL NOTICES (by school)
const deleteNotices = async (req, res) => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    res.json({
      message: `${result.deletedCount} notice(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notices" });
  }
};

// UPLOAD IMAGE TO NOTICE
const uploadNoticeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.body; // from form or auth

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Optional: Verify ownership
    const expectedSchool = adminID;
    if (expectedSchool && !notice.school.equals(expectedSchool)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "notices",
            resource_type: "image",
            use_filename: true,
            unique_filename: false,
          });

          uploadedFiles.push({
            url: result.secure_url,
            publicId: result.public_id,
          });

          // Cleanup temp file
          fs.unlinkSync(file.path);
        } catch (uploadErr) {
          console.error("Cloudinary upload failed:", uploadErr);
        }
      })
    );

    if (uploadedFiles.length > 0) {
      notice.noticeImage.push(...uploadedFiles);
      await notice.save();

      return res.status(200).json({
        message: "Images uploaded successfully",
        notice,
        uploadedFiles,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No images were successfully uploaded" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      message: "Internal server error during upload",
      error: err.message,
    });
  }
};

// DELETE SINGLE IMAGE FROM NOTICE
const deleteNoticeImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const image = notice.noticeImage.find((img) => img.publicId === publicId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from DB
    notice.noticeImage = notice.noticeImage.filter(
      (img) => img.publicId !== publicId
    );
    await notice.save();

    res.json({ message: "Image deleted", notice });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

export {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
  uploadNoticeImage,
  deleteNoticeImage,
};
