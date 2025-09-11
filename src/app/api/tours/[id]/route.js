// src/app/api/tours/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../../lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import Tour from "../../../../../models/Tour";

// GET - Fetch single tour by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const tour = await Tour.findById(params.id)
      .populate("createdBy", "name email")
      //.populate("reviews")
      .lean();

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tour,
    });
  } catch (error) {
    console.error("Tour GET by ID error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT - Update tour by ID (Admin only)
export async function PUT(request, { params }) {
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

    const tour = await Tour.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      //.populate("reviews");

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tour,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.error("Tour PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tour by ID (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const tour = await Tour.findByIdAndDelete(params.id);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Tour DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}