// src/app/api/auth/set-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(request) {
  try {
    console.log("1. Parsing request body...");
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Fix: Be more explicit about the providers update
    if (!user.providers) {
      user.providers = {};
    }

    if (!user.providers.credentials) {
      user.providers.credentials = {};
    }

    user.providers.credentials.hasPassword = true;

    await user.save();

    return NextResponse.json({ message: "Password set successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error, ${error}` },
      { status: 500 }
    );
  }
}
