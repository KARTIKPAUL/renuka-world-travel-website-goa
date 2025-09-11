// src/app/api/newsletter/route.js
import { NextResponse } from "next/server";

import connectDB from "../../../../lib/mongodb";
import NewsletterSubscriber from "../../../../models/NewsletterSubscriber";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "This email is already subscribed to our newsletter.",
          },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          message: "Welcome back! You've been resubscribed to our newsletter.",
        });
      }
    }

    // Create new subscription
    const newSubscriber = new NewsletterSubscriber({
      email: email.trim().toLowerCase(),
      source: "website",
    });

    await newSubscriber.save();

    return NextResponse.json({
      success: true,
      message:
        "Thank you for subscribing! You'll receive our latest updates and offers.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already subscribed to our newsletter.",
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: errorMessages[0] || "Invalid email format.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// GET route for admin to retrieve subscribers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const isActive = searchParams.get("active");

    await connectDB();

    // Build filter
    const filter = {};
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get subscribers with pagination
    const subscribers = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalCount = await Newsletter.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasMore: skip + subscribers.length < totalCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscribers.",
      },
      { status: 500 }
    );
  }
}
