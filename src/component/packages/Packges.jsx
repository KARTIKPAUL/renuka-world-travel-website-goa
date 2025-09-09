import React from "react";
import Image from "next/image";
import Link from "next/link";
import Img01 from "../../assets/images/tour-img01.jpg";
import Img02 from "../../assets/images/tour-img02.jpg";
import Img03 from "../../assets/images/tour-img03.jpg";
import Img04 from "../../assets/images/tour-img04.jpg";
import Img05 from "../../assets/images/tour-img05.jpg";
import { FaPlane } from "react-icons/fa";

// Icons

const HotelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
    <path d="M1 21h22"></path>
    <path d="M8 7h8"></path>
    <path d="M8 11h8"></path>
    <path d="M8 15h8"></path>
  </svg>
);

const TransportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"></path>
    <path d="M6 9h11"></path>
  </svg>
);

const StarFilled = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="orange"
    stroke="orange"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const StarHalf = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="orange"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
    <path d="M12 17.75l0 -14"></path>
    <path
      fill="orange"
      d="M12 3.75 L12 17.75 L5.828 21 L7 14.12 L2 9.25 L8.9 8.25 L12 3.75 z"
    ></path>
  </svg>
);

// Tour package card component
const TourPackageCard = ({
  image,
  price,
  duration,
  people,
  location,
  title,
  rating,
  reviews,
}) => {
  return (
    <div className="border border-yellow-400 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Tour image */}
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />

        {/* Price tag */}
        <div className="absolute top-2 left-2 bg-red-400 text-white px-3 py-1 rounded-md text-sm font-medium">
          ₹{price} / per person
        </div>

        {/* Tour details banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm flex items-center justify-between">
          <span>
            {duration} | People: {people}
          </span>
          <span>| {location}</span>
        </div>
      </div>

      {/* Tour info */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{title}</h3>

        {/* Ratings */}
        <div className="flex items-center mb-1">
          <div className="flex space-x-1 mr-2">
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarHalf />
          </div>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        {/* Tour details */}
        <div className="text-sm text-gray-600 mb-3">
          {duration} | People: {people} | {location}
        </div>

        <hr className="my-3" />

        {/* Amenities */}
        <div className="flex items-center justify-start space-x-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <FaPlane /> <span>Flight</span>
          </div>
          <div className="flex items-center space-x-1">
            <HotelIcon /> <span>Hotels</span>
          </div>
          <div className="flex items-center space-x-1">
            <TransportIcon /> <span>Transport</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center text-sm">
            Book Now <span className="ml-1">→</span>
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center text-sm">
            Wish List <span className="ml-1">♡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Tour packages section component
const Packages = () => {
  // Sample tour package data
  const tourPackages = [
    {
      id: 1,
      image: Img01,
      price: "6,499",
      duration: "4D/3N",
      people: "2",
      location: "North Goa",
      title: "Beachside Bliss in North Goa",
      rating: 4.5,
      reviews: 112,
    },
    {
      id: 2,
      image: Img02,
      price: "7,999",
      duration: "5D/4N",
      people: "4",
      location: "South Goa",
      title: "Luxury Retreat in South Goa",
      rating: 4.8,
      reviews: 78,
    },
    {
      id: 3,
      image: Img03,
      price: "5,499",
      duration: "3D/2N",
      people: "2",
      location: "Baga Beach",
      title: "Adventure Escape at Baga Beach",
      rating: 4.6,
      reviews: 135,
    },
    {
      id: 4,
      image: Img04,
      price: "8,299",
      duration: "6D/5N",
      people: "5",
      location: "Panaji",
      title: "Cultural & Heritage Tour in Panaji",
      rating: 4.7,
      reviews: 52,
    },
    {
      id: 5,
      image: Img05,
      price: "6,999",
      duration: "4D/3N",
      people: "3",
      location: "Anjuna",
      title: "Chill Vibes at Anjuna & Vagator",
      rating: 4.4,
      reviews: 89,
    },
    {
      id: 6,
      image: Img01,
      price: "9,499",
      duration: "7D/6N",
      people: "6",
      location: "North & South Goa",
      title: "Complete Goa Tour (North & South)",
      rating: 4.9,
      reviews: 103,
    },
    {
      id: 7,
      image: Img02,
      price: "4,999",
      duration: "3D/2N",
      people: "2",
      location: "Candolim",
      title: "Relaxing Escape to Candolim",
      rating: 4.3,
      reviews: 67,
    },
    {
      id: 8,
      image: Img03,
      price: "7,199",
      duration: "5D/4N",
      people: "4",
      location: "Goa (Mixed)",
      title: "Family Holiday Special",
      rating: 4.6,
      reviews: 91,
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Section heading */}
      {/* <div className="text-center mb-8">
        <p className="text-pink-500 italic font-script mb-2">Our Best Tour Packages</p>
        <h2 className="text-3xl font-bold text-gray-800">We Offer Our Best Packages</h2>
      </div> */}

      <div className="mb-16 flex flex-col text-center">
        <h3 className="mb-2 text-lg uppercase text-[#faa935]">
          What We Provide
        </h3>
        <h3 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
          This is the things We provide
        </h3>
      </div>

      {/* Tour packages grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tourPackages.map((tour) => (
          <TourPackageCard key={tour.id} {...tour} />
        ))}
      </div>
    </section>
  );
};

export default Packages;
