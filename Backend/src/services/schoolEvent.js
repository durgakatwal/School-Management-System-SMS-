import SchoolEvent from "../models/schoolEvent.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const schoolEventCreate = async (req, res) => {
  try {
    const schoolEvent = new SchoolEvent({
      ...req.body,
      school: req.body.adminID,
    });
    const result = await schoolEvent.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const schoolEventList = async (req, res) => {
  try {
    let schoolEvents = await SchoolEvent.find({ school: req.params.id });
    if (schoolEvents.length > 0) {
      res.send(schoolEvents);
    } else {
      res.send({ message: "No school events found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateSchoolEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // update and return the new document
    const updatedEvent = await SchoolEvent.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "School event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
const deleteSchoolEvent = async (req, res) => {
  try {
    const result = await SchoolEvent.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSchoolEvents = async (req, res) => {
  try {
    const result = await SchoolEvent.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No school events found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//upload school event image

const uploadSchoolEventImage = async (req, res) => {
  try {
    // 1️⃣ Find the school event by ID only
    const schoolEvent = await SchoolEvent.findById(req.params.id);

    if (!schoolEvent) {
      return res.status(404).json({ message: "School event not found" });
    }

    // 2️⃣ Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let files = [];

    // 3️⃣ Upload each file to Cloudinary
    await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "schoolEvent",
          overwrite: false,
          unique_filename: true,
          use_filename: true,
        });

        files.push({
          url: result.secure_url,
          publicId: result.public_id,
        });

        // Remove temporary file
        fs.unlinkSync(file.path);
      })
    );

    // 4️⃣ Update school event with new images
    schoolEvent.eventImage = [...(schoolEvent.eventImage || []), ...files];
    await schoolEvent.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      schoolEvent,
      uploadedFiles: files,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Error uploading images",
      error: error.message,
    });
  }
};

const deleteSchoolEventImage = async (req, res) => {
  try {
    const schoolEvent = await SchoolEvent.findById(req.params.id);
    if (!schoolEvent) {
      return res.status(404).json({ message: "School event not found" });
    }
    const image = schoolEvent.eventImage.find(
      (image) => image.publicId === req.params.publicId
    );
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    await cloudinary.uploader.destroy(image.publicId);
    schoolEvent.eventImage = schoolEvent.eventImage.filter(
      (image) => image.publicId !== req.params.publicId
    );
    await schoolEvent.save();
    res.send(schoolEvent);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  schoolEventCreate,
  schoolEventList,
  updateSchoolEvent,
  deleteSchoolEvent,
  deleteSchoolEvents,
  uploadSchoolEventImage,
  deleteSchoolEventImage,
};
