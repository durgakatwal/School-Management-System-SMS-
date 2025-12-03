import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: "2024-2025",
    },
    feeCategories: [
      {
        categoryName: {
          type: String,
          required: true,
          enum: [
            "Tuition Fee",
            "Admission Fee",
            "Library Fee",
            "Laboratory Fee",
            "Sports Fee",
            "Transport Fee",
            "Examination Fee",
            "Development Fee",
            "Computer Fee",
            "Other",
          ],
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        isOptional: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          maxlength: 200,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentSchedule: {
      type: String,
      enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"],
      default: "Monthly",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    lateFeeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lateFeeAfterDays: {
      type: Number,
      default: 30,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
feeStructureSchema.pre("save", function (next) {
  this.totalAmount = this.feeCategories.reduce(
    (total, category) => total + category.amount,
    0
  );
  next();
});

// Index for better query performance
feeStructureSchema.index({ school: 1, sclassName: 1, academicYear: 1 });

const FeeStructure = mongoose.model("feeStructure", feeStructureSchema);
export default FeeStructure;
