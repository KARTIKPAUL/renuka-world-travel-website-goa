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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Please enter your email address",
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
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: result.message,
        });

        // Reset email after successful subscription
        setEmail("");
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#faa935] ">
                Subscribe for Exclusive Updates
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Join our newsletter to receive the latest news, special offers,
                and travel inspiration from Cobham
              </p>
              {/* <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto"></div> */}
            </div>

            <div className="max-w-2xl mx-auto">
              {submitStatus.isSuccess && (
                <div className="bg-yellow-500 border border-green-400/30 rounded-lg p-3 flex items-center space-x-2 mb-4 ">
                  <CheckCircle className="w-4 h-4 text-[#faa935] flex-shrink-0" />
                  <p className="text-yellow-700 text-sm">
                    {submitStatus.message}
                  </p>
                </div>
              )}

              {submitStatus.isError && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 flex items-center space-x-2 mb-4">
                  <FiAlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
                  <p className="text-red-100 text-sm">{submitStatus.message}</p>
                </div>
              )}
              {/* <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
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
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 shadow-sm transition duration-300 text-gray-700 placeholder-gray-400"
                    placeholder="Your email address"
                    //value={email}
                    //onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#faa935] text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center group"
                >
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
                </button>
              </form> */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 shadow-sm transition duration-300 text-gray-700 placeholder-gray-400"
                    disabled={submitStatus.isLoading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus.isLoading || !email.trim()}
                  className="bg-[#777878] hover:bg-[#5a5b5b] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 min-w-[120px]"
                >
                  {submitStatus.isLoading ? (
                    <>
                      <RiLoader2Fill className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
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
