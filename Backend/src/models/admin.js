import mongoose from "mongoose";
import { Schema } from "mongoose";

const adminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "Admin",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  schoolName: {
    type: String,
    unique: true,
    required: true,
  },
  profilePicture: {
    type: String,
    default: " ",
  },
});

const Admin = mongoose.model("admin", adminSchema);
export default Admin;
