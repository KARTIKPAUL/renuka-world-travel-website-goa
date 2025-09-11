"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Users,
  Fuel,
  Settings,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RentalDetail({ params }) {
  const router = useRouter();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rental-services/${params.id}`);
        const json = await res.json();
        if (json.success) setRental(json.data);
        else {
          toast.error("Not found");
          router.push("/manage-rental-services");
        }
      } catch {
        toast.error("Failed to load");
        router.push("/manage-rental-services");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }
  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Not Found</h2>
          <Link
            href="/manage-rental-services"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

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
            href={`/edit-rental-service/${rental._id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Edit className="mr-2" />
            Edit
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="relative h-96 bg-gradient-to-r from-orange-400 to-red-500">
            {rental.images?.[0] ? (
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
          </div>
          {/* Details */}
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{rental.name}</h2>
            <div className="text-sm text-gray-600">
              {rental.brand && `${rental.brand} `} {rental.model}{" "}
              {rental.year && `(${rental.year})`}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Users /> {rental.capacity.seating} seats
              {rental.capacity.luggage &&
                ` · ${rental.capacity.luggage} luggage`}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Fuel /> {rental.fuelType}
              <Settings /> {rental.transmission}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="text-3xl font-bold">
              ₹{rental.pricing.fullDay} / day
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Book Now
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="text-sm text-gray-600 space-y-2">
              {rental.documents.licenseRequired && (
                <div>🪪 License required</div>
              )}
              <div>Age: {rental.documents.ageLimit}+</div>
              {rental.documents.deposit && (
                <div>Deposit: ₹{rental.documents.deposit}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
