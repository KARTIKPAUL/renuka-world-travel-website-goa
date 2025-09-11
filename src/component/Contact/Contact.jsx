"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import contactImage from "../../assets/images/contact.jpg";
import { CheckCircle, Send } from "react-bootstrap-icons";
import { IoAlertCircle } from "react-icons/io5";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    setSubmitStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: "",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: result.message,
        });

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <section className="py-16 bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 flex flex-col text-center">
          <h3 className="mb-2 text-lg uppercase text-[#faa935]">Contact</h3>
          <h3 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
            Any quires ? Fill This Form
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Image */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            <Image
              src={contactImage}
              alt="Contact illustration"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contact Form Section */}
          <div className="space-y-8">
            {/* Alert Message */}
            {alertVisible && (
              <div
                className={`p-4 rounded-lg flex items-center ${
                  alertType === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {alertType === "success" ? (
                  <FiCheckCircle className="w-5 h-5 mr-3" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 mr-3" />
                )}
                {alertMessage}
              </div>
            )}

            {/* Contact Form */}

            {/* Status Messages */}
            {submitStatus.isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700">{submitStatus.message}</p>
              </div>
            )}

            {submitStatus.isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <IoAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{submitStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1f6c35] focus:border-[#1f6c35] transition-colors text-[#777878] placeholder-[#777878]/50"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1f6c35] focus:border-[#1f6c35] transition-colors text-[#777878] placeholder-[#777878]/50"
                  required
                />
              </div>

              {/* Phone Input */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1f6c35] focus:border-[#1f6c35] transition-colors text-[#777878] placeholder-[#777878]/50"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1f6c35] focus:border-[#1f6c35] transition-colors text-[#777878] placeholder-[#777878]/50 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {submitStatus.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full..."></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send A Query</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
