// models/RentalService.js
import mongoose from "mongoose";

const RentalServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "car",
        "bike",
        "scooter",
        "bus",
        "tempo-traveller",
        "luxury-car",
        "suv",
        "sedan",
      ],
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      min: 1990,
      max: new Date().getFullYear() + 1,
    },
    capacity: {
      seating: {
        type: Number,
        required: true,
        min: 1,
      },
      luggage: {
        type: String,
        trim: true,
      },
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      default: "petrol",
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
    },
    pricing: {
      hourly: {
        type: Number,
        min: 0,
      },
      halfDay: {
        type: Number,
        min: 0,
      },
      fullDay: {
        type: Number,
        min: 0,
      },
      weekly: {
        type: Number,
        min: 0,
      },
      monthly: {
        type: Number,
        min: 0,
      },
    },
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        available: {
          type: Boolean,
          default: true,
        },
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
    documents: {
      licenseRequired: {
        type: Boolean,
        default: true,
      },
      ageLimit: {
        type: Number,
        default: 18,
        min: 16,
      },
      deposit: {
        type: Number,
        min: 0,
      },
    },
    location: {
      pickupPoints: [
        {
          type: String,
          trim: true,
        },
      ],
      dropPoints: [
        {
          type: String,
          trim: true,
        },
      ],
    },
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
    totalBookings: {
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
RentalServiceSchema.index({ category: 1, isActive: 1 });
RentalServiceSchema.index({ "capacity.seating": 1 });
RentalServiceSchema.index({ "pricing.fullDay": 1 });
RentalServiceSchema.index({ createdBy: 1 });
RentalServiceSchema.index({ name: "text", brand: "text", model: "text" });

export default mongoose.models.RentalService ||
  mongoose.model("RentalService", RentalServiceSchema);
