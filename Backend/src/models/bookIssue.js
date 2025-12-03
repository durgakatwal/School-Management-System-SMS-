import mongoose from "mongoose";

const bookIssueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
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
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    actualReturnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Issued", "Returned", "Overdue", "Lost", "Damaged"],
      default: "Issued",
    },
    issuedBy: {
      type: String,
      required: true,
      maxlength: 100,
    },
    returnedTo: {
      type: String,
      maxlength: 100,
    },
    fine: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
      reason: {
        type: String,
        enum: ["Late Return", "Damage", "Lost Book", "Other"],
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      paidTo: {
        type: String,
        maxlength: 100,
      },
    },
    renewalCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 3, // Maximum 3 renewals allowed
    },
    renewalHistory: [
      {
        renewedDate: {
          type: Date,
          required: true,
        },
        newDueDate: {
          type: Date,
          required: true,
        },
        renewedBy: {
          type: String,
          required: true,
          maxlength: 100,
        },
      },
    ],
    condition: {
      atIssue: {
        type: String,
        enum: ["Excellent", "Good", "Fair", "Poor"],
        default: "Good",
      },
      atReturn: {
        type: String,
        enum: ["Excellent", "Good", "Fair", "Poor", "Damaged"],
      },
    },
    notes: {
      type: String,
      maxlength: 500,
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

// Update status based on dates
bookIssueSchema.pre("save", function (next) {
  const now = new Date();

  if (this.returnDate) {
    this.status = "Returned";
    this.actualReturnDate = this.returnDate;
  } else if (this.dueDate < now && this.status === "Issued") {
    this.status = "Overdue";
  }

  next();
});

// Calculate fine for overdue books
bookIssueSchema.methods.calculateFine = function (finePerDay = 5) {
  if (this.status === "Returned" && this.actualReturnDate > this.dueDate) {
    const daysLate = Math.ceil(
      (this.actualReturnDate - this.dueDate) / (1000 * 60 * 60 * 24)
    );
    return daysLate * finePerDay;
  } else if (this.status === "Overdue") {
    const daysLate = Math.ceil(
      (new Date() - this.dueDate) / (1000 * 60 * 60 * 24)
    );
    return daysLate * finePerDay;
  }
  return 0;
};

// Indexes for better query performance
// bookIssueSchema.index({ student: 1, status: 1 });
// bookIssueSchema.index({ book: 1, status: 1 });
// bookIssueSchema.index({ school: 1, status: 1 });
// bookIssueSchema.index({ dueDate: 1, status: 1 });

const BookIssue = mongoose.model("bookIssue", bookIssueSchema);
export default BookIssue;
