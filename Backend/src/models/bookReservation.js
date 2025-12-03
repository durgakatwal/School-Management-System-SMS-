import mongoose from "mongoose";

const bookReservationSchema = new mongoose.Schema(
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
    reservationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      default: function () {
        // Reservation expires after 7 days
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      },
    },
    status: {
      type: String,
      enum: ["Active", "Fulfilled", "Expired", "Cancelled"],
      default: "Active",
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    fulfilledDate: {
      type: Date,
    },
    cancelledDate: {
      type: Date,
    },
    cancelledBy: {
      type: String,
      maxlength: 100,
    },
    cancelReason: {
      type: String,
      maxlength: 200,
    },
    notes: {
      type: String,
      maxlength: 300,
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

//Auto Update status based on expiry date
bookReservationSchema.pre("save", function (next) {
  const now = new Date();

  if (this.status === "Active" && this.expiryDate < now) {
    this.status = "Expired";
  }

  next();
});

// // Indexes for better query performance
// bookReservationSchema.index({ student: 1, status: 1 });
// bookReservationSchema.index({ book: 1, status: 1 });
// bookReservationSchema.index({ school: 1, status: 1 });
// bookReservationSchema.index({ expiryDate: 1, status: 1 });

const BookReservation = mongoose.model(
  "bookReservation",
  bookReservationSchema
);
export default BookReservation;
