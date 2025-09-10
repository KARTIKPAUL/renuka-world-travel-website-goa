// src/app/api/packages/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import Package from "../../../../models/Package";

// Validation schemas
const durationSchema = z.object({
  days: z
    .number()
    .int("Days must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration cannot exceed 365 days"),
  
  nights: z
    .number()
    .int("Nights must be a whole number")
    .min(0, "Nights cannot be negative")
    .max(364, "Nights cannot exceed 364")
}).refine(
  (data) => data.nights <= data.days,
  {
    message: "Nights cannot exceed days",
    path: ["nights"]
  }
).refine(
  (data) => data.nights >= data.days - 1,
  {
    message: "Nights should typically be days minus 1 or equal to days",
    path: ["nights"]
  }
);

const priceSchema = z.object({
  basePrice: z
    .number()
    .min(0, "Base price must be non-negative")
    .max(10000000, "Base price seems unreasonably high"),
  
  pricePerPerson: z
    .number()
    .min(0, "Price per person must be non-negative")
    .max(1000000, "Price per person seems unreasonably high")
    .optional()
    .nullable(),
  
  childPrice: z
    .number()
    .min(0, "Child price must be non-negative")
    .max(1000000, "Child price seems unreasonably high")
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Child price should be less than or equal to adult price if both exist
    if (data.childPrice && data.pricePerPerson) {
      return data.childPrice <= data.pricePerPerson;
    }
    return true;
  },
  {
    message: "Child price should not exceed adult price per person",
    path: ["childPrice"]
  }
);

const accommodationSchema = z.object({
  type: z
    .enum(["hotel", "resort", "homestay", "guesthouse", "luxury"])
    .default("hotel"),
  
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional()
    .nullable(),
  
  meals: z
    .enum(["breakfast", "half-board", "full-board", "all-inclusive"])
    .default("breakfast")
});

const transportationSchema = z.object({
  type: z
    .enum(["flight", "train", "bus", "car", "mixed"])
    .default("car"),
  
  included: z
    .boolean()
    .default(false)
});

const createPackageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Package name is required")
    .max(150, "Package name must be less than 150 characters"),
  
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(3000, "Description must be less than 3000 characters"),
  
  packageType: z.enum([
    "honeymoon",
    "family", 
    "adventure",
    "luxury",
    "budget",
    "group",
    "custom"
  ], {
    errorMap: () => ({ message: "Invalid package type selected" })
  }),
  
  destinations: z
    .array(z.string().trim().min(1, "Destination cannot be empty"))
    .min(1, "At least one destination is required")
    .max(20, "Too many destinations")
    .transform(arr => arr.filter(item => item.length > 0)),
  
  duration: durationSchema,
  
  price: priceSchema,
  
  inclusions: z
    .array(z.string().trim().min(1, "Inclusion cannot be empty"))
    .default([])
    .transform(arr => arr.filter(item => item.length > 0)),
  
  exclusions: z
    .array(z.string().trim().min(1, "Exclusion cannot be empty"))
    .default([])
    .transform(arr => arr.filter(item => item.length > 0)),
  
  accommodation: accommodationSchema.optional().default({}),
  
  transportation: transportationSchema.optional().default({}),
  
  activities: z
    .array(z.string().trim().min(1, "Activity cannot be empty"))
    .default([])
    .transform(arr => arr.filter(item => item.length > 0)),
  
  images: z
    .array(
      z.string()
        .url("Invalid image URL")
        .regex(/\.(jpg|jpeg|png|webp|gif)$/i, "Image must be a valid format")
    )
    .default([])
    .transform(arr => arr.filter(item => item.length > 0)),
  
  validFrom: z
    .string()
    .datetime("Invalid date format")
    .transform(str => new Date(str))
    .optional()
    .nullable(),
  
  validUntil: z
    .string()
    .datetime("Invalid date format")
    .transform(str => new Date(str))
    .optional()
    .nullable(),
  
  maxBookings: z
    .number()
    .int("Max bookings must be a whole number")
    .min(1, "Must allow at least 1 booking")
    .max(10000, "Max bookings seems unreasonably high")
    .optional()
    .nullable()
}).refine(
  (data) => {
    // Validate date range if both dates are provided
    if (data.validFrom && data.validUntil) {
      return data.validFrom < data.validUntil;
    }
    return true;
  },
  {
    message: "Valid from date must be before valid until date",
    path: ["validUntil"]
  }
).refine(
  (data) => {
    // Valid from should not be in the past (more than 1 day ago)
    if (data.validFrom) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return data.validFrom >= oneDayAgo;
    }
    return true;
  },
  {
    message: "Valid from date cannot be in the past",
    path: ["validFrom"]
  }
);

const queryParamsSchema = z.object({
  packageType: z
    .enum(["honeymoon", "family", "adventure", "luxury", "budget", "group", "custom"])
    .optional(),
  
  destination: z
    .string()
    .trim()
    .min(1)
    .optional(),
  
  minPrice: z
    .string()
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val >= 0, "Invalid minimum price")
    .optional(),
  
  maxPrice: z
    .string()
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val >= 0, "Invalid maximum price")
    .optional(),
  
  minDuration: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val >= 1, "Invalid minimum duration")
    .optional(),
  
  maxDuration: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val >= 1, "Invalid maximum duration")
    .optional(),
  
  active: z
    .string()
    .transform(val => val === "true")
    .optional(),
  
  search: z
    .string()
    .trim()
    .min(1)
    .optional()
}).refine(
  (data) => {
    // Validate price range
    if (data.minPrice && data.maxPrice) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: "Minimum price cannot exceed maximum price",
    path: ["maxPrice"]
  }
).refine(
  (data) => {
    // Validate duration range
    if (data.minDuration && data.maxDuration) {
      return data.minDuration <= data.maxDuration;
    }
    return true;
  },
  {
    message: "Minimum duration cannot exceed maximum duration",
    path: ["maxDuration"]
  }
);

// Helper function to handle validation errors
function handleValidationError(error) {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  
  return NextResponse.json(
    { 
      success: false, 
      error: "Validation failed",
      details: errors
    },
    { status: 400 }
  );
}

// GET - Fetch all packages (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const queryValidation = queryParamsSchema.safeParse({
      packageType: searchParams.get("packageType"),
      destination: searchParams.get("destination"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minDuration: searchParams.get("minDuration"),
      maxDuration: searchParams.get("maxDuration"),
      active: searchParams.get("active"),
      search: searchParams.get("search")
    });

    if (!queryValidation.success) {
      return handleValidationError(queryValidation.error);
    }

    const { 
      packageType, 
      destination, 
      minPrice, 
      maxPrice, 
      minDuration, 
      maxDuration, 
      active, 
      search 
    } = queryValidation.data;

    // Build filter object
    let filter = {};

    if (packageType) {
      filter.packageType = packageType;
    }

    if (destination) {
      filter.destinations = { $regex: destination, $options: "i" };
    }

    if (active !== undefined) {
      filter.isActive = active;
    }

    // Price filtering
    if (minPrice || maxPrice) {
      let priceFilter = {};
      if (minPrice) priceFilter.$gte = minPrice;
      if (maxPrice) priceFilter.$lte = maxPrice;
      
      filter["price.basePrice"] = priceFilter;
    }

    // Duration filtering
    if (minDuration || maxDuration) {
      let durationFilter = {};
      if (minDuration) durationFilter.$gte = minDuration;
      if (maxDuration) durationFilter.$lte = maxDuration;
      
      filter["duration.days"] = durationFilter;
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Only show packages that are currently valid or have no expiry
    const now = new Date();
    filter.$or = [
      { validUntil: { $gte: now } },
      { validUntil: null },
      { validUntil: { $exists: false } }
    ];

    const packages = await Package.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Packages GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST - Create new package (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Validate request body
    const validation = createPackageSchema.safeParse(body);
    
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const validatedData = validation.data;

    // Additional business logic validation
    if (validatedData.maxBookings && validatedData.maxBookings > 0) {
      // Ensure reasonable booking limits based on package type
      const typeBookingLimits = {
        luxury: 50,
        honeymoon: 100,
        family: 500,
        adventure: 200,
        budget: 1000,
        group: 100,
        custom: 200
      };
      
      const maxAllowed = typeBookingLimits[validatedData.packageType] || 500;
      if (validatedData.maxBookings > maxAllowed) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Maximum bookings for ${validatedData.packageType} packages should not exceed ${maxAllowed}` 
          },
          { status: 400 }
        );
      }
    }

    // Check for duplicate package name
    const existingPackage = await Package.findOne({
      name: { $regex: `^${validatedData.name}$`, $options: "i" },
      isActive: true
    });

    if (existingPackage) {
      return NextResponse.json(
        { success: false, error: "A package with this name already exists" },
        { status: 409 }
      );
    }

    // Validate accommodation rating consistency
    if (validatedData.accommodation.type === 'luxury' && 
        validatedData.accommodation.rating && 
        validatedData.accommodation.rating < 4) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Luxury accommodation should have a rating of 4 or 5 stars" 
        },
        { status: 400 }
      );
    }

    const packageData = new Package({
      ...validatedData,
      createdBy: session.user.id,
    });

    await packageData.save();

    // Populate created package
    await packageData.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: packageData,
        message: "Package created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Package POST error:", error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return NextResponse.json(
        {
          success: false,
          error: "Database validation failed",
          details: errors
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Package with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create package" },
      { status: 500 }
    );
  }
}