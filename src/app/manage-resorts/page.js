// src/app/manage-resorts/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  MapPin,
  Star,
  Phone,
  Bed,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageResortsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResortType, setFilterResortType] = useState("");
  const [filterStarRating, setFilterStarRating] = useState("");

  // Redirect if not admin
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status !== "authenticated" || session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resorts");
      const data = await response.json();

      if (data.success) {
        setResorts(data.data || []);
      } else {
        toast.error("Failed to fetch resorts");
      }
    } catch (error) {
      console.error("Error fetching resorts:", error);
      toast.error("An error occurred while fetching resorts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resort?")) {
      return;
    }

    try {
      const response = await fetch(`/api/resorts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Resort deleted successfully");
        fetchResorts();
      } else {
        toast.error(data.error || "Failed to delete resort");
      }
    } catch (error) {
      console.error("Error deleting resort:", error);
      toast.error("An error occurred while deleting the resort");
    }
  };

  const filteredResorts = resorts.filter((resort) => {
    const matchesSearch =
      resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resort.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resort.location.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResortType =
      !filterResortType || resort.resortType === filterResortType;
    const matchesStarRating =
      !filterStarRating || resort.starRating.toString() === filterStarRating;

    return matchesSearch && matchesResortType && matchesStarRating;
  });

  const ResortCard = ({ resort }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-r from-teal-400 to-blue-500">
        {resort.images && resort.images[0] ? (
          <img
            src={resort.images[0]}
            alt={resort.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-lg font-medium">No Image</span>
          </div>
        )}

        {/* Price Badge */}
        {resort.accommodation && resort.accommodation[0] && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ₹{Math.min(...resort.accommodation.map((acc) => acc.price))} / night
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              resort.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {resort.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Star Rating */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Star className="h-3 w-3 fill-current text-yellow-400" />
          {resort.starRating} Star
        </div>

        {/* Resort Type */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {resort.resortType.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {resort.name}
        </h3>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {resort.location.city}, {resort.location.state}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {resort.description}
        </p>

        {/* Resort Details */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="capitalize bg-teal-100 text-teal-800 px-2 py-1 rounded">
              {resort.resortType}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(resort.starRating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-current text-yellow-400"
                />
              ))}
            </div>
          </div>

          {resort.totalRooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              <span>
                {resort.availableRooms || 0}/{resort.totalRooms} rooms available
              </span>
            </div>
          )}

          {resort.contact?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{resort.contact.phone}</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {resort.amenities && resort.amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {resort.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {amenity}
                </span>
              ))}
              {resort.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{resort.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Accommodation Types & Pricing */}
        {resort.accommodation && resort.accommodation.length > 0 && (
          <div className="mb-4 text-sm">
            <div className="font-semibold text-gray-900">
              From ₹{Math.min(...resort.accommodation.map((acc) => acc.price))}{" "}
              / night
            </div>
            <div className="text-gray-600 text-xs">
              {resort.accommodation.length} accommodation type
              {resort.accommodation.length > 1 ? "s" : ""} available
            </div>
          </div>
        )}

        {/* Activities Count */}
        {resort.activities && resort.activities.length > 0 && (
          <div className="mb-4 text-xs text-gray-500">
            <div>{resort.activities.length} activities available</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/edit-resort/${resort._id}`)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Manage
          </button>

          <button
            onClick={() => router.push(`/manage-resorts/${resort._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(resort._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Resorts</h1>
            <p className="mt-2 text-gray-600">
              Manage all your resort listings from here
            </p>
          </div>

          <Link
            href="/add-resort"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Resort
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resorts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resort Type Filter */}
            <select
              value={filterResortType}
              onChange={(e) => setFilterResortType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Resort Types</option>
              <option value="beach">Beach</option>
              <option value="mountain">Mountain</option>
              <option value="wildlife">Wildlife</option>
              <option value="luxury">Luxury</option>
              <option value="eco">Eco</option>
              <option value="spa">Spa</option>
              <option value="adventure">Adventure</option>
              <option value="family">Family</option>
            </select>

            {/* Star Rating Filter */}
            <select
              value={filterStarRating}
              onChange={(e) => setFilterStarRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Star Ratings</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResorts.length} of {resorts.length} resorts
          </p>
        </div>

        {/* Resorts Grid */}
        {filteredResorts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResorts.map((resort) => (
              <ResortCard key={resort._id} resort={resort} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No resorts found</div>
            <Link
              href="/add-resort"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Resort
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
