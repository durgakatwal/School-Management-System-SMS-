import Complain from "../models/complain.js";
import asyncHandler from "express-async-handler";
const complainCreate = asyncHandler(async (req, res) => {
  try {
    const complain = new Complain(req.body);
    const result = await complain.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

const complainList = asyncHandler(async (req, res) => {
  try {
    let complains = await Complain.find({ school: req.params.id }).populate(
      "user",
      "name"
    );
    if (complains.length > 0) {
      res.send(complains);
    } else {
      res.send({ message: "No complains found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export { complainCreate, complainList };
