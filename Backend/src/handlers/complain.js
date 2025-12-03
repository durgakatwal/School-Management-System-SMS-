import { Router } from "express";
import { complainCreate, complainList } from "../services/complain.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createComplainValidation } from "../validation/complainValidation.js";
const router = Router();

router.post(
  "/complain-Register",
  useValidator(createComplainValidation),
  complainCreate
);

router.get("/complain-lists", complainList);

export default router;
