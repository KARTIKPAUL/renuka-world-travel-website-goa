// models/Service.js
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "travel-planning",
        "airport-transfer",
        "guide-services",
        "insurance",
        "currency-exchange",
        "other",
      ],
    },
    price: {
      type: Number,
      min: 0,
    },
    priceType: {
      type: String,
      enum: [
        "fixed",
        "per-person",
        "per-group",
        "hourly",
        "daily",
        "consultation",
      ],
      default: "fixed",
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
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
    contactInfo: {
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^[+]?[0-9]{10,15}$/.test(v);
          },
          message: "Invalid phone number format",
        },
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Invalid email format",
        },
      },
      whatsapp: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^[+]?[0-9]{10,15}$/.test(v);
          },
          message: "Invalid WhatsApp number format",
        },
      },
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
ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ createdBy: 1 });
ServiceSchema.index({ name: "text", description: "text" });

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
