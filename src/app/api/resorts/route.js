// src/app/api/resorts/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb";
import Resort from "../../../../models/Resort";
import { authOptions } from "../auth/[...nextauth]/route";

// Zod schemas for nested objects
const locationSchema = z.object({
  address: z.string().min(1, "Address is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  state: z.string().min(1, "State is required").trim(),
  pincode: z.string().trim().optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional()
  }).optional()
});

const accommodationSchema = z.object({
  type: z.string().min(1, "Accommodation type is required").trim(),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  amenities: z.array(z.string().trim()).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  available: z.number().int().min(0, "Available units cannot be negative").default(1)
});

const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required").trim(),
  description: z.string().trim().optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  duration: z.string().trim().optional(),
  included: z.boolean().default(false)
});

const diningSchema = z.object({
  name: z.string().min(1, "Dining name is required").trim(),
  cuisine: z.string().trim().optional(),
  mealPlans: z.array(z.enum([
    "breakfast", "lunch", "dinner", "all-inclusive", "continental"
  ])).optional(),
  price: z.number().min(0, "Price cannot be negative").optional()
});

const policiesSchema = z.object({
  checkIn: z.string().trim().default("3:00 PM"),
  checkOut: z.string().trim().default("11:00 AM"),
  cancellation: z.string().trim().optional(),
  petPolicy: z.string().trim().optional(),
  childPolicy: z.string().trim().optional()
});

const contactSchema = z.object({
  phone: z.string().min(1, "Phone number is required").trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase().optional(),
  website: z.string().url("Invalid website URL").trim().optional()
});

const seasonSchema = z.object({
  name: z.string().min(1, "Season name is required").trim(),
  startMonth: z.number().int().min(1).max(12),
  endMonth: z.number().int().min(1).max(12),
  priceMultiplier: z.number().min(0.5).max(3).default(1),
  description: z.string().trim().optional()
});

// Main resort schema for POST requests
const createResortSchema = z.object({
  name: z.string().min(1, "Resort name is required").max(150, "Name too long").trim(),
  description: z.string().min(1, "Description is required").trim(),
  location: locationSchema,
  resortType: z.enum([
    "beach", "mountain", "wildlife", "luxury", "eco", "spa", "adventure", "family"
  ], {
    errorMap: () => ({ message: "Invalid resort type" })
  }),
  starRating: z.number().int().min(1).max(5).default(3),
  amenities: z.array(z.string().trim()).optional(),
  accommodation: z.array(accommodationSchema).min(1, "At least one accommodation type required"),
  activities: z.array(activitySchema).optional(),
  dining: z.array(diningSchema).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  policies: policiesSchema.optional(),
  contact: contactSchema,
  seasons: z.array(seasonSchema).optional(),
  totalRooms: z.number().int().min(1).optional(),
  availableRooms: z.number().int().min(0).optional(),
  tags: z.array(z.string().trim()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

// Schema for GET request query parameters
const getResortsSchema = z.object({
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  resortType: z.enum([
    "beach", "mountain", "wildlife", "luxury", "eco", "spa", "adventure", "family"
  ]).optional(),
  starRating: z.string().regex(/^[1-5]$/, "Star rating must be 1-5").optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
  active: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().trim().min(1).optional()
});

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const queryParams = {
      city: searchParams.get("city"),
      state: searchParams.get("state"),
      resortType: searchParams.get("resortType"),
      starRating: searchParams.get("starRating"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      active: searchParams.get("active"),
      featured: searchParams.get("featured"),
      search: searchParams.get("search")
    };

    // Validate query parameters
    const validationResult = getResortsSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid query parameters",
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { city, state, resortType, starRating, minPrice, maxPrice, active, featured, search } = validationResult.data;

    let filter = {};
    
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (state) filter["location.state"] = new RegExp(state, "i");
    if (resortType) filter.resortType = resortType;
    if (starRating) filter.starRating = parseInt(starRating);
    if (active !== undefined) filter.isActive = active === "true";
    if (featured !== undefined) filter.isFeatured = featured === "true";
    if (search) filter.$text = { $search: search };

    // Price filtering based on minimum accommodation price
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      
      // This will require aggregation to filter by min accommodation price
      filter.accommodation = {
        $elemMatch: { price: priceFilter }
      };
    }

    const resorts = await Resort.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: resorts 
    });
  } catch (error) {
    console.error("GET /api/resorts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resorts" },
      { status: 500 }
    );
  }
}

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

    // Transform coordinate strings to numbers if provided
    if (body.location?.coordinates) {
      const coords = body.location.coordinates;
      if (coords.latitude !== null && coords.latitude !== undefined && coords.latitude !== "") {
        coords.latitude = parseFloat(coords.latitude);
      } else {
        coords.latitude = null;
      }
      if (coords.longitude !== null && coords.longitude !== undefined && coords.longitude !== "") {
        coords.longitude = parseFloat(coords.longitude);
      } else {
        coords.longitude = null;
      }
    }

    // Validate request body with Zod
    const validationResult = createResortSchema.safeParse(body);
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
    if (validatedData.totalRooms && validatedData.availableRooms && 
        validatedData.availableRooms > validatedData.totalRooms) {
      return NextResponse.json(
        { success: false, error: "Available rooms cannot exceed total rooms" },
        { status: 400 }
      );
    }

    const resort = new Resort({
      ...validatedData,
      createdBy: session.user.id,
    });

    await resort.save();
    await resort.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: resort,
        message: "Resort created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/resorts error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Resort with this name already exists" },
        { status: 409 }
      );
    }

    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation error",
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create resort" },
      { status: 500 }
    );
  }
}