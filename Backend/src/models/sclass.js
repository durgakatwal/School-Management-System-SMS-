import mongoose from "mongoose";

const sclassSchema = new mongoose.Schema(
  {
    sclassName: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      ref: "admin",
    },
  },
  { timestamps: true }
);

const Sclass = mongoose.model("sclass", sclassSchema);
export default Sclass;
