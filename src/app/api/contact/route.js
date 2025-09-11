import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import ContactMessage from "../../../../models/ContactMessage";


export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const message = new ContactMessage({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      message: data.message,
    });

    await message.save();

    return NextResponse.json({
      success: true,
      message: "Your query has been received. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit your query. Please try again.",
      },
      { status: 500 }
    );
  }
}
