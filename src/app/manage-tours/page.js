// src/app/manage-tours/page.js
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
  Star,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageToursPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTourType, setFilterTourType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

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
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tours");
      const data = await response.json();

      if (data.success) {
        setTours(data.data || []);
      } else {
        toast.error("Failed to fetch tours");
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("An error occurred while fetching tours");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tour?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tours/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tour deleted successfully");
        fetchTours();
      } else {
        toast.error(data.error || "Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      toast.error("An error occurred while deleting the tour");
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTourType = !filterTourType || tour.tourType === filterTourType;
    const matchesDifficulty =
      !filterDifficulty || tour.difficulty === filterDifficulty;

    return matchesSearch && matchesTourType && matchesDifficulty;
  });

  const TourCard = ({ tour }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-r from-green-400 to-blue-500">
        {tour.images && tour.images[0] ? (
          <img
            src={tour.images[0]}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-lg font-medium">No Image</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{tour.price.adult} / per person
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tour.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {tour.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {tour.duration.days}D/{tour.duration.nights}N
        </div>

        {/* Destination Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {tour.destination}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1">
            {tour.title}
          </h3>
          {tour.rating > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{tour.rating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {tour.description}
        </p>

        {/* Tour Details */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {tour.tourType}
            </span>
            <span
              className={`px-2 py-1 rounded ${
                tour.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : tour.difficulty === "moderate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {tour.difficulty}
            </span>
          </div>

          {tour.maxGroupSize && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Max: {tour.maxGroupSize} people</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-4 text-sm">
          <div className="font-semibold text-gray-900">
            ₹{tour.price.adult} (Adult)
          </div>
          {tour.price.child && (
            <div className="text-gray-600">₹{tour.price.child} (Child)</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/edit-tour/${tour._id}`)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Manage
          </button>

          <button
            onClick={() => router.push(`/tour/${tour._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(tour._id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Tours</h1>
            <p className="mt-2 text-gray-600">
              Manage all your tour packages from here
            </p>
          </div>

          <Link
            href="/add-tour"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Tour
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
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tour Type Filter */}
            <select
              value={filterTourType}
              onChange={(e) => setFilterTourType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tour Types</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="religious">Religious</option>
              <option value="beach">Beach</option>
              <option value="wildlife">Wildlife</option>
              <option value="heritage">Heritage</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="family">Family</option>
              <option value="group">Group</option>
              <option value="solo">Solo</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
          </p>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No tours found</div>
            <Link
              href="/add-tour"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
