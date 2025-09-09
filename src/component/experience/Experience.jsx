import React from "react";
import Image from "next/image";
import Link from "next/link";
import experienceImage from "../../assets/images/experience.png";

const Experience = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-16 flex flex-col text-center">
        <h3
          className="mb-2 text-lg uppercase text-[#faa935]"
        >
          Experience
        </h3>
        <h3 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
          Check Our Experience Section
        </h3>
      </div>
      {/* Main hero content */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Left side content */}
        <div className="lg:w-1/2">
          {/* Styled tagline */}
          {/* <div className="mb-6">
            <div className="bg-orange-400 text-orange-900 px-6 py-2 inline-block rounded-full italic font-script text-xl">
              Embrace Goa: Our Presence in Paradise
            </div>
          </div> */}

          {/* Main heading */}
          <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6">
            Connecting You to Goa's Essence,
            <br />
            One Experience at a Time
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            our vibrant presence in the heart of Goa! At Goa Explorer, we're
            more than just a travel company. we're your gateway to experiencing
            the soul of this beautiful destination. Through our carefully
            curated experiences, personalized services, and passionate team, we
            strive to connect you with the essence of Goa.
          </p>

          {/* Stats */}
          <div className="flex justify-between max-w-md mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-orange-500 text-white text-2xl font-bold px-6 py-3 rounded-md">
                12k+
              </div>
              <p className="text-gray-600 mt-2">Successful Trips</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-orange-500 text-white text-2xl font-bold px-6 py-3 rounded-md">
                2k+
              </div>
              <p className="text-gray-600 mt-2">Regular Clients</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-orange-500 text-white text-2xl font-bold px-6 py-3 rounded-md">
                15+
              </div>
              <p className="text-gray-600 mt-2">Years Experience</p>
            </div>
          </div>
        </div>

        {/* Right side image with larger size and exact positioning */}
        <div className="lg:w-1/2 relative">
          <div className="relative w-full h-full min-h-[500px]">
            {/* Main circular orange background */}
            <div className="w-full h-full absolute">
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] bg-orange-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Person with luggage image - larger and better positioned */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative w-full h-full">
                <Image
                  src={experienceImage}
                  alt="Travel Guide"
                  layout="fill"
                  objectFit="contain"
                  className="scale-110" // Make image slightly larger
                />
              </div>
            </div>

            {/* Small mountain photo in bottom right */}
            {/* <div className="absolute bottom-0 right-8 z-20">
              <div className="bg-white p-1 rounded-lg shadow-md">
                <Image
                  src="/images/mountain-thumbnail.jpg"
                  alt="Mountain View"
                  width={120}
                  height={90}
                  className="rounded-md"
                />
              </div>
            </div> */}

            {/* Photo gallery circles in bottom right */}
            {/* <div className="absolute bottom-0 right-0 z-20">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
                  >
                    <Image
                      src={`/images/gallery-${item}.jpg`}
                      alt={`Gallery ${item}`}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* Dotted path decoration */}
            <svg
              className="absolute top-1/4 right-0 z-0"
              width="200"
              height="150"
              viewBox="0 0 200 150"
            >
              <path
                d="M10,75 Q75,10 140,75 T270,75"
                fill="none"
                stroke="#FFC5B6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
