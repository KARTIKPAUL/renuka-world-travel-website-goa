import React from "react";
import worldImg from "../../assets/images/world.png";
import logo1 from "../../assets/images/logo1.png";
import Newsletter from "../NewLetter/Newsletter";

import Image from "next/image";
import Experience from "../experience/Experience";
import Services from "../Services/Service";

const About = () => {
  return (
    <>
      <section className="py-12 bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="order-1 md:order-none">
              <div className="flex items-center gap-3 mb-6">
                {/* <Subtitle subtitle="About Us" /> */}
                <Image
                  src={worldImg}
                  alt="world icon"
                  className="w-8 h-8 object-contain animate-pulse"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Traveling Opens The Door To Creating{" "}
                <span className="text-[#faa935]">Memories</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-8">
                Discover the world's wonders with us. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Phasellus tempus massa vitae
                elit consectetur, ut convallis massa ultricies. Duis hendrerit
                turpis quis tincidunt lobortis.
              </p>
            </div>

            {/* Image Section */}
            <div className="relative group flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <Image
                  src={logo1}
                  alt="Travel illustration"
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Services />
      <Experience />

      <Newsletter />
    </>
  );
};

export default About;
