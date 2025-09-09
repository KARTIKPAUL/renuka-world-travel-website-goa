// models/Tour.js
import mongoose from "mongoose";

const TourSchema = new mongoose.Schema(
  {
    title: {
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
    destination: {
      type: String,
      required: true,
      trim: true,
    },
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
    tourType: {
      type: String,
      required: true,
      enum: [
        "adventure",
        "cultural",
        "religious",
        "beach",
        "wildlife",
        "heritage",
        "honeymoon",
        "family",
        "group",
        "solo",
      ],
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "challenging"],
      default: "easy",
    },
    price: {
      adult: {
        type: Number,
        required: true,
        min: 0,
      },
      child: {
        type: Number,
        min: 0,
      },
      infant: {
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
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
          min: 1,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        activities: [
          {
            type: String,
            trim: true,
          },
        ],
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
    maxGroupSize: {
      type: Number,
      min: 1,
    },
    minGroupSize: {
      type: Number,
      min: 1,
      default: 1,
    },
    availableDates: [
      {
        type: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
TourSchema.index({ tourType: 1, isActive: 1 });
TourSchema.index({ destination: 1 });
TourSchema.index({ "price.adult": 1 });
TourSchema.index({ createdBy: 1 });
TourSchema.index({ title: "text", description: "text", destination: "text" });

export default mongoose.models.Tour || mongoose.model("Tour", TourSchema);
