import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
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
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feeStructure",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    totalFeeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountReason: {
      type: String,
      maxlength: 200,
    },
    lateFeeApplied: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid", "Overdue"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    lastPaymentDate: {
      type: Date,
    },
    paymentHistory: [
      {
        paymentId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        paymentDate: {
          type: Date,
          default: Date.now,
        },
        paymentMethod: {
          type: String,
          enum: ["Cash", "Bank Transfer", "Online", "Cheque", "Card"],
          required: true,
        },
        transactionId: {
          type: String,
        },
        receivedBy: {
          type: String,
          required: true,
        },
        remarks: {
          type: String,
          maxlength: 200,
        },
      },
    ],
    exemptions: [
      {
        categoryName: {
          type: String,
          required: true,
        },
        exemptedAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        reason: {
          type: String,
          required: true,
          maxlength: 200,
        },
        approvedBy: {
          type: String,
          required: true,
        },
        approvedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate remaining amount before saving
studentFeeSchema.pre("save", function (next) {
  this.remainingAmount =
    this.totalFeeAmount - this.paidAmount - this.discountAmount;

  // Update payment status based on amounts
  if (this.remainingAmount <= 0) {
    this.paymentStatus = "Paid";
  } else if (this.paidAmount > 0) {
    this.paymentStatus = "Partial";
  } else if (new Date() > this.dueDate) {
    this.paymentStatus = "Overdue";
  } else {
    this.paymentStatus = "Pending";
  }

  next();
});

// Index for better query performance
studentFeeSchema.index({ student: 1, academicYear: 1 });
studentFeeSchema.index({ school: 1, paymentStatus: 1 });
studentFeeSchema.index({ dueDate: 1, paymentStatus: 1 });

const StudentFee = mongoose.model("studentFee", studentFeeSchema);
export default StudentFee;
