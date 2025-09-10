// src/components/common/Sidebar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  User,
  LogOut,
  List,
  User2,
  Car,
  Package,
  Torus,
  Hotel,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Sidebar should only render for "admin"
  if (status !== "authenticated" || session?.user?.role !== "admin") {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsUserMenuOpen(false);
  };

  return (
    <div className="h-full w-full bg-gray-900 text-gray-100 flex flex-col shadow-xl border-r border-gray-700">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex flex-col min-w-0 flex-1">
          <Image
            src="/renuka-world-logo-removebg-preview.png"
            alt="LogoHeader"
            height={100}
            width={100}
          />
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors 
              justify-between"
            }`}
          >
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div className="ml-3 text-left min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">
                  {session?.user?.name || "admin"}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative`}
        >
          <Home size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        <Link
          href="/add-services"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative `}
        >
          <List size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Add Services</span>
        </Link>

        <Link
          href="/add-tour"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative `}
        >
          <Torus size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Add Tour</span>
        </Link>
        <Link
          href="/add-package"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative `}
        >
          <Package size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Add Package</span>
        </Link>
        <Link
          href="/add-rental-service"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative`}
        >
          <Car size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Rental Service</span>
        </Link>

        <Link
          href="/add-hotel"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative`}
        >
          <Hotel size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Add Hotel</span>
        </Link>
        <Link
          href="/add-resort"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative`}
        >
          <Hotel size={20} className="flex-shrink-0" />

          <span className="text-sm font-medium">Add Resort</span>
        </Link>

        <Link
          href="/profile"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative`}
        >
          <User2 size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </nav>

      {/* Footer - Quick Actions */}

      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        {/* Section Title */}
        <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Quick Actions
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex justify-center bg-red-500 items-center gap-2 w-full px-4 py-2 rounded-lg text-white hover:cursor-pointer hover:text-red-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>

        {/* View Site Button */}
        <Link
          href="/"
          className="mt-3 block w-full px-4 py-2 text-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          View Site as User
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
