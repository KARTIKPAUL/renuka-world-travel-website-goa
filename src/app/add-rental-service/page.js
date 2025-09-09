// src/app/add-rental-service/page.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Car, MapPin, Calendar } from "lucide-react";

export default function AddRentalServicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    capacity: {
      seating: "",
      luggage: "",
    },
    features: [""],
    fuelType: "petrol",
    transmission: "manual",
    pricing: {
      hourly: "",
      halfDay: "",
      fullDay: "",
      weekly: "",
      monthly: "",
    },
    images: [""],
    documents: {
      licenseRequired: true,
      ageLimit: "18",
      deposit: "",
    },
    location: {
      pickupPoints: [""],
      dropPoints: [""],
    },
  });

  // Redirect if not admin
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status !== "authenticated" || session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleNestedArrayChange = (index, value, parent, field) => {
    const newArray = [...formData[parent][field]];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: newArray,
      },
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const addNestedArrayItem = (parent, field) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...prev[parent][field], ""],
      },
    }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [field]: newArray,
      }));
    }
  };

  const removeNestedArrayItem = (index, parent, field) => {
    if (formData[parent][field].length > 1) {
      const newArray = formData[parent][field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: newArray,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up form data
      const cleanData = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        capacity: {
          seating: parseInt(formData.capacity.seating),
          luggage: formData.capacity.luggage,
        },
        pricing: {
          hourly: formData.pricing.hourly
            ? parseFloat(formData.pricing.hourly)
            : null,
          halfDay: formData.pricing.halfDay
            ? parseFloat(formData.pricing.halfDay)
            : null,
          fullDay: formData.pricing.fullDay
            ? parseFloat(formData.pricing.fullDay)
            : null,
          weekly: formData.pricing.weekly
            ? parseFloat(formData.pricing.weekly)
            : null,
          monthly: formData.pricing.monthly
            ? parseFloat(formData.pricing.monthly)
            : null,
        },
        documents: {
          ...formData.documents,
          ageLimit: parseInt(formData.documents.ageLimit),
          deposit: formData.documents.deposit
            ? parseFloat(formData.documents.deposit)
            : null,
        },
        features: formData.features.filter((feature) => feature.trim() !== ""),
        images: formData.images.filter((image) => image.trim() !== ""),
        location: {
          pickupPoints: formData.location.pickupPoints.filter(
            (point) => point.trim() !== ""
          ),
          dropPoints: formData.location.dropPoints.filter(
            (point) => point.trim() !== ""
          ),
        },
      };

      const response = await fetch("/api/rental-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Rental service created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to create rental service");
      }
    } catch (error) {
      console.error("Error creating rental service:", error);
      toast.error("An error occurred while creating the rental service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Rental Service
            </h1>
            <p className="mt-2 text-gray-600">
              Add a new vehicle rental service to your platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="bus">Bus</option>
                    <option value="tempo-traveller">Tempo Traveller</option>
                    <option value="luxury-car">Luxury Car</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter model name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Manufacturing year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity.seating"
                    value={formData.capacity.seating}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Number of seats"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    name="capacity.luggage"
                    value={formData.capacity.luggage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2 large bags"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="manual">Manual</option>
                      <option value="automatic">Automatic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pricing (₹)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    name="pricing.hourly"
                    value={formData.pricing.hourly}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Per hour"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Half Day
                  </label>
                  <input
                    type="number"
                    name="pricing.halfDay"
                    value={formData.pricing.halfDay}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Half day rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Day
                  </label>
                  <input
                    type="number"
                    name="pricing.fullDay"
                    value={formData.pricing.fullDay}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full day rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly
                  </label>
                  <input
                    type="number"
                    name="pricing.weekly"
                    value={formData.pricing.weekly}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Weekly rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly
                  </label>
                  <input
                    type="number"
                    name="pricing.monthly"
                    value={formData.pricing.monthly}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Monthly rate"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Features
                </h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("features")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>

              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "features")
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter feature (e.g., AC, GPS, Music System)"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "features")}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Documents & Requirements */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements & Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="documents.licenseRequired"
                      checked={formData.documents.licenseRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Driving License Required
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    name="documents.ageLimit"
                    value={formData.documents.ageLimit}
                    onChange={handleInputChange}
                    min="16"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Minimum age required"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    name="documents.deposit"
                    value={formData.documents.deposit}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Security deposit amount"
                  />
                </div>
              </div>
            </div>

            {/* Location Points */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pickup Points */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pickup Points
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      addNestedArrayItem("location", "pickupPoints")
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Point
                  </button>
                </div>

                {formData.location.pickupPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) =>
                        handleNestedArrayChange(
                          index,
                          e.target.value,
                          "location",
                          "pickupPoints"
                        )
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pickup location"
                    />
                    {formData.location.pickupPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeNestedArrayItem(
                            index,
                            "location",
                            "pickupPoints"
                          )
                        }
                        className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Drop Points */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Drop Points
                  </h2>
                  <button
                    type="button"
                    onClick={() => addNestedArrayItem("location", "dropPoints")}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Point
                  </button>
                </div>

                {formData.location.dropPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) =>
                        handleNestedArrayChange(
                          index,
                          e.target.value,
                          "location",
                          "dropPoints"
                        )
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter drop location"
                    />
                    {formData.location.dropPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeNestedArrayItem(index, "location", "dropPoints")
                        }
                        className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("images")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </button>
              </div>

              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "images")
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image URL"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "images")}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Rental Service..."
                  : "Create Rental Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
