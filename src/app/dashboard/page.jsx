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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
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
  Eye,
  Activity,
  Palmtree,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

const COLORS = [
  "#4299E1",
  "#48BB78",
  "#9F7AEA",
  "#ED8936",
  "#F56565",
  "#38B2AC",
];

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
    totalResorts: 0,
    totalUsers: 0,
  });
  const [recentItems, setRecentItems] = useState({
    services: [],
    tours: [],
    packages: [],
    rentals: [],
    hotels: [],
    resorts: [],
  });

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
      const [
        servicesRes,
        toursRes,
        packagesRes,
        rentalsRes,
        hotelsRes,
        resortsRes,
      ] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/tours"),
        fetch("/api/packages"),
        fetch("/api/rental-services"),
        fetch("/api/hotels"),
        fetch("/api/resorts"),
      ]);

      const [services, tours, packages, rentals, hotels, resorts] =
        await Promise.all([
          servicesRes.json(),
          toursRes.json(),
          packagesRes.json(),
          rentalsRes.json(),
          hotelsRes.json(),
          resortsRes.json(),
        ]);

      // Update stats
      setStats({
        totalServices: services.data?.length || 0,
        totalTours: tours.data?.length || 0,
        totalPackages: packages.data?.length || 0,
        totalRentals: rentals.data?.length || 0,
        totalHotels: hotels.data?.length || 0,
        totalResorts: resorts.data?.length || 0,
        totalUsers: 0, // You can add users endpoint later
      });

      // Get recent items (last 5 of each)
      setRecentItems({
        services: services.data?.slice(0, 5) || [],
        tours: tours.data?.slice(0, 5) || [],
        packages: packages.data?.slice(0, 5) || [],
        rentals: rentals.data?.slice(0, 5) || [],
        hotels: hotels.data?.slice(0, 5) || [],
        resorts: resorts.data?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: "Services", value: stats.totalServices, color: COLORS[0] },
    { name: "Tours", value: stats.totalTours, color: COLORS[1] },
    { name: "Packages", value: stats.totalPackages, color: COLORS[2] },
    { name: "Rentals", value: stats.totalRentals, color: COLORS[3] },
    { name: "Hotels", value: stats.totalHotels, color: COLORS[4] },
    { name: "Resorts", value: stats.totalResorts, color: COLORS[5] },
  ].filter((item) => item.value > 0);

  const barData = [
    { name: "Services", count: stats.totalServices, fill: COLORS[0] },
    { name: "Tours", count: stats.totalTours, fill: COLORS[1] },
    { name: "Packages", count: stats.totalPackages, fill: COLORS[2] },
    { name: "Rentals", count: stats.totalRentals, fill: COLORS[3] },
    { name: "Hotels", count: stats.totalHotels, fill: COLORS[4] },
    { name: "Resorts", count: stats.totalResorts, fill: COLORS[5] },
  ];

  const totalItems =
    stats.totalServices +
    stats.totalTours +
    stats.totalPackages +
    stats.totalRentals +
    stats.totalHotels +
    stats.totalResorts;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    gradient,
    href,
    trend,
  }) => (
    <div
      className={`bg-gradient-to-r ${gradient} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {/* {trend && (
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )} */}
        </div>
        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      {href && (
        <div className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center text-white/90 hover:text-white text-sm font-medium transition-colors"
          >
            Manage →
          </Link>
        </div>
      )}
    </div>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-l-current hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className={`p-3 rounded-lg ${color} mb-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-blue-500">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Here's an overview of your travel business performance
            </p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Listings"
            value={totalItems}
            subtitle="Active items"
            icon={Activity}
            color="bg-blue-500"
          />
          <MetricCard
            title="Total Bookings"
            value="0"
            subtitle="Coming soon"
            icon={TrendingUp}
            color="bg-green-500"
          />
          <MetricCard
            title="Total Revenue"
            value="₹0"
            subtitle="Coming soon"
            icon={IndianRupee}
            color="bg-purple-500"
          />
          <MetricCard
            title="Active Users"
            value="0"
            subtitle="Coming soon"
            icon={Users}
            color="bg-indigo-500"
          />
        </div>

        {/* Service Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Services"
            value={stats.totalServices}
            icon={List}
            gradient="from-blue-500 to-blue-600"
            href="/manage-services"
            trend="+12% this month"
          />
          <StatCard
            title="Tours"
            value={stats.totalTours}
            icon={MapPin}
            gradient="from-green-500 to-green-600"
            href="/manage-tours"
            trend="+8% this month"
          />
          <StatCard
            title="Packages"
            value={stats.totalPackages}
            icon={Package}
            gradient="from-purple-500 to-purple-600"
            href="/manage-packages"
            trend="+15% this month"
          />
          <StatCard
            title="Rentals"
            value={stats.totalRentals}
            icon={Car}
            gradient="from-orange-500 to-orange-600"
            href="/manage-rental-services"
            trend="+5% this month"
          />
          <StatCard
            title="Hotels"
            value={stats.totalHotels}
            icon={Hotel}
            gradient="from-red-500 to-red-600"
            href="/manage-hotels"
            trend="+10% this month"
          />
          <StatCard
            title="Resorts"
            value={stats.totalResorts}
            icon={Palmtree}
            gradient="from-teal-500 to-teal-600"
            href="/manage-resorts"
            trend="+20% this month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donut Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="h-6 w-6 text-blue-500" />
                  Content Distribution
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Distribution of your travel services
                </p>
              </div>
            </div>

            {totalItems > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} items`, name]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data available yet</p>
                  <p className="text-sm mt-1">
                    Add some services to see the chart
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                  Service Comparison
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Compare quantities across categories
                </p>
              </div>
            </div>

            {totalItems > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    formatter={(value, name) => [`${value} items`, "Count"]}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data available yet</p>
                  <p className="text-sm mt-1">
                    Add some services to see the comparison
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Area Chart for Trend Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                Growth Trends
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Track your business growth over time
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={[
                { month: "Jan", total: totalItems * 0.2 },
                { month: "Feb", total: totalItems * 0.4 },
                { month: "Mar", total: totalItems * 0.6 },
                { month: "Apr", total: totalItems * 0.8 },
                { month: "May", total: totalItems * 0.9 },
                { month: "Jun", total: totalItems },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Add Service",
                href: "/add-service",
                icon: List,
                color: "bg-blue-500",
              },
              {
                name: "Add Tour",
                href: "/add-tour",
                icon: MapPin,
                color: "bg-green-500",
              },
              {
                name: "Add Package",
                href: "/add-package",
                icon: Package,
                color: "bg-purple-500",
              },
              {
                name: "Add Rental",
                href: "/add-rental-service",
                icon: Car,
                color: "bg-orange-500",
              },
              {
                name: "Add Hotel",
                href: "/add-hotel",
                icon: Hotel,
                color: "bg-red-500",
              },
              {
                name: "Add Resort",
                href: "/add-resort",
                icon: Palmtree,
                color: "bg-teal-500",
              },
            ].map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
              >
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {action.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
