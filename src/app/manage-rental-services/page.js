// src/app/manage-rental-services/page.js
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
  Car,
  Users,
  Fuel,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageRentalServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterActive, setFilterActive] = useState("");

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
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rental-services");
      const data = await response.json();

      if (data.success) {
        setRentals(data.data || []);
      } else {
        toast.error("Failed to fetch rental services");
      }
    } catch (error) {
      console.error("Error fetching rental services:", error);
      toast.error("An error occurred while fetching rental services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this rental service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/rental-services/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Rental service deleted successfully");
        fetchRentals();
      } else {
        toast.error(data.error || "Failed to delete rental service");
      }
    } catch (error) {
      console.error("Error deleting rental service:", error);
      toast.error("An error occurred while deleting the rental service");
    }
  };

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rental.brand &&
        rental.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !filterCategory || rental.category === filterCategory;
    const matchesActive =
      filterActive === "" ||
      (filterActive === "true" && rental.isActive) ||
      (filterActive === "false" && !rental.isActive);

    return matchesSearch && matchesCategory && matchesActive;
  });

  const RentalCard = ({ rental }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
        {rental.images && rental.images[0] ? (
          <img
            src={rental.images[0]}
            alt={rental.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <Car className="h-16 w-16" />
          </div>
        )}

        {/* Price Badge */}
        {rental.pricing.fullDay && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ₹{rental.pricing.fullDay} / day
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              rental.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {rental.isActive ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {rental.category.toUpperCase()}
        </div>

        {/* Transmission Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Settings className="h-3 w-3" />
          {rental.transmission}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {rental.name}
        </h3>

        <div className="text-sm text-gray-600 mb-3">
          {rental.brand && <span>{rental.brand} </span>}
          <span className="font-medium">{rental.model}</span>
          {rental.year && <span> ({rental.year})</span>}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{rental.capacity.seating} seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              <span className="capitalize">{rental.fuelType}</span>
            </div>
          </div>

          {rental.capacity.luggage && (
            <div className="text-gray-500">
              Luggage: {rental.capacity.luggage}
            </div>
          )}
        </div>

        {/* Features */}
        {rental.features && rental.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {rental.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {rental.features.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{rental.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4 text-sm">
          {rental.pricing.fullDay && (
            <div className="font-semibold text-gray-900">
              ₹{rental.pricing.fullDay} / day
            </div>
          )}
          {rental.pricing.halfDay && (
            <div className="text-gray-600">
              ₹{rental.pricing.halfDay} / half day
            </div>
          )}
          {rental.pricing.hourly && (
            <div className="text-gray-600">₹{rental.pricing.hourly} / hour</div>
          )}
        </div>

        {/* Documents Required */}
        {rental.documents && (
          <div className="mb-4 text-xs text-gray-500">
            {rental.documents.licenseRequired && <div>🪪 License required</div>}
            <div>Age: {rental.documents.ageLimit}+ years</div>
            {rental.documents.deposit && (
              <div>💰 Deposit: ₹{rental.documents.deposit}</div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/edit-rental-service/${rental._id}`)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Manage
          </button>

          <button
            onClick={() => router.push(`/rental-service/${rental._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(rental._id)}
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
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Rental Services
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all your vehicle rental services from here
            </p>
          </div>

          <Link
            href="/add-rental-service"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Rental
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
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="bus">Bus</option>
              <option value="tempo-traveller">Tempo Traveller</option>
              <option value="luxury-car">Luxury Car</option>
              <option value="suv">SUV</option>
              <option value="sedan">Sedan</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRentals.length} of {rentals.length} rental services
          </p>
        </div>

        {/* Rentals Grid */}
        {filteredRentals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRentals.map((rental) => (
              <RentalCard key={rental._id} rental={rental} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No rental services found
            </div>
            <Link
              href="/add-rental-service"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Rental Service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
