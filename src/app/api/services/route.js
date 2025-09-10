// src/app/api/services/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import Service from "../../../../models/Service";

// Validation schemas
const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  
  category: z.enum([
    "travel-planning",
    "airport-transfer", 
    "guide-services",
    "insurance",
    "currency-exchange",
    "other"
  ], {
    errorMap: () => ({ message: "Invalid category selected" })
  }),
  
  price: z
    .number()
    .min(0, "Price must be non-negative")
    .optional(),
  
  priceType: z
    .enum([
      "fixed",
      "per-person", 
      "per-group",
      "hourly",
      "daily",
      "consultation"
    ])
    .default("fixed")
    .optional(),
  
  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .optional()
    .default([]),
  
  images: z
    .array(
      z.string().url("Invalid image URL").regex(
        /\.(jpg|jpeg|png|webp|gif)$/i,
        "Image must be a valid image format (jpg, jpeg, png, webp, gif)"
      )
    )
    .optional()
    .default([]),
  
  contactInfo: z
    .object({
      phone: z
        .string()
        .trim()
        .regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number format")
        .optional(),
      
      email: z
        .string()
        .trim()
        .email("Invalid email format")
        .toLowerCase()
        .optional(),
      
      whatsapp: z
        .string()
        .trim()
        .regex(/^[+]?[0-9]{10,15}$/, "Invalid WhatsApp number format")
        .optional()
    })
    .optional()
    .default({})
});

const queryParamsSchema = z.object({
  category: z
    .enum([
      "travel-planning",
      "airport-transfer",
      "guide-services", 
      "insurance",
      "currency-exchange",
      "other"
    ])
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
});

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

// GET - Fetch all services (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const queryValidation = queryParamsSchema.safeParse({
      category: searchParams.get("category"),
      active: searchParams.get("active"),
      search: searchParams.get("search")
    });

    if (!queryValidation.success) {
      return handleValidationError(queryValidation.error);
    }

    const { category, active, search } = queryValidation.data;

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.isActive = active;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const services = await Service.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create new service (Admin only)
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
    const validation = createServiceSchema.safeParse(body);
    
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const validatedData = validation.data;

    // Additional business logic validation
    if (validatedData.price && !validatedData.priceType) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Price type is required when price is specified" 
        },
        { status: 400 }
      );
    }

    const service = new Service({
      ...validatedData,
      createdBy: session.user.id,
    });

    await service.save();

    // Populate created service
    await service.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: service,
        message: "Service created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Service POST error:", error);
    
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
        { success: false, error: "Service with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}