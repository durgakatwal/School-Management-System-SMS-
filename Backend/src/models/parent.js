import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Phone number must be 10 digits",
      },
    },
    alternatePhone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: "Alternate phone number must be 10 digits",
      },
    },
    address: {
      street: {
        type: String,
        required: true,
        maxlength: 100,
      },
      city: {
        type: String,
        required: true,
        maxlength: 50,
      },
      state: {
        type: String,
        required: true,
        maxlength: 50,
      },
      zip: {
        type: String,
        required: true,
        maxlength: 10,
      },
    },
    occupation: {
      type: String,
      maxlength: 100,
    },
    relationship: {
      type: String,
      required: true,
      enum: ["Father", "Mother", "Guardian", "Other"],
    },
    children: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student",
          required: true,
        },
        relationship: {
          type: String,
          required: true,
          enum: ["Father", "Mother", "Guardian", "Other"],
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    emergencyContact: {
      name: {
        type: String,
        maxlength: 100,
      },
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^[0-9]{10}$/.test(v);
          },
          message: "Emergency contact phone must be 10 digits",
        },
      },
      relationship: {
        type: String,
        maxlength: 50,
      },
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      language: {
        type: String,
        default: "English",
        maxlength: 20,
      },
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    role: {
      type: String,
      default: "Parent",
    },
  },
  {
    timestamps: true,
  }
);

const Parent = mongoose.model("parent", parentSchema);
export default Parent;
