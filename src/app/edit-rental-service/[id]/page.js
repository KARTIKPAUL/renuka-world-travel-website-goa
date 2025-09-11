"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditRentalPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    /* initialize all fields as in add */
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }
  if (!session || session.user.role !== "admin") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rental-services/${params.id}`);
        const json = await res.json();
        if (json.success) {
          const r = json.data;
          setFormData({
            name: r.name,
            category: r.category,
            brand: r.brand || "",
            model: r.model,
            year: r.year?.toString() || "",
            capacity: {
              seating: r.capacity.seating.toString(),
              luggage: r.capacity.luggage || "",
            },
            features: r.features.length ? r.features : [""],
            fuelType: r.fuelType,
            transmission: r.transmission,
            pricing: {
              hourly: r.pricing.hourly?.toString() || "",
              halfDay: r.pricing.halfDay?.toString() || "",
              fullDay: r.pricing.fullDay?.toString() || "",
              weekly: r.pricing.weekly?.toString() || "",
              monthly: r.pricing.monthly?.toString() || "",
            },
            availability: r.availability.length
              ? r.availability.map((av) => ({
                  date: new Date(av.date).toISOString().split("T")[0],
                  available: av.available,
                }))
              : [],
            images: r.images.length ? r.images : [""],
            documents: r.documents,
            location: {
              pickupPoints: r.location.pickupPoints.length
                ? r.location.pickupPoints
                : [""],
              dropPoints: r.location.dropPoints.length
                ? r.location.dropPoints
                : [""],
            },
            isActive: r.isActive,
          });
        } else {
          toast.error("Not found");
          router.push("/manage-rental-services");
        }
      } catch (e) {
        console.error(e);
        toast.error("Load error");
        router.push("/manage-rental-services");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, router]);

  const handleInput = (e) => {
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

  // include array handlers for features, pricing, availability, images, pickup/drop points

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/rental-services/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (json.success) {
        toast.success("Updated");
        router.push("/manage-rental-services");
      } else {
        toast.error(json.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/manage-rental-services"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" />
            Back
          </Link>
          <h2 className="text-2xl font-bold">Edit Rental</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Copy all fields from AddRentalService: name, category, brand, model, year, capacity, features, pricing, availability, images, documents, location, status */}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50 flex items-center justify-center"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
