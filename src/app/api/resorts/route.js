// src/app/api/resorts/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import Resort from "../../../../models/Resort";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "../../../../lib/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const resortType = searchParams.get("resortType") || "";
    const city = searchParams.get("city") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const starRating = searchParams.get("starRating");
    const featured = searchParams.get("featured") === "true";

    // Build filter object
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    if (resortType) {
      filter.resortType = resortType;
    }

    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }

    if (starRating) {
      filter.starRating = parseInt(starRating);
    }

    if (featured) {
      filter.isFeatured = true;
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get resorts with pagination
    // in GET list
    const resorts = await Resort.find(filter)
      .populate("createdBy", "name email") // ← populate user name & email

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Resort.countDocuments(filter);

    // Filter by price if specified (after fetching to use virtual minPrice)
    let filteredResorts = resorts;
    if (minPrice || maxPrice) {
      filteredResorts = resorts.filter((resort) => {
        if (!resort.accommodation || resort.accommodation.length === 0)
          return false;
        const minResortPrice = Math.min(
          ...resort.accommodation.map((acc) => acc.price)
        );

        if (minPrice && minResortPrice < parseFloat(minPrice)) return false;
        if (maxPrice && minResortPrice > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredResorts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: skip + filteredResorts.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching resorts:", error);
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
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();
    data.createdBy = session.user.id;

    // Create new resort
    const resort = new Resort(data);
    const savedResort = await resort.save();

    return NextResponse.json({
      success: true,
      data: savedResort,
      message: "Resort created successfully",
    });
  } catch (error) {
    console.error("Error creating resort:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create resort" },
      { status: 500 }
    );
  }
}
