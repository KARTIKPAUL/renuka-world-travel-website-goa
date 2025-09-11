// src/app/edit-tour/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function EditTourPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tour, setTour] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    duration: { days: "", nights: "" },
    tourType: "",
    difficulty: "easy",
    price: { adult: "", child: "", infant: "" },
    inclusions: [""],
    exclusions: [""],
    itinerary: [],
    images: [""],
    maxGroupSize: "",
    minGroupSize: "",
    availableDates: [],
    isActive: true,
  });

  // Redirect if not admin
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (status !== "authenticated" || session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

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
        const tourData = data.data;
        setTour(tourData);
        setFormData({
          title: tourData.title || "",
          description: tourData.description || "",
          destination: tourData.destination || "",
          duration: {
            days: tourData.duration?.days?.toString() || "",
            nights: tourData.duration?.nights?.toString() || "",
          },
          tourType: tourData.tourType || "",
          difficulty: tourData.difficulty || "easy",
          price: {
            adult: tourData.price?.adult?.toString() || "",
            child: tourData.price?.child?.toString() || "",
            infant: tourData.price?.infant?.toString() || "",
          },
          inclusions:
            tourData.inclusions?.length > 0 ? tourData.inclusions : [""],
          exclusions:
            tourData.exclusions?.length > 0 ? tourData.exclusions : [""],
          itinerary: tourData.itinerary || [],
          images: tourData.images?.length > 0 ? tourData.images : [""],
          maxGroupSize: tourData.maxGroupSize?.toString() || "",
          minGroupSize: tourData.minGroupSize?.toString() || "",
          availableDates:
            tourData.availableDates?.map(
              (date) => new Date(date).toISOString().split("T")[0]
            ) || [],
          isActive: tourData.isActive !== undefined ? tourData.isActive : true,
        });
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
    const newDay = {
      day: formData.itinerary.length + 1,
      title: "",
      description: "",
      activities: [""],
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const updateItineraryDay = (dayIndex, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));
  };

  const addItineraryActivity = (dayIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities.push("");
    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));
  };

  const updateItineraryActivity = (dayIndex, activityIndex, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));
  };

  const removeItineraryDay = (dayIndex) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== dayIndex);
    // Renumber days
    const renumberedItinerary = newItinerary.map((day, index) => ({
      ...day,
      day: index + 1,
    }));
    setFormData((prev) => ({
      ...prev,
      itinerary: renumberedItinerary,
    }));
  };

  const addAvailableDate = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      availableDates: [...prev.availableDates, today],
    }));
  };

  const updateAvailableDate = (index, value) => {
    const newDates = [...formData.availableDates];
    newDates[index] = value;
    setFormData((prev) => ({
      ...prev,
      availableDates: newDates,
    }));
  };

  const removeAvailableDate = (index) => {
    const newDates = formData.availableDates.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      availableDates: newDates,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanData = {
        ...formData,
        duration: {
          days: parseInt(formData.duration.days) || 0,
          nights: parseInt(formData.duration.nights) || 0,
        },
        price: {
          adult: parseFloat(formData.price.adult) || 0,
          child: formData.price.child
            ? parseFloat(formData.price.child)
            : undefined,
          infant: formData.price.infant
            ? parseFloat(formData.price.infant)
            : undefined,
        },
        maxGroupSize: formData.maxGroupSize
          ? parseInt(formData.maxGroupSize)
          : undefined,
        minGroupSize: formData.minGroupSize
          ? parseInt(formData.minGroupSize)
          : 1,
        inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
        exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
        images: formData.images.filter((image) => image.trim() !== ""),
        itinerary: formData.itinerary.map((day) => ({
          ...day,
          activities: day.activities.filter(
            (activity) => activity.trim() !== ""
          ),
        })),
        availableDates: formData.availableDates,
      };

      const response = await fetch(`/api/tours/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tour updated successfully!");
        router.push("/manage-tours");
      } else {
        toast.error(data.error || "Failed to update tour");
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      toast.error("An error occurred while updating the tour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/manage-tours"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Tours
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Tour</h1>
          <p className="mt-2 text-gray-600">
            Update your tour package information
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-8"
        >
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="space-y-6">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter tour title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tour destination"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Type *
                  </label>
                  <select
                    name="tourType"
                    value={formData.tourType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your tour"
                />
              </div>
            </div>
          </div>

          {/* Duration & Details */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Duration & Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Group Size
                </label>
                <input
                  type="number"
                  name="minGroupSize"
                  value={formData.minGroupSize}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Group Size
                </label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing (₹)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              <button
                type="button"
                onClick={() => addArrayItem("images")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
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
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

          {/* Inclusions */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Inclusions
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("inclusions")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Inclusion
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
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="What's included?"
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
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Exclusions
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("exclusions")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Exclusion
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
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

          {/* Itinerary */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Itinerary</h2>
              <button
                type="button"
                onClick={addItineraryDay}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Day
              </button>
            </div>

            {formData.itinerary.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Day {day.day}</h3>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(dayIndex)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) =>
                      updateItineraryDay(dayIndex, "title", e.target.value)
                    }
                    placeholder="Day title"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <textarea
                    value={day.description}
                    onChange={(e) =>
                      updateItineraryDay(
                        dayIndex,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Day description"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Activities
                      </label>
                      <button
                        type="button"
                        onClick={() => addItineraryActivity(dayIndex)}
                        className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm transition-colors"
                      >
                        + Add Activity
                      </button>
                    </div>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) =>
                            updateItineraryActivity(
                              dayIndex,
                              activityIndex,
                              e.target.value
                            )
                          }
                          placeholder="Activity"
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {day.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newItinerary = [...formData.itinerary];
                              newItinerary[dayIndex].activities =
                                day.activities.filter(
                                  (_, i) => i !== activityIndex
                                );
                              setFormData((prev) => ({
                                ...prev,
                                itinerary: newItinerary,
                              }));
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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

          {/* Available Dates */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Dates
              </h2>
              <button
                type="button"
                onClick={addAvailableDate}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Add Date
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.availableDates.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateAvailableDate(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAvailableDate(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Active (visible to customers)
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/manage-tours"
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Tour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
