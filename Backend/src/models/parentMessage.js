import mongoose from "mongoose";

const parentMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["parent", "teacher", "admin"],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["parent", "teacher", "admin"],
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
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    messageType: {
      type: String,
      enum: ["General", "Academic", "Behavioral", "Fee", "Health", "Other"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
        },
        fileType: {
          type: String,
        },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    parentThread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parentMessage",
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parentMessage",
      },
    ],
    status: {
      type: String,
      enum: ["Sent", "Delivered", "Read", "Replied"],
      default: "Sent",
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

// Update status when read
parentMessageSchema.pre("save", function (next) {
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
    this.status = "Read";
  }
  next();
});

const ParentMessage = mongoose.model("parentMessage", parentMessageSchema);
export default ParentMessage;
