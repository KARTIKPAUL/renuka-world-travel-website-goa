// models/Package.js
import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    packageType: {
      type: String,
      required: true,
      enum: [
        "honeymoon",
        "family",
        "adventure",
        "luxury",
        "budget",
        "group",
        "custom",
      ],
    },
    destinations: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    duration: {
      days: {
        type: Number,
        required: true,
        min: 1,
      },
      nights: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    price: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },
      pricePerPerson: {
        type: Number,
        min: 0,
      },
      childPrice: {
        type: Number,
        min: 0,
      },
    },
    inclusions: [
      {
        type: String,
        trim: true,
      },
    ],
    exclusions: [
      {
        type: String,
        trim: true,
      },
    ],
    accommodation: {
      type: {
        type: String,
        enum: ["hotel", "resort", "homestay", "guesthouse", "luxury"],
        default: "hotel",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      meals: {
        type: String,
        enum: ["breakfast", "half-board", "full-board", "all-inclusive"],
        default: "breakfast",
      },
    },
    transportation: {
      type: {
        type: String,
        enum: ["flight", "train", "bus", "car", "mixed"],
        default: "car",
      },
      included: {
        type: Boolean,
        default: false,
      },
    },
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
          },
          message: "Invalid image URL format",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    maxBookings: {
      type: Number,
      min: 1,
    },
    currentBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
PackageSchema.index({ packageType: 1, isActive: 1 });
PackageSchema.index({ destinations: 1 });
PackageSchema.index({ "price.basePrice": 1 });
PackageSchema.index({ createdBy: 1 });
PackageSchema.index({ validFrom: 1, validUntil: 1 });
PackageSchema.index({ name: "text", description: "text" });

export default mongoose.models.Package ||
  mongoose.model("Package", PackageSchema);
