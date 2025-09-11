"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Star,
  MapPin,
  Bed,
  Phone,
  Calendar,
} from "lucide-react";

import toast from "react-hot-toast";

export default function ResortDetailPage({ params }) {
  const router = useRouter();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/resorts/${params.id}`);
        const json = await res.json();
        if (json.success) setResort(json.data);
        else {
          toast.error("Not found");
          router.push("/manage-resorts");
        }
      } catch {
        toast.error("Failed to load");
        router.push("/manage-resorts");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  if (!resort)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Resort Not Found</h2>
          <Link
            href="/manage-resorts"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <Link
            href={`/edit-resort/${resort._id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Edit className="mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="relative h-96 bg-gradient-to-r from-teal-400 to-blue-500">
            {resort.images?.[0] ? (
              <img
                src={resort.images[0]}
                alt={resort.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                No Image
              </div>
            )}
          </div>
          {/* About */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">About this Resort</h2>
            <p className="text-gray-700">{resort.description}</p>
          </div>
          {/* Amenities */}
          {resort.amenities?.length > 0 && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {resort.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl font-bold">₹{resort.minPrice}</div>
            <p className="text-gray-600">per night</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Book Now
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <MapPin className="mr-2" /> {resort.location.city},{" "}
                {resort.location.state}
              </div>
              <div className="flex items-center">
                <Star className="mr-2" /> {resort.starRating} Star
              </div>
              <div className="flex items-center">
                <Bed className="mr-2" /> {resort.totalRooms} rooms
              </div>
              <div className="flex items-center">
                <Phone className="mr-2" /> {resort.contact.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
