import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const adminRegister = asyncHandler(async (req, res) => {
  console.log("🔴 Register route hit!");
  try {
    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
    const existingSchool = await Admin.findOne({
      schoolName: req.body.schoolName,
    });

    if (existingAdminByEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (existingSchool) {
      return res.status(409).json({ message: "School name already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({
      ...req.body,
      password: hashedPassword,
    });

    const result = await admin.save();
    result.password = undefined;
    res.status(201).json(result);
  } catch (err) {
    console.error("Registration error:", err.message || err);
    res.status(500).json({ message: err.message });
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    admin.password = undefined; //it hides password in response
    res.json({ admin, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const adminLogout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAdminDetail = asyncHandler(async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = undefined;
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

const updateAdmin = asyncHandler(async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password"); // it avoid returning password
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export { adminRegister, adminLogin, getAdminDetail, updateAdmin, deleteAdmin };
