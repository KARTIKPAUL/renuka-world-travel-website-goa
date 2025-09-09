// src/app/api/hotels/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";



import connectDB from "../../../../lib/mongodb";

import { authOptions } from "../auth/[...nextauth]/route";
import Hotel from "../../../../models/Hotel";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const hotelType = searchParams.get("hotelType");
    const city = searchParams.get("city");
    const starRating = searchParams.get("starRating");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    let filter = {};

    if (hotelType) filter.hotelType = hotelType;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (starRating) filter.starRating = parseInt(starRating);
    if (active !== null) filter.isActive = active === "true";
    if (search) filter.$text = { $search: search };

    const hotels = await Hotel.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: hotels });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotels" },
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
      !body.description ||
      !body.location?.address ||
      !body.location?.city ||
      !body.hotelType ||
      !body.contact?.phone
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hotel = new Hotel({
      ...body,
      createdBy: session.user.id,
    });

    await hotel.save();
    await hotel.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: hotel,
        message: "Hotel created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
