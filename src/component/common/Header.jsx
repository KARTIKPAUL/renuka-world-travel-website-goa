// src/components/common/Header.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't render Header for admins - they will use Sidebar instead
  if (status === "authenticated" && session?.user?.role === "admin") {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsUserMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const nav__links = [
    { path: "/offers", display: "Offers" },
    { path: "/gallery", display: "Gallery" },
    { path: "/about", display: "About" },
    { path: "/contact", display: "Contact" },
  ];

  return (
    <nav className="bg-[#a7d6f0] shadow-lg sticky top-0 z-50 border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMenus}
          >
            <div className="flex flex-col">
              <Image
                src="/logoHeader.webp"
                width={150}
                height={100}
                alt="logoHeader.webp"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="hidden lg:flex items-center gap-8">
              {nav__links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-gray-600 hover:text-primary transition-colors ${
                    pathname === link.path ? "text-primary font-semibold" : ""
                  }`}
                >
                  {link.display}
                </Link>
              ))}
            </nav>
            {/* Authentication Section */}
            {status === "authenticated" ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={closeMenus}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={closeMenus}
                      >
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 font-medium shadow-sm"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white min-h-screen min-w-full px-4 sm:px-6 lg:px-8">
            <div className="px-2 pt-4 pb-6 ">
              {/* Mobile Authentication */}
              {status === "authenticated" ? (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center px-4 py-2 text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={closeMenus}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                    onClick={closeMenus}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all font-medium text-center"
                    onClick={closeMenus}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
