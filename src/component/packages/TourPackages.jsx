import React from "react";
import {
  FaClock,
  FaListAlt,
  FaMoneyBillAlt,
  FaHandshake,
} from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";

function TourPackages() {
  const activityData = [
    {
      icon: <FaClock className="text-4xl text-blue-600" />,
      title: "Save Time",
      content:
        "No need to surf Multiple Sites for packages, quotes, travel plans",
    },
    {
      icon: <FaListAlt className="text-4xl text-green-600" />,
      title: "Multiple Options",
      content:
        "Get Multiple Itineraries & Personalised Suggestions from our Travel agents",
    },
    {
      icon: <FaMoneyBillAlt className="text-4xl text-purple-600" />,
      title: "SAVE MONEY",
      content: "Compare, Negotiate & Choose the best from multiple options",
    },
    {
      icon: <FaHandshake className="text-4xl text-orange-600" />,
      title: "TRUSTED NETWORK",
      content: "Of 500+ Hotels Reliable & Authentic Travel Guides in Goa",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Customize & Book Festive
          </h3>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Goa Tour Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the best in travel with our Best Holiday Packages to Top Notch Destinations. 
            Don't miss out on these exclusive deals!
          </p>
        </div> */}

        <div className="mb-16 flex flex-col text-center">
          <h3 className="mb-2 text-lg uppercase text-[#faa935]">
            Customize & Book Festive
          </h3>
          <h3 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
            Goa Tour Packages
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activityData.map((activity, index) => (
            <div
              key={index}
              className="bg-white border border-yellow-400 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                {activity.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {activity.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TourPackages;
