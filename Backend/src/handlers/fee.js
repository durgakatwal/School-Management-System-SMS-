import express from "express";
import {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
  assignFeeToStudent,
  recordPayment,
  getStudentFeeDetails,
  getAllStudentFees,
  getPaymentHistory,
  addFeeExemption,
  getFeeStatistics,
  applyLateFee,
} from "../services/fee.js";
import {
  createFeeStructureValidation,
  updateFeeStructureValidation,
  assignFeeToStudentValidation,
  recordPaymentValidation,
  addFeeExemptionValidation,
} from "../validation/feeValidation.js";
import { validationResult } from "express-validator";

const router = express.Router();

// Fee Structure Routes
router.post(
  "/structure/create",
  createFeeStructureValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createFeeStructure
);

router.get("/structure/all", getFeeStructures);

router.get("/structure/:id", getFeeStructureById);

router.put(
  "/structure/:id",
  updateFeeStructureValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateFeeStructure
);

router.delete("/structure/:id", deleteFeeStructure);

// Student Fee Management Routes
router.post(
  "/assign",
  assignFeeToStudentValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  assignFeeToStudent
);

router.post(
  "/payment/record",
  recordPaymentValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  recordPayment
);

router.get("/student/:studentId", getStudentFeeDetails);

router.get("/all", getAllStudentFees);

router.get("/payment-history/:studentFeeId", getPaymentHistory);

router.post(
  "/exemption/add",
  addFeeExemptionValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addFeeExemption
);

// Statistics and Reports
router.get("/statistics", getFeeStatistics);

// Administrative Actions
router.post("/apply-late-fee", applyLateFee);

export default router;
