// src/models/Resort.js
import mongoose from "mongoose";

const ResortSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Resort name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    },
    resortType: {
      type: String,
      enum: [
        "beach",
        "mountain",
        "wildlife",
        "luxury",
        "eco",
        "spa",
        "adventure",
        "family",
      ],
      required: [true, "Resort type is required"],
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
    accommodation: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        capacity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
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
            trim: true,
          },
        ],
        available: {
          type: Number,
          default: 1,
          min: 0,
        },
      },
    ],
    activities: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          min: 0,
        },
        duration: {
          type: String,
          trim: true,
        },
        included: {
          type: Boolean,
          default: false,
        },
      },
    ],
    dining: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        cuisine: {
          type: String,
          trim: true,
        },
        mealPlans: [
          {
            type: String,
            enum: [
              "breakfast",
              "lunch",
              "dinner",
              "all-inclusive",
              "continental",
            ],
          },
        ],
        price: {
          type: Number,
          min: 0,
        },
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    policies: {
      checkIn: {
        type: String,
        default: "3:00 PM",
        trim: true,
      },
      checkOut: {
        type: String,
        default: "11:00 AM",
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
      childPolicy: {
        type: String,
        trim: true,
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    seasons: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        startMonth: {
          type: Number,
          min: 1,
          max: 12,
          required: true,
        },
        endMonth: {
          type: Number,
          min: 1,
          max: 12,
          required: true,
        },
        priceMultiplier: {
          type: Number,
          default: 1,
          min: 0.5,
          max: 3,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    totalRooms: {
      type: Number,
      min: 1,
    },
    availableRooms: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
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

// Index for better query performance
ResortSchema.index({ "location.city": 1 });
ResortSchema.index({ resortType: 1 });
ResortSchema.index({ starRating: 1 });
ResortSchema.index({ isActive: 1 });
ResortSchema.index({ isFeatured: 1 });

// Virtual for minimum price
ResortSchema.virtual("minPrice").get(function () {
  if (this.accommodation && this.accommodation.length > 0) {
    return Math.min(...this.accommodation.map((acc) => acc.price));
  }
  return 0;
});

// Ensure virtual fields are serialized
ResortSchema.set("toJSON", { virtuals: true });
ResortSchema.set("toObject", { virtuals: true });

export default mongoose.models.Resort || mongoose.model("Resort", ResortSchema);
