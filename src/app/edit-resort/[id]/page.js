"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditResortPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    /* all fields init like AddResort */
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
        const res = await fetch(`/api/resorts/${params.id}`);
        const json = await res.json();
        if (json.success) {
          const r = json.data;
          setFormData({
            name: r.name,
            description: r.description,
            location: {
              address: r.location.address,
              city: r.location.city,
              state: r.location.state,
              pincode: r.location.pincode || "",
              coordinates: {
                latitude: r.location.coordinates.latitude?.toString() || "",
                longitude: r.location.coordinates.longitude?.toString() || "",
              },
            },
            resortType: r.resortType,
            starRating: r.starRating.toString(),
            amenities: r.amenities.length ? r.amenities : [""],
            accommodation: r.accommodation.length
              ? r.accommodation.map((acc) => ({
                  type: acc.type,
                  capacity: acc.capacity.toString(),
                  price: acc.price.toString(),
                  amenities: acc.amenities,
                  images: acc.images,
                  available: acc.available.toString(),
                }))
              : [
                  {
                    type: "",
                    capacity: "",
                    price: "",
                    amenities: [""],
                    images: [""],
                    available: "1",
                  },
                ],
            activities: r.activities.length
              ? r.activities.map((a) => ({
                  name: a.name,
                  description: a.description,
                  price: a.price?.toString() || "",
                  duration: a.duration,
                  included: a.included,
                }))
              : [
                  {
                    name: "",
                    description: "",
                    price: "",
                    duration: "",
                    included: false,
                  },
                ],
            dining: r.dining.length
              ? r.dining.map((d) => ({
                  name: d.name,
                  cuisine: d.cuisine,
                  mealPlans: d.mealPlans,
                  price: d.price?.toString() || "",
                }))
              : [
                  {
                    name: "",
                    cuisine: "",
                    mealPlans: ["breakfast"],
                    price: "",
                  },
                ],
            images: r.images.length ? r.images : [""],
            policies: r.policies,
            contact: r.contact,
            seasons: r.seasons.length
              ? r.seasons.map((s) => ({
                  name: s.name,
                  startMonth: s.startMonth.toString(),
                  endMonth: s.endMonth.toString(),
                  priceMultiplier: s.priceMultiplier.toString(),
                  description: s.description,
                }))
              : [
                  {
                    name: "",
                    startMonth: "1",
                    endMonth: "12",
                    priceMultiplier: "1",
                    description: "",
                  },
                ],
            totalRooms: r.totalRooms?.toString() || "",
            availableRooms: r.availableRooms?.toString() || "",
            tags: r.tags.length ? r.tags : [""],
            isActive: r.isActive,
          });
        } else {
          toast.error("Resort not found");
          router.push("/manage-resorts");
        }
      } catch (e) {
        console.error(e);
        toast.error("Load failed");
        router.push("/manage-resorts");
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

  // Add similar array handlers (amenities, accommodation, etc.) as used for Tours/Services

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/resorts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (json.success) {
        toast.success("Resort updated");
        router.push("/manage-resorts");
      } else {
        toast.error(json.error || "Update failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating");
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <div className="flex items-center mb-6">
          <Link
            href="/manage-resorts"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" />
            Back
          </Link>
          <h2 className="text-2xl font-bold ml-4">Edit Resort</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Copy all form sections from AddResort: Basic Info, Location, Amenities, Accommodation, Activities, Dining, Policies, Images, Seasons, etc. */}

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
