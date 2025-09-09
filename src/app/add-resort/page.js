// src/app/add-resort/page.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, MapPin, Star, Phone } from "lucide-react";

export default function AddResortPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    resortType: "",
    starRating: "3",
    amenities: [""],
    accommodation: [
      {
        type: "",
        capacity: "",
        price: "",
        amenities: [""],
        images: [""],
        available: "1",
      },
    ],
    activities: [
      {
        name: "",
        description: "",
        price: "",
        duration: "",
        included: false,
      },
    ],
    dining: [
      {
        name: "",
        cuisine: "",
        mealPlans: ["breakfast"],
        price: "",
      },
    ],
    images: [""],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "",
      petPolicy: "",
      childPolicy: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    seasons: [
      {
        name: "",
        startMonth: "1",
        endMonth: "12",
        priceMultiplier: "1",
        description: "",
      },
    ],
    totalRooms: "",
    availableRooms: "",
    tags: [""],
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
      const keys = name.split(".");
      if (keys.length === 2) {
        const [parent, child] = keys;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        }));
      } else if (keys.length === 3) {
        const [parent, child, grandChild] = keys;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandChild]: type === "checkbox" ? checked : value,
            },
          },
        }));
      }
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

  const handleNestedArrayChange = (
    parentIndex,
    index,
    value,
    parent,
    field
  ) => {
    const newParentArray = [...formData[parent]];
    newParentArray[parentIndex][field][index] = value;
    setFormData((prev) => ({
      ...prev,
      [parent]: newParentArray,
    }));
  };

  const handleObjectArrayChange = (index, field, value, parent) => {
    const newArray = [...formData[parent]];
    newArray[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      [parent]: newArray,
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const addObjectArrayItem = (parent, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: [...prev[parent], defaultItem],
    }));
  };

  const addNestedArrayItem = (parentIndex, parent, field) => {
    const newParentArray = [...formData[parent]];
    newParentArray[parentIndex][field].push("");
    setFormData((prev) => ({
      ...prev,
      [parent]: newParentArray,
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

  const removeObjectArrayItem = (index, parent) => {
    if (formData[parent].length > 1) {
      const newArray = formData[parent].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [parent]: newArray,
      }));
    }
  };

  const removeNestedArrayItem = (parentIndex, index, parent, field) => {
    if (formData[parent][parentIndex][field].length > 1) {
      const newParentArray = [...formData[parent]];
      newParentArray[parentIndex][field] = newParentArray[parentIndex][
        field
      ].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [parent]: newParentArray,
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
        starRating: parseInt(formData.starRating),
        location: {
          ...formData.location,
          coordinates: {
            latitude: formData.location.coordinates.latitude
              ? parseFloat(formData.location.coordinates.latitude)
              : null,
            longitude: formData.location.coordinates.longitude
              ? parseFloat(formData.location.coordinates.longitude)
              : null,
          },
        },
        accommodation: formData.accommodation.map((acc) => ({
          ...acc,
          capacity: parseInt(acc.capacity),
          price: parseFloat(acc.price),
          available: parseInt(acc.available),
          amenities: acc.amenities.filter((amenity) => amenity.trim() !== ""),
          images: acc.images.filter((image) => image.trim() !== ""),
        })),
        activities: formData.activities
          .map((activity) => ({
            ...activity,
            price: activity.price ? parseFloat(activity.price) : null,
          }))
          .filter((activity) => activity.name.trim() !== ""),
        dining: formData.dining
          .map((dining) => ({
            ...dining,
            price: dining.price ? parseFloat(dining.price) : null,
          }))
          .filter((dining) => dining.name.trim() !== ""),
        seasons: formData.seasons
          .map((season) => ({
            ...season,
            startMonth: parseInt(season.startMonth),
            endMonth: parseInt(season.endMonth),
            priceMultiplier: parseFloat(season.priceMultiplier),
          }))
          .filter((season) => season.name.trim() !== ""),
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
        availableRooms: formData.availableRooms
          ? parseInt(formData.availableRooms)
          : null,
        amenities: formData.amenities.filter(
          (amenity) => amenity.trim() !== ""
        ),
        images: formData.images.filter((image) => image.trim() !== ""),
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
      };

      const response = await fetch("/api/resorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Resort created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to create resort");
      }
    } catch (error) {
      console.error("Error creating resort:", error);
      toast.error("An error occurred while creating the resort");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Resort</h1>
            <p className="mt-2 text-gray-600">
              Add a new resort to your platform
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
                    Resort Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter resort name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resort Type *
                  </label>
                  <select
                    name="resortType"
                    value={formData.resortType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select resort type</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="luxury">Luxury</option>
                    <option value="eco">Eco</option>
                    <option value="spa">Spa</option>
                    <option value="adventure">Adventure</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the resort"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Star Rating
                  </label>
                  <select
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms
                  </label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Total rooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Rooms
                  </label>
                  <input
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Available rooms"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="State name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.latitude"
                    value={formData.location.coordinates.latitude}
                    onChange={handleInputChange}
                    step="any"
                    min="-90"
                    max="90"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 15.2993"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.longitude"
                    value={formData.location.coordinates.longitude}
                    onChange={handleInputChange}
                    step="any"
                    min="-180"
                    max="180"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 74.1240"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Resort phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Resort email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="contact.website"
                    value={formData.contact.website}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://resort-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Resort Amenities */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Resort Amenities
                </h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("amenities")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Amenity
                </button>
              </div>

              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "amenities")
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amenity (e.g., Swimming Pool, Spa, WiFi)"
                  />
                  {formData.amenities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "amenities")}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Accommodation Types */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Accommodation Types
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    addObjectArrayItem("accommodation", {
                      type: "",
                      capacity: "",
                      price: "",
                      amenities: [""],
                      images: [""],
                      available: "1",
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Accommodation Type
                </button>
              </div>

              {formData.accommodation.map((acc, accIndex) => (
                <div
                  key={accIndex}
                  className="mb-6 p-4 bg-white rounded-lg border"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Accommodation {accIndex + 1}
                    </h3>
                    {formData.accommodation.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeObjectArrayItem(accIndex, "accommodation")
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accommodation Type *
                      </label>
                      <input
                        type="text"
                        value={acc.type}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            accIndex,
                            "type",
                            e.target.value,
                            "accommodation"
                          )
                        }
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Villa, Cottage, Suite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity *
                      </label>
                      <input
                        type="number"
                        value={acc.capacity}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            accIndex,
                            "capacity",
                            e.target.value,
                            "accommodation"
                          )
                        }
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Number of guests"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Night (₹) *
                      </label>
                      <input
                        type="number"
                        value={acc.price}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            accIndex,
                            "price",
                            e.target.value,
                            "accommodation"
                          )
                        }
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Price per night"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Units
                      </label>
                      <input
                        type="number"
                        value={acc.available}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            accIndex,
                            "available",
                            e.target.value,
                            "accommodation"
                          )
                        }
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Available units"
                      />
                    </div>
                  </div>

                  {/* Accommodation Amenities */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Amenities
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addNestedArrayItem(
                            accIndex,
                            "accommodation",
                            "amenities"
                          )
                        }
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {acc.amenities.map((amenity, amenityIndex) => (
                      <div key={amenityIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={amenity}
                          onChange={(e) =>
                            handleNestedArrayChange(
                              accIndex,
                              amenityIndex,
                              e.target.value,
                              "accommodation",
                              "amenities"
                            )
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Accommodation amenity"
                        />
                        {acc.amenities.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeNestedArrayItem(
                                accIndex,
                                amenityIndex,
                                "accommodation",
                                "amenities"
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Accommodation Images */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Images
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addNestedArrayItem(
                            accIndex,
                            "accommodation",
                            "images"
                          )
                        }
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {acc.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) =>
                            handleNestedArrayChange(
                              accIndex,
                              imageIndex,
                              e.target.value,
                              "accommodation",
                              "images"
                            )
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Image URL"
                        />
                        {acc.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeNestedArrayItem(
                                accIndex,
                                imageIndex,
                                "accommodation",
                                "images"
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Activities */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Activities
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    addObjectArrayItem("activities", {
                      name: "",
                      description: "",
                      price: "",
                      duration: "",
                      included: false,
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Activity
                </button>
              </div>

              {formData.activities.map((activity, actIndex) => (
                <div
                  key={actIndex}
                  className="mb-4 p-4 bg-white rounded-lg border"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Activity {actIndex + 1}
                    </h3>
                    {formData.activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeObjectArrayItem(actIndex, "activities")
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Name
                      </label>
                      <input
                        type="text"
                        value={activity.name}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            actIndex,
                            "name",
                            e.target.value,
                            "activities"
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Activity name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={activity.duration}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            actIndex,
                            "duration",
                            e.target.value,
                            "activities"
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2 hours, Half day"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={activity.description}
                      onChange={(e) =>
                        handleObjectArrayChange(
                          actIndex,
                          "description",
                          e.target.value,
                          "activities"
                        )
                      }
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Activity description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={activity.price}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            actIndex,
                            "price",
                            e.target.value,
                            "activities"
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Activity price"
                      />
                    </div>

                    <div className="flex items-center pt-8">
                      <input
                        type="checkbox"
                        checked={activity.included}
                        onChange={(e) =>
                          handleObjectArrayChange(
                            actIndex,
                            "included",
                            e.target.checked,
                            "activities"
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Included in package
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resort Policies
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="text"
                    name="policies.checkIn"
                    value={formData.policies.checkIn}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="text"
                    name="policies.checkOut"
                    value={formData.policies.checkOut}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 11:00 AM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    name="policies.cancellation"
                    value={formData.policies.cancellation}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe cancellation policy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Policy
                  </label>
                  <textarea
                    name="policies.petPolicy"
                    value={formData.policies.petPolicy}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe pet policy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child Policy
                </label>
                <textarea
                  name="policies.childPolicy"
                  value={formData.policies.childPolicy}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe child policy"
                />
              </div>
            </div>

            {/* Resort Images */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Resort Images
                </h2>
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
                    placeholder="Enter resort image URL"
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

            {/* Tags */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("tags")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Tag
                </button>
              </div>

              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "tags")
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tag (e.g., family-friendly, romantic)"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "tags")}
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
                {loading ? "Creating Resort..." : "Create Resort"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
