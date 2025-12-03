import mongoose from "mongoose";

const eventImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

const schoolEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Academic",
        "Sports",
        "Cultural",
        "Holiday",
        "Exam",
        "Meeting",
        "Workshop",
        "Competition",
        "Field Trip",
        "Other",
      ],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Time must be in HH:MM format",
      },
    },
    endTime: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Time must be in HH:MM format",
      },
    },
    location: {
      type: String,
      maxlength: 200,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    targetAudience: {
      type: String,
      enum: [
        "All",
        "Students",
        "Parents",
        "Teachers",
        "Staff",
        "Specific Class",
      ],
      default: "All",
    },
    targetClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sclass",
      },
    ],
    organizer: {
      name: {
        type: String,
        required: true,
        maxlength: 100,
      },
      contact: {
        type: String,
        maxlength: 15,
      },
      email: {
        type: String,
        maxlength: 100,
      },
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    recurrenceEnd: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled", "Postponed"],
      default: "Scheduled",
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      min: 1,
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    registrationDeadline: {
      type: Date,
    },
    fee: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "NPR",
      },
    },
    reminders: [
      {
        reminderDate: {
          type: Date,
          required: true,
        },
        reminderType: {
          type: String,
          enum: ["Email", "SMS", "Push", "All"],
          default: "All",
        },
        message: {
          type: String,
          maxlength: 500,
        },
        isSent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    eventImage: [eventImageSchema],
  },
  {
    timestamps: true,
  }
);

// Update status based on dates
schoolEventSchema.pre("save", function (next) {
  const now = new Date();

  if (
    this.startDate <= now &&
    this.endDate >= now &&
    this.status === "Scheduled"
  ) {
    this.status = "Ongoing";
  } else if (this.endDate < now && this.status !== "Cancelled") {
    this.status = "Completed";
  }

  next();
});

// Indexes for better query performance
schoolEventSchema.index({ school: 1, startDate: 1 });
schoolEventSchema.index({ eventType: 1, status: 1 });
schoolEventSchema.index({ targetAudience: 1, startDate: 1 });

const SchoolEvent = mongoose.model("schoolEvent", schoolEventSchema);
export default SchoolEvent;
