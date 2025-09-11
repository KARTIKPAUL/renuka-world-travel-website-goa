import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "../../../../../lib/mongodb";
import RentalService from "../../../../../models/RentalService";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, context) {
  await connectDB();
  const { params } = context;
  const { id } = await params;
  const rental = await RentalService.findById(id)
    .populate("createdBy", "name email")
    .lean();
  if (!rental) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: rental });
}

export async function PUT(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role === "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  await connectDB();
  const { params } = context;
  const { id } = await params;
  const body = await request.json();
  const updated = await RentalService.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");
  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role === "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
  await connectDB();
  const { params } = context;
  const { id } = await params;
  const deleted = await RentalService.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
