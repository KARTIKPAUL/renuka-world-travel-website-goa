"use client";
import React, { useState } from "react";
import { CheckCircle } from "react-bootstrap-icons";
import { FiAlertCircle } from "react-icons/fi";
import { RiLoader2Fill } from "react-icons/ri";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // Clear status when user starts typing again
    if (submitStatus.isSuccess || submitStatus.isError) {
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: "",
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Client-side validation
    if (!trimmedEmail) {
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Please enter your email address",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Please enter a valid email address",
      });
      return;
    }

    setSubmitStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: "",
    });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: result.message,
        });

        // Reset email after successful subscription
        setEmail("");

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus((prev) => ({
            ...prev,
            isSuccess: false,
            message: "",
          }));
        }, 5000);
      } else {
        setSubmitStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="relative bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="pt-16 pb-16 px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#faa935]">
                Subscribe for Exclusive Updates
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Join our newsletter to receive the latest news, special offers,
                and travel inspiration from Cobham
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Success Message */}
              {submitStatus.isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm">
                    {submitStatus.message}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus.isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{submitStatus.message}</p>
                </div>
              )}

              {/* Newsletter Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#faa935]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-purple-100 focus:border-[#faa935] focus:ring focus:ring-[#faa935]/20 focus:ring-opacity-50 shadow-sm transition duration-300 text-gray-700 placeholder-gray-400"
                    disabled={submitStatus.isLoading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus.isLoading || !email.trim()}
                  className="bg-[#faa935] hover:bg-[#e8962f] disabled:bg-gray-400 text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center group min-w-[140px]"
                >
                  {submitStatus.isLoading ? (
                    <>
                      <RiLoader2Fill className="w-5 h-5 animate-spin mr-2" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Privacy Notice */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  We respect your privacy. Unsubscribe at any time.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  By subscribing, you agree to our{" "}
                  <a
                    href="/privacy-policy"
                    className="text-[#faa935] hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" className="text-[#faa935] hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>

              {/* Subscriber Count (Optional) */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  ✨ Join 1000+ travelers getting exclusive travel deals
                </p>
              </div>
            </div>
          </div>

          {/* Wave decoration at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0L60 20C120 40 240 80 360 80C480 80 600 40 720 26.7C840 13.3 960 26.7 1080 33.3C1200 40 1320 40 1380 40H1440V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                fill="rgba(236, 233, 252, 0.5)"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
