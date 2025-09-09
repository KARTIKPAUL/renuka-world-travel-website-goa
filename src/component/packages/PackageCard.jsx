import React from "react";
import { CiPlane } from "react-icons/ci";
import { FaBusAlt , FaHotel } from "react-icons/fa";
import { FaArrowRight, FaHeart, FaStar } from "react-icons/fa";
import { BsStarFill } from "react-icons/bs";

const PackageCard = (props) => {
  const { price, duration, people, image, location, title, reviews } = props;

  // Render star rating
  const renderStars = (count = 5) => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <BsStarFill key={i} className="text-yellow-400 inline-block mr-1" />
      ));
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-full text-primary font-bold">
          ₹{price} <span className="text-sm font-normal">/ person</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{duration}</span>
            <span>•</span>
            <span>{people} People</span>
            <span>•</span>
            <span className="flex items-center">
              <CiPlane className="mr-1" /> {location}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

        <div className="flex items-center mb-4">
          {renderStars(4)}
          <span className="ml-2 text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <FaHotel className="mr-2 text-lg" />
            <span className="text-sm">5 Star Hotels</span>
          </div>
          <div className="flex items-center">
            <FaBusAlt className="mr-2 text-lg" />
            <span className="text-sm">AC Transport</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <button className="flex items-center bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            Book Now
            <FaArrowRight className="ml-2 text-sm" />
          </button>
          <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
            <FaHeart className="mr-2" />
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;