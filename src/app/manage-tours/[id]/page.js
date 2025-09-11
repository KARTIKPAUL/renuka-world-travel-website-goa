// src/app/tour/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  CheckCircle,
  XCircle,
  Award,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TourDetailPage({ params }) {
  const router = useRouter();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTour();
    }
  }, [params.id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setTour(data.data);
      } else {
        toast.error("Tour not found");
        router.push("/manage-tours");
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      toast.error("Failed to load tour");
      router.push("/manage-tours");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tour Not Found
          </h2>
          <Link
            href="/manage-tours"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const getTourTypeDisplayName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "challenging":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {tour.title}
                </h1>
                <p className="text-sm text-gray-500">Tour Package Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/edit-tour/${tour._id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Tour
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {tour.images && tour.images.length > 0 ? (
                <div className="relative h-96">
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  {tour.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                      +{tour.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* Tour Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Tour
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {tour.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold">
                    {tour.duration.days}D/{tour.duration.nights}N
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="font-semibold text-sm">{tour.destination}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Group Size</p>
                  <p className="font-semibold">
                    Max {tour.maxGroupSize || "∞"}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Award className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Difficulty</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                      tour.difficulty
                    )}`}
                  >
                    {tour.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tour Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Tour Type</p>
                      <p className="font-medium">
                        {getTourTypeDisplayName(tour.tourType)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IndianRupee className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Price (Adult)</p>
                      <p className="font-medium">₹{tour.price.adult}</p>
                    </div>
                  </div>
                  {tour.price.child && (
                    <div className="flex items-center space-x-3">
                      <IndianRupee className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Price (Child)</p>
                        <p className="font-medium">₹{tour.price.child}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="font-medium">
                        {new Date(tour.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        tour.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          tour.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tour.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  {tour.rating > 0 && (
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <div className="flex items-center">
                          <p className="font-medium mr-2">{tour.rating}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < tour.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inclusions */}
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Inclusions
                  </h2>
                  <div className="space-y-2">
                    {tour.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exclusions */}
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Exclusions
                  </h2>
                  <div className="space-y-2">
                    {tour.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-700">{exclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Itinerary
                </h2>
                <div className="space-y-6">
                  {tour.itinerary.map((day, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-700 mb-3">
                            {day.description}
                          </p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {index < tour.itinerary.length - 1 && (
                        <div className="absolute left-4 mt-2 w-px h-6 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created By */}
            {tour.createdBy && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tour Operator
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {tour.createdBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {tour.createdBy.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tour.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ₹{tour.price.adult}
                </div>
                <p className="text-gray-600">per adult</p>
                {tour.price.child && (
                  <p className="text-sm text-gray-500">
                    ₹{tour.price.child} per child
                  </p>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation</p>
                <p>✓ Best price guarantee</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {tour.duration.days}D/{tour.duration.nights}N
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-medium">
                    {tour.minGroupSize || 1}-{tour.maxGroupSize || "∞"} people
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                      tour.difficulty
                    )}`}
                  >
                    {tour.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Type</span>
                  <span className="font-medium">
                    {getTourTypeDisplayName(tour.tourType)}
                  </span>
                </div>
              </div>
            </div>

            {/* Available Dates */}
            {tour.availableDates && tour.availableDates.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Available Dates
                </h3>
                <div className="space-y-2">
                  {tour.availableDates.slice(0, 5).map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {tour.availableDates.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{tour.availableDates.length - 5} more dates
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tour Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Tour Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">
                    {tour.reviews?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{tour.rating || "--"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
