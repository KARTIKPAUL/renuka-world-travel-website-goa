// src/app/api/rental-services/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb";
import RentalService from "../../../../models/RentalService";
import { authOptions } from "../auth/[...nextauth]/route";

// Zod schema for POST request validation
const createRentalServiceSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  
  category: z.enum([
    "car", "bike", "scooter", "bus", "tempo-traveller", 
    "luxury-car", "suv", "sedan"
  ], {
    errorMap: () => ({ message: "Invalid category" })
  }),
  
  brand: z.string().trim().optional(),
  
  model: z.string()
    .min(1, "Model is required")
    .trim(),
  
  year: z.number()
    .int()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .optional(),
  
  capacity: z.object({
    seating: z.number()
      .int()
      .min(1, "Seating capacity must be at least 1"),
    luggage: z.string().trim().optional()
  }),
  
  features: z.array(z.string().trim()).optional(),
  
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"])
    .default("petrol"),
  
  transmission: z.enum(["manual", "automatic"])
    .default("manual"),
  
  pricing: z.object({
    hourly: z.number().min(0, "Price cannot be negative").optional(),
    halfDay: z.number().min(0, "Price cannot be negative").optional(),
    fullDay: z.number().min(0, "Price cannot be negative").optional(),
    weekly: z.number().min(0, "Price cannot be negative").optional(),
    monthly: z.number().min(0, "Price cannot be negative").optional(),
  }).optional(),
  
  availability: z.array(z.object({
    date: z.string().datetime().or(z.date()),
    available: z.boolean().default(true)
  })).optional(),
  
  images: z.array(
    z.string().url("Invalid image URL").regex(
      /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
      "Image must be a valid image URL (jpg, jpeg, png, webp, gif)"
    )
  ).optional(),
  
  documents: z.object({
    licenseRequired: z.boolean().default(true),
    ageLimit: z.number().int().min(16, "Age limit must be at least 16").default(18),
    deposit: z.number().min(0, "Deposit cannot be negative").optional()
  }).optional(),
  
  location: z.object({
    pickupPoints: z.array(z.string().trim()).optional(),
    dropPoints: z.array(z.string().trim()).optional()
  }).optional(),
  
  isActive: z.boolean().default(true)
});

// Zod schema for GET request query params validation
const getRentalServicesSchema = z.object({
  category: z.enum([
    "car", "bike", "scooter", "bus", "tempo-traveller", 
    "luxury-car", "suv", "sedan"
  ]).optional(),
  active: z.enum(["true", "false"]).optional(),
  search: z.string().trim().min(1).optional()
});

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const queryParams = {
      category: searchParams.get("category"),
      active: searchParams.get("active"),
      search: searchParams.get("search")
    };

    // Validate query parameters
    const validationResult = getRentalServicesSchema.safeParse(queryParams);
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

    const { category, active, search } = validationResult.data;

    let filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === "true";
    if (search) filter.$text = { $search: search };

    const rentals = await RentalService.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: rentals 
    });
  } catch (error) {
    console.error("GET /api/rental-services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rental services" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
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
    const validationResult = createRentalServiceSchema.safeParse(body);
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

    const rental = new RentalService({
      ...validatedData,
      createdBy: session.user.id,
    });

    await rental.save();
    await rental.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: rental,
        message: "Rental service created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/rental-services error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Rental service already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create rental service" },
      { status: 500 }
    );
  }
}