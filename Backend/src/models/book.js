import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science",
        "Mathematics",
        "History",
        "Geography",
        "Literature",
        "Biography",
        "Reference",
        "Textbook",
        "Children",
        "Technology",
        "Arts",
        "Sports",
        "Other",
      ],
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    publicationYear: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear() + 1,
    },
    language: {
      type: String,
      required: true,
      default: "English",
      maxlength: 50,
    },
    pages: {
      type: Number,
      min: 1,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      shelf: {
        type: String,
        required: true,
        maxlength: 20,
      },
      section: {
        type: String,
        required: true,
        maxlength: 50,
      },
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "Damaged"],
      default: "Good",
    },
    price: {
      type: Number,
      min: 0,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        maxlength: 30,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure available copies doesn't exceed total copies
bookSchema.pre("save", function (next) {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

// // Indexes for better search performance
// bookSchema.index({ title: "text", author: "text", description: "text" });
// bookSchema.index({ school: 1, category: 1 });
// bookSchema.index({ author: 1 });

const Book = mongoose.model("book", bookSchema);
export default Book;
