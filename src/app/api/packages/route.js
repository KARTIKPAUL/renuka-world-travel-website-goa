// src/app/api/packages/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../../lib/mongodb";

import { authOptions } from "../auth/[...nextauth]/route";
import Package from "../../../../models/Package";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const packageType = searchParams.get("packageType");
    const destination = searchParams.get("destination");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    let filter = {};

    if (packageType) filter.packageType = packageType;
    if (destination)
      filter.destinations = { $in: [new RegExp(destination, "i")] };
    if (active !== null) filter.isActive = active === "true";
    if (search) filter.$text = { $search: search };

    const packages = await Package.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
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
      !body.packageType ||
      !body.destinations?.length
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pack = new Package({
      ...body,
      createdBy: session.user.id,
    });

    await pack.save();
    await pack.populate("createdBy", "name email");

    return NextResponse.json(
      {
        success: true,
        data: pack,
        message: "Package created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create package" },
      { status: 500 }
    );
  }
}
