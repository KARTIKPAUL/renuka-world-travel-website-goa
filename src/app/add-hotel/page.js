// src/app/add-hotel/page.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Hotel, MapPin, Star } from "lucide-react";

export default function AddHotelPage() {
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
    hotelType: "",
    starRating: "3",
    amenities: [""],
    roomTypes: [
      {
        type: "",
        price: "",
        capacity: "",
        amenities: [""],
        images: [""],
      },
    ],
    images: [""],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "",
      petPolicy: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    totalRooms: "",
    availableRooms: "",
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
    const { name, value } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      if (keys.length === 2) {
        const [parent, child] = keys;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
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
              [grandChild]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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

  const handleRoomTypeChange = (roomIndex, field, value) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[roomIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      roomTypes: newRoomTypes,
    }));
  };

  const handleRoomTypeArrayChange = (roomIndex, arrayIndex, field, value) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[roomIndex][field][arrayIndex] = value;
    setFormData((prev) => ({
      ...prev,
      roomTypes: newRoomTypes,
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
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

  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        {
          type: "",
          price: "",
          capacity: "",
          amenities: [""],
          images: [""],
        },
      ],
    }));
  };

  const removeRoomType = (index) => {
    if (formData.roomTypes.length > 1) {
      const newRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        roomTypes: newRoomTypes,
      }));
    }
  };

  const addRoomTypeArrayItem = (roomIndex, field) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[roomIndex][field].push("");
    setFormData((prev) => ({
      ...prev,
      roomTypes: newRoomTypes,
    }));
  };

  const removeRoomTypeArrayItem = (roomIndex, arrayIndex, field) => {
    if (formData.roomTypes[roomIndex][field].length > 1) {
      const newRoomTypes = [...formData.roomTypes];
      newRoomTypes[roomIndex][field] = newRoomTypes[roomIndex][field].filter(
        (_, i) => i !== arrayIndex
      );
      setFormData((prev) => ({
        ...prev,
        roomTypes: newRoomTypes,
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
        roomTypes: formData.roomTypes.map((room) => ({
          ...room,
          price: parseFloat(room.price),
          capacity: parseInt(room.capacity),
          amenities: room.amenities.filter((amenity) => amenity.trim() !== ""),
          images: room.images.filter((image) => image.trim() !== ""),
        })),
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
        availableRooms: formData.availableRooms
          ? parseInt(formData.availableRooms)
          : null,
        amenities: formData.amenities.filter(
          (amenity) => amenity.trim() !== ""
        ),
        images: formData.images.filter((image) => image.trim() !== ""),
      };

      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Hotel created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to create hotel");
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      toast.error("An error occurred while creating the hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Hotel</h1>
            <p className="mt-2 text-gray-600">
              Add a new hotel to your platform
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
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hotel name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Type *
                  </label>
                  <select
                    name="hotelType"
                    value={formData.hotelType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select hotel type</option>
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid Range</option>
                    <option value="luxury">Luxury</option>
                    <option value="resort">Resort</option>
                    <option value="boutique">Boutique</option>
                    <option value="heritage">Heritage</option>
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
                  placeholder="Describe the hotel"
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
                    placeholder="Hotel phone number"
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
                    placeholder="Hotel email"
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
                    placeholder="https://hotel-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Hotel Amenities */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Hotel Amenities
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
                    placeholder="Enter amenity (e.g., WiFi, Pool, Gym)"
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

            {/* Room Types */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Room Types
                </h2>
                <button
                  type="button"
                  onClick={addRoomType}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Room Type
                </button>
              </div>

              {formData.roomTypes.map((roomType, roomIndex) => (
                <div
                  key={roomIndex}
                  className="mb-6 p-4 bg-white rounded-lg border"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Room Type {roomIndex + 1}
                    </h3>
                    {formData.roomTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomType(roomIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type *
                      </label>
                      <input
                        type="text"
                        value={roomType.type}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            roomIndex,
                            "type",
                            e.target.value
                          )
                        }
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Deluxe Room, Suite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Night (₹) *
                      </label>
                      <input
                        type="number"
                        value={roomType.price}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            roomIndex,
                            "price",
                            e.target.value
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
                        Capacity *
                      </label>
                      <input
                        type="number"
                        value={roomType.capacity}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            roomIndex,
                            "capacity",
                            e.target.value
                          )
                        }
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Number of guests"
                      />
                    </div>
                  </div>

                  {/* Room Amenities */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Room Amenities
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addRoomTypeArrayItem(roomIndex, "amenities")
                        }
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {roomType.amenities.map((amenity, amenityIndex) => (
                      <div key={amenityIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={amenity}
                          onChange={(e) =>
                            handleRoomTypeArrayChange(
                              roomIndex,
                              amenityIndex,
                              "amenities",
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Room amenity"
                        />
                        {roomType.amenities.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeRoomTypeArrayItem(
                                roomIndex,
                                amenityIndex,
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

                  {/* Room Images */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Room Images
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addRoomTypeArrayItem(roomIndex, "images")
                        }
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {roomType.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) =>
                            handleRoomTypeArrayChange(
                              roomIndex,
                              imageIndex,
                              "images",
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Room image URL"
                        />
                        {roomType.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeRoomTypeArrayItem(
                                roomIndex,
                                imageIndex,
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

            {/* Policies */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hotel Policies
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
                    placeholder="e.g., 2:00 PM"
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
                    placeholder="e.g., 12:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Hotel Images */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Hotel Images
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
                    placeholder="Enter hotel image URL"
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
                {loading ? "Creating Hotel..." : "Create Hotel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
