// src/app/api/services/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/mongodb";

import { authOptions } from "../auth/[...nextauth]/route";
import Service from "../../../../models/Service";

// GET - Fetch all services (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (active !== null && active !== undefined) {
      filter.isActive = active === "true";
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

    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      priceType,
      features,
      images,
      contactInfo,
    } = body;

    // Validation
    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = new Service({
      name,
      description,
      category,
      price,
      priceType,
      features: features || [],
      images: images || [],
      contactInfo: contactInfo || {},
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
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
