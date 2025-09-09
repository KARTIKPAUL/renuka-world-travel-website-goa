// src/utils/featuredItemsHelper.js

/**
 * Helper function to get featured items from each category
 * Falls back to the most recent item if no featured items exist
 */

export async function getFeaturedItems() {
  try {
    // Fetch all data from APIs including resorts
    const [
      servicesRes,
      toursRes,
      packagesRes,
      rentalsRes,
      hotelsRes,
      resortsRes,
    ] = await Promise.all([
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/services`
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/tours`
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/packages`
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/rental-services`
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/hotels`
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/resorts`
      ),
    ]);

    const [services, tours, packages, rentals, hotels, resorts] =
      await Promise.all([
        servicesRes.json(),
        toursRes.json(),
        packagesRes.json(),
        rentalsRes.json(),
        hotelsRes.json(),
        resortsRes.json(),
      ]);

    // Helper function to get featured or first active item
    const getFeaturedOrFirst = (items) => {
      if (!items || !Array.isArray(items)) return null;

      // First, try to find a featured item
      const featured = items.find(
        (item) => item.isFeatured && item.isActive !== false
      );
      if (featured) return featured;

      // If no featured item, get the first active item
      const active = items.find((item) => item.isActive !== false);
      if (active) return active;

      // If no active items, just get the first item
      return items[0] || null;
    };

    return {
      service: getFeaturedOrFirst(services.data),
      tour: getFeaturedOrFirst(tours.data),
      package: getFeaturedOrFirst(packages.data),
      rental: getFeaturedOrFirst(rentals.data),
      hotel: getFeaturedOrFirst(hotels.data),
      resort: getFeaturedOrFirst(resorts.data),
    };
  } catch (error) {
    console.error("Error fetching featured items:", error);
    return {
      service: null,
      tour: null,
      package: null,
      rental: null,
      hotel: null,
      resort: null,
    };
  }
}
/**
 * Server-side version for use in API routes or server components
 */
export async function getFeaturedItemsServer() {
  try {
    const connectDB = (await import("../../lib/mongodb")).default;

    await connectDB();

    // Import models
    const Service = (await import("../../models/Service")).default;
    const Tour = (await import("../../models/Tour")).default;
    const Package = (await import("../../models/Package")).default;
    const RentalService = (await import("../../models/RentalService")).default;
    const Hotel = (await import("../../models/Hotel")).default;
    const Resort = (await import("../../models/Resort")).default;

    // Helper function to get featured or first item from database
    const getFeaturedOrFirst = async (Model) => {
      try {
        // Try to find a featured item first
        let item = await Model.findOne({
          isFeatured: true,
          isActive: { $ne: false },
        }).lean();

        if (item) return JSON.parse(JSON.stringify(item));

        // If no featured item, get the first active item
        item = await Model.findOne({
          isActive: { $ne: false },
        })
          .sort({ createdAt: -1 })
          .lean();

        if (item) return JSON.parse(JSON.stringify(item));

        // If no active items, get any item
        item = await Model.findOne().sort({ createdAt: -1 }).lean();

        return item ? JSON.parse(JSON.stringify(item)) : null;
      } catch (error) {
        console.error(`Error fetching from ${Model.modelName}:`, error);
        return null;
      }
    };

    const [service, tour, packageItem, rental, hotel, resort] =
      await Promise.all([
        getFeaturedOrFirst(Service),
        getFeaturedOrFirst(Tour),
        getFeaturedOrFirst(Package),
        getFeaturedOrFirst(RentalService),
        getFeaturedOrFirst(Hotel),
        getFeaturedOrFirst(Resort),
      ]);

    return {
      service,
      tour,
      package: packageItem,
      rental,
      hotel,
      resort,
    };
  } catch (error) {
    console.error("Error in getFeaturedItemsServer:", error);
    return {
      service: null,
      tour: null,
      package: null,
      rental: null,
      hotel: null,
      resort: null,
    };
  }
}
