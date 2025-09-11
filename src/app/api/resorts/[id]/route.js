import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "../../../../../lib/mongodb";
import Resort from "../../../../../models/Resort";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, context) {
  try {
    await connectDB();
    const { params } = context;
    const { id } = await params;

    const resort = await Resort.findById(id)
      .populate("createdBy", "name email")
      //.populate("reviews")
      .lean();
    if (!resort) {
      return NextResponse.json({ success:false, error:"Resort not found" }, { status:404 });
    }
    return NextResponse.json({ success:true, data:resort });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success:false, error:"Failed to fetch resort" }, { status:500 });
  }
}

export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role!=="admin") {
      return NextResponse.json({ success:false, error:"Unauthorized" }, { status:403 });
    }
    await connectDB();
    const { params } = context;
    const { id } = await params;
    const body = await request.json();
    const updated = await Resort.findByIdAndUpdate(id, body, {
      new:true,
      runValidators:true
    })
      .populate("createdBy","name email")
      //.populate("reviews");
    if (!updated) {
      return NextResponse.json({ success:false, error:"Resort not found" }, { status:404 });
    }
    return NextResponse.json({ success:true, data:updated, message:"Resort updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success:false, error:"Update failed" }, { status:500 });
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role!=="admin") {
      return NextResponse.json({ success:false, error:"Unauthorized" }, { status:403 });
    }
    await connectDB();
    const { params } = context;
    const { id } = await params;
    const deleted = await Resort.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success:false, error:"Resort not found" }, { status:404 });
    }
    return NextResponse.json({ success:true, message:"Resort deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success:false, error:"Deletion failed" }, { status:500 });
  }
}
