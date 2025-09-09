// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import Link from "next/link";
import {
  Users,
  Package,
  Car,
  Hotel,
  MapPin,
  List,
  TrendingUp,
  Calendar,
  IndianRupee,
} from "lucide-react";

const COLORS = ["#4299E1", "#48BB78", "#9F7AEA", "#ED8936", "#F56565"];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalTours: 0,
    totalPackages: 0,
    totalRentals: 0,
    totalHotels: 0,
    totalUsers: 0,
  });
  const [recentItems, setRecentItems] = useState({
    services: [],
    tours: [],
    packages: [],
    rentals: [],
    hotels: [],
  });

  const pieData = [
    { name: "Services", value: stats.totalServices },
    { name: "Tours", value: stats.totalTours },
    { name: "Packages", value: stats.totalPackages },
    { name: "Rentals", value: stats.totalRentals },
    { name: "Hotels", value: stats.totalHotels },
  ];

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats from all endpoints
      const [servicesRes, toursRes, packagesRes, rentalsRes, hotelsRes] =
        await Promise.all([
          fetch("/api/services"),
          fetch("/api/tours"),
          fetch("/api/packages"),
          fetch("/api/rental-services"),
          fetch("/api/hotels"),
        ]);

      const [services, tours, packages, rentals, hotels] = await Promise.all([
        servicesRes.json(),
        toursRes.json(),
        packagesRes.json(),
        rentalsRes.json(),
        hotelsRes.json(),
      ]);

      // Update stats
      setStats({
        totalServices: services.data?.length || 0,
        totalTours: tours.data?.length || 0,
        totalPackages: packages.data?.length || 0,
        totalRentals: rentals.data?.length || 0,
        totalHotels: hotels.data?.length || 0,
        totalUsers: 0, // You can add users endpoint later
      });

      // Get recent items (last 5 of each)
      setRecentItems({
        services: services.data?.slice(0, 5) || [],
        tours: tours.data?.slice(0, 5) || [],
        packages: packages.data?.slice(0, 5) || [],
        rentals: rentals.data?.slice(0, 5) || [],
        hotels: hotels.data?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, href }) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-l", "bg")
            .replace("-500", "-100")}`}
        >
          <Icon
            className={`h-8 w-8 ${color
              .replace("border-l", "text")
              .replace("-500", "-600")}`}
          />
        </div>
      </div>
      {href && (
        <div className="mt-3">
          <Link
            href={href}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View →
          </Link>
        </div>
      )}
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
        <div className="my-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your travel business from your admin dashboard
          </p>
        </div>
        {/* Performance Metrics (Placeholder for future implementation) */}
        <div className="my-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Total Services"
              value={stats.totalServices}
              icon={List}
              color="border-l-blue-500"
              href="/manage-services"
            />
            <StatCard
              title="Total Tours"
              value={stats.totalTours}
              icon={MapPin}
              color="border-l-green-500"
              href="/manage-tours"
            />
            <StatCard
              title="Total Packages"
              value={stats.totalPackages}
              icon={Package}
              color="border-l-purple-500"
              href="/manage-packages"
            />
            <StatCard
              title="Rental Services"
              value={stats.totalRentals}
              icon={Car}
              color="border-l-orange-500"
              href="/manage-rental-services"
            />
            <StatCard
              title="Total Hotels"
              value={stats.totalHotels}
              icon={Hotel}
              color="border-l-red-500"
              href="/manage-hotels"
            />
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Content Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [val, "Items"]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
