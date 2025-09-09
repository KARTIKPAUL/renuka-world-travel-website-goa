// models/Hotel.js
import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
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
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^[0-9]{6}$/.test(v);
          },
          message: "Invalid pincode format",
        },
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    hotelType: {
      type: String,
      required: true,
      enum: ["budget", "mid-range", "luxury", "resort", "boutique", "heritage"],
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    roomTypes: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        capacity: {
          type: Number,
          required: true,
          min: 1,
        },
        amenities: [
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
                return (
                  !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v)
                );
              },
              message: "Invalid image URL format",
            },
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
    policies: {
      checkIn: {
        type: String,
        default: "2:00 PM",
        trim: true,
      },
      checkOut: {
        type: String,
        default: "12:00 PM",
        trim: true,
      },
      cancellation: {
        type: String,
        trim: true,
      },
      petPolicy: {
        type: String,
        trim: true,
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[+]?[0-9]{10,15}$/.test(v);
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
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Invalid website URL format",
        },
      },
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
    totalRooms: {
      type: Number,
      min: 1,
    },
    availableRooms: {
      type: Number,
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
HotelSchema.index({ "location.city": 1, isActive: 1 });
HotelSchema.index({ hotelType: 1 });
HotelSchema.index({ starRating: 1 });
HotelSchema.index({ "roomTypes.price": 1 });
HotelSchema.index({ createdBy: 1 });
HotelSchema.index({
  name: "text",
  description: "text",
  "location.city": "text",
});

export default mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
