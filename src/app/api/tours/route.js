// src/app/api/tours/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/mongodb";

import { authOptions } from "../auth/[...nextauth]/route";
import Tour from "../../../../models/Tour";

// GET - Fetch all tours (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const tourType = searchParams.get("tourType");
    const destination = searchParams.get("destination");
    const difficulty = searchParams.get("difficulty");
    const active = searchParams.get("active");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

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

    if (active !== null && active !== undefined) {
      filter.isActive = active === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter["price.adult"] = {};
      if (minPrice) {
        filter["price.adult"].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.adult"].$lte = parseFloat(maxPrice);
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

    const body = await request.json();
    const {
      title,
      description,
      destination,
      duration,
      tourType,
      difficulty,
      price,
      inclusions,
      exclusions,
      itinerary,
      images,
      maxGroupSize,
      minGroupSize,
      availableDates,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !destination ||
      !tourType ||
      !duration ||
      !price?.adult
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tour = new Tour({
      title,
      description,
      destination,
      duration,
      tourType,
      difficulty: difficulty || "easy",
      price,
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      itinerary: itinerary || [],
      images: images || [],
      maxGroupSize,
      minGroupSize: minGroupSize || 1,
      availableDates: availableDates || [],
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
    return NextResponse.json(
      { success: false, error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
