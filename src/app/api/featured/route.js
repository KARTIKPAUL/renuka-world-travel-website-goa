// src/app/api/featured/route.js

import { getFeaturedItemsServer } from "@/utils/featuredItemsHelper";


export async function GET() {
  try {
    const featuredItems = await getFeaturedItemsServer();

    return Response.json({
      success: true,
      data: featuredItems,
    });
  } catch (error) {
    console.error("Error in featured API:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch featured items",
      },
      { status: 500 }
    );
  }
}
