// src/app/api/tours/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import Tour from "../../../../models/Tour";

// Zod schemas for nested objects
const durationSchema = z.object({
  days: z.number().int().min(1, "Days must be at least 1"),
  nights: z.number().int().min(0, "Nights cannot be negative")
});

const priceSchema = z.object({
  adult: z.number().min(0, "Adult price cannot be negative"),
  child: z.number().min(0, "Child price cannot be negative").optional(),
  infant: z.number().min(0, "Infant price cannot be negative").optional()
});

const itineraryItemSchema = z.object({
  day: z.number().int().min(1, "Day must be at least 1"),
  title: z.string().min(1, "Itinerary title is required").trim(),
  description: z.string().min(1, "Itinerary description is required").trim(),
  activities: z.array(z.string().trim()).optional()
});

// Main tour schema for POST requests
const createTourSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(150, "Title must be less than 150 characters")
    .trim(),
  
  description: z.string()
    .min(1, "Description is required")
    .trim(),
  
  destination: z.string()
    .min(1, "Destination is required")
    .trim(),
  
  duration: durationSchema,
  
  tourType: z.enum([
    "adventure", "cultural", "religious", "beach", "wildlife", 
    "heritage", "honeymoon", "family", "group", "solo"
  ], {
    errorMap: () => ({ message: "Invalid tour type" })
  }),
  
  difficulty: z.enum(["easy", "moderate", "challenging"])
    .default("easy"),
  
  price: priceSchema,
  
  inclusions: z.array(z.string().trim()).optional(),
  
  exclusions: z.array(z.string().trim()).optional(),
  
  itinerary: z.array(itineraryItemSchema).optional(),
  
  images: z.array(
    z.string().url("Invalid image URL").regex(
      /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
      "Image must be a valid image URL (jpg, jpeg, png, webp, gif)"
    )
  ).optional(),
  
  maxGroupSize: z.number().int().min(1, "Max group size must be at least 1").optional(),
  
  minGroupSize: z.number().int().min(1, "Min group size must be at least 1").default(1),
  
  availableDates: z.array(
    z.string().datetime().or(z.date()).transform((val) => new Date(val))
  ).optional(),
  
  isActive: z.boolean().default(true)
});

// Schema for GET request query parameters
const getToursSchema = z.object({
  tourType: z.enum([
    "adventure", "cultural", "religious", "beach", "wildlife", 
    "heritage", "honeymoon", "family", "group", "solo"
  ]).optional(),
  
  destination: z.string().trim().min(1).optional(),
  
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  
  active: z.enum(["true", "false"]).optional(),
  
  search: z.string().trim().min(1).optional(),
  
  minPrice: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform(val => parseFloat(val))
    .optional(),
    
  maxPrice: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform(val => parseFloat(val))
    .optional(),
    
  minDays: z.string()
    .regex(/^\d+$/, "Invalid days format")
    .transform(val => parseInt(val))
    .optional(),
    
  maxDays: z.string()
    .regex(/^\d+$/, "Invalid days format")
    .transform(val => parseInt(val))
    .optional()
});

// GET - Fetch all tours (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryParams = {
      tourType: searchParams.get("tourType"),
      destination: searchParams.get("destination"),
      difficulty: searchParams.get("difficulty"),
      active: searchParams.get("active"),
      search: searchParams.get("search"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minDays: searchParams.get("minDays"),
      maxDays: searchParams.get("maxDays")
    };

    // Validate query parameters
    const validationResult = getToursSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid query parameters",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { tourType, destination, difficulty, active, search, minPrice, maxPrice, minDays, maxDays } = validationResult.data;

    // Build filter object
    let filter = {};

    if (tourType) {
      filter.tourType = tourType;
    }

    if (destination) {
      filter.destination = new RegExp(destination, "i");
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["price.adult"] = {};
      if (minPrice !== undefined) {
        filter["price.adult"].$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter["price.adult"].$lte = maxPrice;
      }
    }

    // Duration filtering
    if (minDays !== undefined || maxDays !== undefined) {
      filter["duration.days"] = {};
      if (minDays !== undefined) {
        filter["duration.days"].$gte = minDays;
      }
      if (maxDays !== undefined) {
        filter["duration.days"].$lte = maxDays;
      }
    }

    const tours = await Tour.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Tours GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST - Create new tour (Admin only)
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
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validationResult = createTourSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Additional business logic validation
    if (validatedData.minGroupSize && validatedData.maxGroupSize && 
        validatedData.minGroupSize > validatedData.maxGroupSize) {
      return NextResponse.json(
        { success: false, error: "Minimum group size cannot exceed maximum group size" },
        { status: 400 }
      );
    }

    // Validate itinerary days sequence
    if (validatedData.itinerary && validatedData.itinerary.length > 0) {
      const maxDay = Math.max(...validatedData.itinerary.map(item => item.day));
      if (maxDay > validatedData.duration.days) {
        return NextResponse.json(
          { success: false, error: "Itinerary days cannot exceed tour duration" },
          { status: 400 }
        );
      }
    }

    const tour = new Tour({
      ...validatedData,
      createdBy: session.user.id,
    });

    await tour.save();

    // Populate created tour
    await tour.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: tour,
        message: "Tour created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Tour POST error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Tour with similar details already exists" },
        { status: 409 }
      );
    }

    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database validation error",
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create tour" },
      { status: 500 }
    );
  }
}