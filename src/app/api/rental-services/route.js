// src/app/api/rental-services/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "../../../../lib/mongodb";
import RentalService from "../../../../models/RentalService";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    let filter = {};

    if (category) filter.category = category;
    if (active !== null) filter.isActive = active === "true";
    if (search) filter.$text = { $search: search };

    const rentals = await RentalService.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: rentals });
  } catch (error) {
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
    const body = await request.json();

    if (
      !body.name ||
      !body.category ||
      !body.model ||
      !body.capacity?.seating
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rental = new RentalService({
      ...body,
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
    return NextResponse.json(
      { success: false, error: "Failed to create rental service" },
      { status: 500 }
    );
  }
}