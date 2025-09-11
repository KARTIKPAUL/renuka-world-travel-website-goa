// src/app/service/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Star,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  IndianRupee,
  Check,
  Clock,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ServiceDetailPage({ params }) {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setService(data.data);
      } else {
        toast.error("Service not found");
        router.push("/manage-services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service");
      router.push("/manage-services");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h2>
          <Link
            href="/manage-services"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryDisplayName = (category) => {
    return category
      .replace("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getPriceTypeDisplayName = (priceType) => {
    const typeMap = {
      fixed: "Fixed Price",
      "per-person": "Per Person",
      "per-group": "Per Group",
      hourly: "Per Hour",
      daily: "Per Day",
      consultation: "Consultation",
    };
    return typeMap[priceType] || priceType;
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
                  {service.name}
                </h1>
                <p className="text-sm text-gray-500">Service Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/edit-service/${service._id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Service
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
              {service.images && service.images.length > 0 ? (
                <div className="relative h-96">
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  {service.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                      +{service.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Service
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What's Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Service Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">
                        {getCategoryDisplayName(service.category)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IndianRupee className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Pricing</p>
                      <p className="font-medium">
                        ₹{service.price} -{" "}
                        {getPriceTypeDisplayName(service.priceType)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Added On</p>
                      <p className="font-medium">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        service.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          service.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Created By */}
            {service.createdBy && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Service Provider
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {service.createdBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {service.createdBy.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.createdBy.email}
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
                  ₹{service.price}
                </div>
                <p className="text-gray-600">
                  {getPriceTypeDisplayName(service.priceType)}
                </p>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation</p>
              </div>
            </div>

            {/* Contact Information */}
            {service.contactInfo &&
              Object.keys(service.contactInfo).some(
                (key) => service.contactInfo[key]
              ) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {service.contactInfo.phone && (
                      <a
                        href={`tel:${service.contactInfo.phone}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="h-5 w-5 text-blue-500" />
                        <span>{service.contactInfo.phone}</span>
                      </a>
                    )}
                    {service.contactInfo.email && (
                      <a
                        href={`mailto:${service.contactInfo.email}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-green-500" />
                        <span>{service.contactInfo.email}</span>
                      </a>
                    )}
                    {service.contactInfo.whatsapp && (
                      <a
                        href={`https://wa.me/${service.contactInfo.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            {/* Service Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Service Stats
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
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">--</span>
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
