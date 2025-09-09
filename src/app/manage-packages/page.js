// src/app/manage-packages/page.js
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
  Calendar,
  Users,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManagePackagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPackageType, setFilterPackageType] = useState("");
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
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/packages");
      const data = await response.json();

      if (data.success) {
        setPackages(data.data || []);
      } else {
        toast.error("Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("An error occurred while fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Package deleted successfully");
        fetchPackages();
      } else {
        toast.error(data.error || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("An error occurred while deleting the package");
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.destinations &&
        pkg.destinations.some((dest) =>
          dest.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesPackageType =
      !filterPackageType || pkg.packageType === filterPackageType;
    const matchesActive =
      filterActive === "" ||
      (filterActive === "true" && pkg.isActive) ||
      (filterActive === "false" && !pkg.isActive);

    return matchesSearch && matchesPackageType && matchesActive;
  });

  const PackageCard = ({ pkg }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-500">
        {pkg.images && pkg.images[0] ? (
          <img
            src={pkg.images[0]}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-lg font-medium">No Image</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{pkg.price.basePrice} / per person
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              pkg.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {pkg.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {pkg.duration.days}D/{pkg.duration.nights}N
        </div>

        {/* Package Type Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {pkg.packageType.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {pkg.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {pkg.description}
        </p>

        {/* Destinations */}
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span>Destinations:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pkg.destinations.slice(0, 3).map((destination, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {destination}
                </span>
              ))}
              {pkg.destinations.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{pkg.destinations.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Package Details */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{pkg.accommodation.type}</span>
            </div>
            <span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {pkg.packageType}
            </span>
          </div>

          {pkg.accommodation.meals && (
            <div className="text-gray-500">
              Meals: {pkg.accommodation.meals}
            </div>
          )}

          {pkg.maxBookings && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Max bookings: {pkg.maxBookings}</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-4 text-sm">
          <div className="font-semibold text-gray-900">
            ₹{pkg.price.basePrice} (Base)
          </div>
          {pkg.price.pricePerPerson && (
            <div className="text-gray-600">
              ₹{pkg.price.pricePerPerson} (Per Person)
            </div>
          )}
          {pkg.price.childPrice && (
            <div className="text-gray-600">₹{pkg.price.childPrice} (Child)</div>
          )}
        </div>

        {/* Validity */}
        {pkg.validUntil && (
          <div className="mb-4 text-xs text-gray-500">
            Valid until: {new Date(pkg.validUntil).toLocaleDateString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/edit-package/${pkg._id}`)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Manage
          </button>

          <button
            onClick={() => router.push(`/package/${pkg._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(pkg._id)}
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
              Manage Packages
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all your travel packages from here
            </p>
          </div>

          <Link
            href="/add-package"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Package
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
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Package Type Filter */}
            <select
              value={filterPackageType}
              onChange={(e) => setFilterPackageType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Package Types</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="family">Family</option>
              <option value="adventure">Adventure</option>
              <option value="luxury">Luxury</option>
              <option value="budget">Budget</option>
              <option value="group">Group</option>
              <option value="custom">Custom</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
          </p>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No packages found</div>
            <Link
              href="/add-package"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
