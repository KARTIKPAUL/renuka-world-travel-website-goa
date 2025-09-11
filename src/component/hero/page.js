"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaMap, FaSearchLocation } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { GiMoneyStack } from "react-icons/gi";
import { IoAirplane } from "react-icons/io5";
import { BsCalendar, BsPerson, BsPeople } from "react-icons/bs";
import Newsletter from "../newLetter/Newsletter";
import { FaCarSide, FaPlane, FaUmbrellaBeach, FaCogs } from "react-icons/fa";
import Experience from "../experience/Experience";
import Gallery from "../Gallery/Gallery";
import Testimonials from "../Testimonials/Testimonilas";
import Packages from "../Packages/Packges";
import TourPackages from "../Packages/TourPackages";
import FeaturedServices from "../FeaturedServices";

const Hero = () => {
  const Clients = [
    { image: "client-1.png", alt: "axon" },
    { image: "client-2.png", alt: "jet start" },
    { image: "client-3.png", alt: "expedia" },
    { image: "client-4.png", alt: "qantas" },
    { image: "client-5.png", alt: "alitalia" },
  ];
  return (
    <div className="">
      {/* Section Hero */}
      <section className="relative mb-28">
        <span className="absolute right-0 top-0 bottom-0 h-screen w-5/12 ">
          {/* <DecorHero className="fill-accent-3" /> */}
        </span>
        <div className="absolute -left-80 -top-10 h-[496px] w-[478px] rounded-full bg-accent-4/50 blur-3xl"></div>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex">
            <div className="w-full pt-10 md:pt-52 lg:w-6/12">
              <h1 className="mb-6 text-sm font-bold uppercase text-accent-2 lg:text-xl text-[#faa935]">
                Best Destinations around the world
              </h1>
              <h2 className="mb-8 font-serif text-4xl leading-tight tracking-tighter text-gray-900 lg:text-[84px] lg:leading-[89px]">
                Travel,{" "}
                <span className="relative">
                  enjoy
                  <span className="absolute top-full left-0 -z-10 -mt-3 -ml-4 lg:-mt-8">
                    {/* <DecorTextUnderlineHero className="h-1 w-[100px] fill-accent-2 lg:h-[12px] lg:w-[393px]" /> */}
                  </span>
                </span>
                and live a new and full life
              </h2>
              <p className="mb-8 max-w-lg text-sm leading-6 text-gray-500 lg:text-base lg:leading-8">
                🎉 Welcome to our vibrant corner of the internet, where the
                adventure begins! Dive into the heart of Goa's beauty and
                excitement with our interactive travel guide. 🗺️ From pristine
                beaches to bustling markets, ancient forts to lively nightlife,
                we've curated the ultimate experience for every traveler. 🏖️
                Choose your path, explore hidden gems, and create memories that
                will last a lifetime. Ready to embark on an unforgettable
                journey? Let's start exploring together! 🚀
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/offers"
                  className="flex items-center gap-2 bg-[#f1a501] px-6 py-4 text-white rounded-full hover:bg-[#e29400] transition-colors"
                >
                  <span>Find Out More</span>
                  <FaArrowRight className="text-sm" />
                </Link>

                {/* <Link
                  href="/your-link-2"
                  className="flex items-center gap-2 bg-[#df6951] px-6 py-4 text-white rounded-full hover:bg-[#ce5840] transition-colors"
                >
                  <span className="">Book Now</span>
                  <FaArrowRight className="text-sm" />
                </Link> */}
              </div>
            </div>
            <div className="relative hidden h-[764px] w-[783px] pt-24 lg:block">
              <div className="absolute top-44 left-40 z-30 h-[95px] w-[137px]">
                <Image
                  src="/images/plane.png"
                  layout="responsive"
                  width={100}
                  height={100}
                  alt="plane"
                />
              </div>
              <div className="absolute top-56 right-8 z-10 h-[95px] w-[137px]">
                <Image
                  src="/images/plane.png"
                  layout="responsive"
                  width={100}
                  height={100}
                  alt="plane"
                />
              </div>
              <div className="relative z-20 -translate-x-16 transform">
                <Image
                  src="/images/hero-traveller.png"
                  priority
                  layout="responsive"
                  width={100}
                  height={100}
                  alt="traveler"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Category */}
      <section className="mb-32">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-16 flex flex-col text-center">
            <h3 className="mb-2 text-lg uppercase text-[#faa935] font-semibold tracking-widest">
              Services
            </h3>
            <h2 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
              Discover Our Offerings
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Transportation Card */}
            <div className="group relative p-8 bg-white rounded-xl transition-all duration-300 border border-[#faa935]">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors duration-300">
                  <FaCarSide className="w-12 h-12 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">
                Transportation
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                From bikes to premium cars, choose your ideal ride for seamless
                travel across Goa's stunning landscapes and vibrant streets.
              </p>
            </div>

            {/* Flights Card */}
            <div className="group relative p-8 bg-white rounded-xl transition-all duration-300 border border-[#faa935]">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition-colors duration-300">
                  <FaPlane className="w-12 h-12 text-orange-600 transform group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">
                Flight Deals
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Discover exclusive flight offers connecting you to Goa's
                tropical paradise with comfort and convenience.
              </p>
            </div>

            {/* Tours Card */}
            <div className="group relative p-8 bg-white rounded-xl transition-all duration-300 border border-[#faa935]">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors duration-300">
                  <FaUmbrellaBeach className="w-12 h-12 text-green-600 transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">
                Hidden Gems
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Uncover Goa's best-kept secrets through our curated tours to
                secluded beaches and cultural landmarks.
              </p>
            </div>

            {/* Packages Card */}
            <div className="group relative p-8 bg-white rounded-xl transition-all duration-300 border border-[#faa935]">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors duration-300">
                  <FaCogs className="w-12 h-12 text-purple-600 transform group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">
                Custom Packages
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Tailor-made experiences combining adventure, relaxation, and
                culture - crafted uniquely for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature */}
      <FeaturedServices />

      {/* <Packages /> */}
      {/* <Packages /> */}

      {/* Section Experience */}
      <Experience />

      {/* Top Destinations Section */}
      {/* <TopDestination /> */}

      {/* Section Easy in Fast */}
      <div className="mb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-4">
          <div className="flex flex-wrap space-x-4 space-y-4 lg:space-y-0 lg:space-x-0">
            <div className="w-full pl-0 lg:w-6/12 lg:pl-6">
              <div className="mb-3 flex flex-col text-left lg:mb-16">
                <h3 className="mb-2 text-lg uppercase text-[#faa935]">
                  Easy in Fast
                </h3>
                <h3 className="mb-8 font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
                  Book your next trip in 3 easy steps
                </h3>
              </div>
              <ul className="flex flex-col gap-y-8 lg:gap-y-10">
                <li className="group flex items-start gap-x-6 p-6 transition-all hover:bg-gray-50 rounded-2xl">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-100">
                    <CiLocationOn className="text-2xl font-bold text-white transform transition-transform group-hover:scale-110" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h6 className="text-lg font-semibold text-gray-900 tracking-tight">
                      Choose Destination
                    </h6>
                    <p className="text-gray-500 leading-relaxed max-w-md">
                      Discover your perfect getaway from our curated list of
                      breathtaking locations. Select from tropical beaches to
                      mountain retreats.
                    </p>
                  </div>
                </li>

                <li className="group flex items-start gap-x-6 p-6 transition-all hover:bg-gray-50 rounded-2xl">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-100">
                    <GiMoneyStack className="text-2xl font-bold text-white transform transition-transform group-hover:scale-110" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h6 className="text-lg font-semibold text-gray-900 tracking-tight">
                      Secure Payment
                    </h6>
                    <p className="text-gray-500 leading-relaxed max-w-md">
                      Enjoy hassle-free transactions with our encrypted payment
                      gateway. Multiple payment options including credit cards
                      and digital wallets.
                    </p>
                  </div>
                </li>

                <li className="group flex items-start gap-x-6 p-6 transition-all hover:bg-gray-50 rounded-2xl">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-700 shadow-lg shadow-yellow-100">
                    <IoAirplane className="text-2xl font-bold text-white transform transition-transform group-hover:scale-110" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h6 className="text-lg font-semibold text-gray-900 tracking-tight">
                      Departure Preparation
                    </h6>
                    <p className="text-gray-500 leading-relaxed max-w-md">
                      Receive personalized travel documents and reminders. Our
                      24/7 support team ensures you're fully prepared for
                      departure.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex w-full items-center justify-center lg:w-6/12">
              <div className="relative w-full max-w-[370px]">
                {/* Floating profile card */}
                <div className="absolute -top-12 -right-4 z-30 w-[280px] transform rounded-2xl bg-white p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 lg:-right-8 lg:top-auto lg:bottom-24">
                  <div className="flex items-center">
                    <div className="relative mr-4 h-14 w-14 flex-none overflow-hidden rounded-full border-2 border-white shadow-md">
                      <Image
                        src="/images/destination-5.jpg"
                        layout="fill"
                        className="object-cover"
                        alt="Profile picture"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-400">
                        CURRENT TRIP
                      </span>
                      <h3 className="mt-1 text-lg font-semibold text-gray-800">
                        Rameswaram Explorer
                      </h3>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-600">
                            40% Completed
                          </span>
                          <span className="text-xs text-gray-400">
                            2 days left
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                            style={{ width: "40%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main card */}
                <div className="relative z-20 overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                  {/* Image with gradient overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      layout="fill"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      src="/images/destination-4.jpg"
                      alt="Kerala landscape"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent" />
                  </div>

                  {/* Card content */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">
                        Kerala
                      </h3>
                      {/* <button className="text-2xl text-rose-500 transition-colors hover:text-rose-600">
                        ♡
                      </button> */}
                    </div>

                    {/* Trip details */}
                    <div className="mb-4 flex items-center text-gray-600">
                      <span className="flex items-center">
                        <BsCalendar className="mr-2 text-lg" />
                        <span className="text-sm font-medium">14-29 June</span>
                      </span>
                      <span className="mx-3">•</span>
                      <span className="flex items-center">
                        <BsPerson className="mr-2 text-lg" />
                        <span className="text-sm font-medium">
                          Host: Nantu Ghatak
                        </span>
                      </span>
                    </div>

                    {/* Activity icons */}
                    <div className="mb-5 flex gap-3">
                      {[<FaMap />, <FaSearchLocation />].map((icon, index) => (
                        <div
                          key={index}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600"
                        >
                          <span className="material-icons text-lg">{icon}</span>
                        </div>
                      ))}
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BsPeople className="mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">
                          24 travelers joining
                        </span>
                      </div>
                      <span className="inline-flex h-8 items-center rounded-full bg-emerald-100 px-3 text-sm font-medium text-emerald-700">
                        ₹24,999
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 z-10 h-60 w-60 rounded-full bg-gradient-to-r from-emerald-100/40 to-cyan-100/40 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour packages */}
      <TourPackages />

      {/* Section Clients */}
      {/* <section className="mb-28">
        <div className="relative mx-auto max-w-full lg:max-w-7xl">
          <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-5 lg:gap-y-0 lg:gap-x-4">
            {Clients.map((item, idx) => (
              <div
                key={idx}
                className="relative h-20 transform rounded-2xl bg-white p-4 grayscale transition-all duration-300 hover:-translate-y-1 hover:shadow-great hover:grayscale-0"
              >
                <Image
                  src={`/images/${item.image}`}
                  alt={item.alt}
                  className="object-contain lg:object-none"
                  layout="fill"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Section Testimonial */}
      <Testimonials />

      {/* Gallery */}
      <Gallery />

      {/* Section News Letter */}

      <Newsletter />
    </div>
  );
};

export default Hero;
