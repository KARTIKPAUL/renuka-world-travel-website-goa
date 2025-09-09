// src/app/add-tour/page.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Calendar } from "lucide-react";

export default function AddTourPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    duration: {
      days: "",
      nights: "",
    },
    tourType: "",
    difficulty: "easy",
    price: {
      adult: "",
      child: "",
      infant: "",
    },
    inclusions: [""],
    exclusions: [""],
    itinerary: [
      {
        day: 1,
        title: "",
        description: "",
        activities: [""],
      },
    ],
    images: [""],
    maxGroupSize: "",
    minGroupSize: "1",
    availableDates: [""],
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
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
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

  const handleItineraryChange = (
    dayIndex,
    field,
    value,
    activityIndex = null
  ) => {
    const newItinerary = [...formData.itinerary];

    if (field === "activities") {
      newItinerary[dayIndex].activities[activityIndex] = value;
    } else {
      newItinerary[dayIndex][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
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

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          activities: [""],
        },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length > 1) {
      const newItinerary = formData.itinerary.filter((_, i) => i !== index);
      // Re-number the days
      newItinerary.forEach((day, i) => {
        day.day = i + 1;
      });

      setFormData((prev) => ({
        ...prev,
        itinerary: newItinerary,
      }));
    }
  };

  const addItineraryActivity = (dayIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities.push("");

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));
  };

  const removeItineraryActivity = (dayIndex, activityIndex) => {
    if (formData.itinerary[dayIndex].activities.length > 1) {
      const newItinerary = [...formData.itinerary];
      newItinerary[dayIndex].activities = newItinerary[
        dayIndex
      ].activities.filter((_, i) => i !== activityIndex);

      setFormData((prev) => ({
        ...prev,
        itinerary: newItinerary,
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
        duration: {
          days: parseInt(formData.duration.days),
          nights: parseInt(formData.duration.nights),
        },
        price: {
          adult: parseFloat(formData.price.adult),
          child: formData.price.child ? parseFloat(formData.price.child) : null,
          infant: formData.price.infant
            ? parseFloat(formData.price.infant)
            : null,
        },
        maxGroupSize: formData.maxGroupSize
          ? parseInt(formData.maxGroupSize)
          : null,
        minGroupSize: parseInt(formData.minGroupSize),
        inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
        exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
        images: formData.images.filter((image) => image.trim() !== ""),
        availableDates: formData.availableDates
          .filter((date) => date.trim() !== "")
          .map((date) => new Date(date)),
        itinerary: formData.itinerary.map((day) => ({
          ...day,
          activities: day.activities.filter(
            (activity) => activity.trim() !== ""
          ),
        })),
      };

      const response = await fetch("/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tour created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to create tour");
      }
    } catch (error) {
      console.error("Error creating tour:", error);
      toast.error("An error occurred while creating the tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Tour</h1>
            <p className="mt-2 text-gray-600">
              Create a comprehensive tour package for your customers
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
                    Tour Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tour title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter destination"
                  />
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
                  placeholder="Describe the tour in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Type *
                  </label>
                  <select
                    name="tourType"
                    value={formData.tourType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select tour type</option>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size (Min - Max)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minGroupSize"
                      value={formData.minGroupSize}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      name="maxGroupSize"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Duration & Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Duration & Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Duration
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days *
                      </label>
                      <input
                        type="number"
                        name="duration.days"
                        value={formData.duration.days}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nights *
                      </label>
                      <input
                        type="number"
                        name="duration.nights"
                        value={formData.duration.nights}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Pricing (₹)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adult Price *
                      </label>
                      <input
                        type="number"
                        name="price.adult"
                        value={formData.price.adult}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Child Price
                        </label>
                        <input
                          type="number"
                          name="price.child"
                          value={formData.price.child}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Infant Price
                        </label>
                        <input
                          type="number"
                          name="price.infant"
                          value={formData.price.infant}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Inclusions
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("inclusions")}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {formData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, "inclusions")
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's included in this tour?"
                    />
                    {formData.inclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "inclusions")}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Exclusions
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("exclusions")}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, "exclusions")
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's not included?"
                    />
                    {formData.exclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "exclusions")}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tour Itinerary
                </h2>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Day
                </button>
              </div>

              {formData.itinerary.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="mb-6 p-4 bg-white rounded-lg border"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Day {day.day}
                    </h3>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(dayIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day Title
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) =>
                          handleItineraryChange(
                            dayIndex,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter day title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={day.description}
                        onChange={(e) =>
                          handleItineraryChange(
                            dayIndex,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe what happens on this day"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Activities
                        </label>
                        <button
                          type="button"
                          onClick={() => addItineraryActivity(dayIndex)}
                          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Add Activity
                        </button>
                      </div>

                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) =>
                              handleItineraryChange(
                                dayIndex,
                                "activities",
                                e.target.value,
                                activityIndex
                              )
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter activity"
                          />
                          {day.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeItineraryActivity(dayIndex, activityIndex)
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
                </div>
              ))}
            </div>

            {/* Images & Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Images */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Images
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

              {/* Available Dates */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Dates
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("availableDates")}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Date
                  </button>
                </div>

                {formData.availableDates.map((date, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "availableDates"
                        )
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.availableDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "availableDates")}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                {loading ? "Creating Tour..." : "Create Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
