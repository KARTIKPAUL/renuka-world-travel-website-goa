// src/components/FeaturedServices.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Car,
  Hotel,
  Package,
  List,
  Heart,
  Share2,
  Palmtree,
} from "lucide-react";

export default function FeaturedServices() {
  const [featuredItems, setFeaturedItems] = useState({
    service: null,
    tour: null,
    package: null,
    rental: null,
    hotel: null,
    resort: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/featured");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (data.success && data.data) {
        setFeaturedItems(data.data);
      } else {
        console.error("Featured API returned:", data);
      }
    } catch (error) {
      console.error("Error fetching featured items:", error);
    } finally {
      setLoading(false);
    }
  };

  const ServiceCard = ({ item, type }) => {
    if (!item) return null;

    const getCardContent = () => {
      switch (type) {
        case "service":
          return {
            title: item.name,
            price: `₹${item.price}`,
            priceUnit: item.priceType || "per service",
            description: item.description,
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              {
                text:
                  item.category?.replace("-", " ").toUpperCase() || "SERVICE",
                bg: "bg-blue-500",
              },
            ],
            details: [
              {
                icon: List,
                text: item.category?.replace("-", " ") || "General Service",
              },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 50,
            href: `/service/${item._id}`,
          };

        case "tour":
          return {
            title: item.title,
            price: `₹${item.price?.adult || item.price || 0}`,
            priceUnit: "per person",
            description: item.description,
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              {
                text: `${item.duration?.days || 1}D/${
                  item.duration?.nights || 0
                }N`,
                bg: "bg-green-500",
              },
              {
                text: item.destination || "India",
                bg: "bg-transparent border border-white",
              },
            ],
            details: [
              {
                icon: MapPin,
                text: item.destination || "Multiple destinations",
              },
              {
                icon: Calendar,
                text: `${item.duration?.days || 1}D/${
                  item.duration?.nights || 0
                }N`,
              },
              {
                icon: Users,
                text: `People: ${item.maxGroupSize || "Flexible"}`,
              },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 100,
            href: `/tour/${item._id}`,
          };

        case "package":
          return {
            title: item.name,
            price: `₹${
              item.price?.basePrice || item.price?.pricePerPerson || 0
            }`,
            priceUnit: "per person",
            description: item.description,
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              {
                text: `${item.duration?.days || 1}D/${
                  item.duration?.nights || 0
                }N`,
                bg: "bg-purple-500",
              },
              {
                text: item.packageType?.toUpperCase() || "PACKAGE",
                bg: "bg-transparent border border-white",
              },
            ],
            details: [
              {
                icon: MapPin,
                text:
                  item.destinations?.slice(0, 2).join(", ") ||
                  "Multiple destinations",
              },
              {
                icon: Calendar,
                text: `${item.duration?.days || 1}D/${
                  item.duration?.nights || 0
                }N`,
              },
              {
                icon: Package,
                text: item.accommodation?.type || "Hotel",
              },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 75,
            href: `/package/${item._id}`,
          };

        case "rental":
          return {
            title: item.name,
            price: `₹${
              item.pricing?.fullDay ||
              item.pricing?.halfDay ||
              item.pricing?.hourly ||
              0
            }`,
            priceUnit: item.pricing?.fullDay
              ? "per day"
              : item.pricing?.halfDay
              ? "per half day"
              : "per hour",
            description: `${item.brand || ""} ${item.model || "Vehicle"} - ${
              item.capacity?.seating || 4
            } seater ${item.fuelType || "petrol"} ${
              item.transmission || "manual"
            }`.trim(),
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              {
                text: item.category?.toUpperCase() || "CAR",
                bg: "bg-orange-500",
              },
              {
                text: item.transmission?.toUpperCase() || "MANUAL",
                bg: "bg-transparent border border-white",
              },
            ],
            details: [
              {
                icon: Car,
                text: `${item.brand || ""} ${item.model || "Vehicle"}`.trim(),
              },
              { icon: Users, text: `${item.capacity?.seating || 4} Seater` },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 30,
            href: `/rental/${item._id}`,
          };

        case "hotel":
          return {
            title: item.name,
            price: `₹${item.roomTypes?.[0]?.price || 1500}`,
            priceUnit: "per night",
            description: item.description,
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              { text: `${item.starRating || 3} STAR`, bg: "bg-red-500" },
              {
                text: item.hotelType?.toUpperCase() || "HOTEL",
                bg: "bg-transparent border border-white",
              },
            ],
            details: [
              {
                icon: MapPin,
                text: `${item.location?.city || "City"}, ${
                  item.location?.state || "State"
                }`,
              },
              { icon: Hotel, text: item.hotelType || "Hotel" },
              { icon: Star, text: `${item.starRating || 3} Star Hotel` },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 80,
            href: `/hotel/${item._id}`,
          };

        case "resort":
          return {
            title: item.name,
            price: `₹${
              item.accommodation?.[0]?.price ||
              Math.min(...(item.accommodation?.map((a) => a.price) || [2000]))
            }`,
            priceUnit: "per night",
            description: item.description,
            image:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600&auto=format&fit=crop&q=60",
            badges: [
              { text: `${item.starRating || 3} STAR`, bg: "bg-teal-500" },
              {
                text: item.resortType?.toUpperCase() || "RESORT",
                bg: "bg-transparent border border-white",
              },
            ],
            details: [
              {
                icon: MapPin,
                text: `${item.location?.city || "City"}, ${
                  item.location?.state || "State"
                }`,
              },
              { icon: Palmtree, text: item.resortType || "Resort" },
              { icon: Star, text: `${item.starRating || 3} Star Resort` },
            ],
            rating: item.rating || 4.5,
            reviews: item.reviewCount || 90,
            href: `/resort/${item._id}`,
          };

        default:
          return null;
      }
    };

    const cardData = getCardContent();
    if (!cardData) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={cardData.image}
            alt={cardData.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=600";
            }}
          />
          {/* Price */}
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
            {cardData.price} / {cardData.priceUnit}
          </div>
          {/* Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white bg-opacity-90 p-2 rounded-full shadow-lg hover:bg-opacity-100">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="bg-white bg-opacity-90 p-2 rounded-full shadow-lg hover:bg-opacity-100">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {cardData.badges.map((b, i) => (
              <span
                key={i}
                className={`${b.bg} text-white text-xs px-2 py-1 rounded font-medium`}
              >
                {b.text}
              </span>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1">
              {cardData.title}
            </h3>
            <div className="flex items-center gap-1 ml-4">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {cardData.rating}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {cardData.description}
          </p>
          <div className="space-y-2 mb-4">
            {cardData.details.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <d.icon className="h-4 w-4" />
                <span>{d.text}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mb-4">
            ({cardData.reviews} reviews)
          </div>
          <div className="flex gap-3">
            <Link
              href={cardData.href}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Book Now →
            </Link>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-lg font-medium">
              Wish List ♡
            </button>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>✈</span>
              <span>Flight</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>🏨</span>
              <span>Hotels</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>🚌</span>
              <span>Transport</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const validItems = Object.entries(featuredItems).filter(
    ([, v]) => v !== null
  );

  if (validItems.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-500">
              No featured services available
            </h3>
            <p className="text-gray-400 mt-2">
              Please add some services to display here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold text-lg mb-2">
            WHAT WE PROVIDE
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            THIS IS THE THINGS WE PROVIDE
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium travel services,
            curated just for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {validItems.map(([type, item]) => (
            <ServiceCard key={type} item={item} type={type} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/all-services"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Services
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
