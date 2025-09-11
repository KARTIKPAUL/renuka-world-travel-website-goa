import { FaCarSide, FaPlane, FaUmbrellaBeach, FaCogs } from "react-icons/fa";
const Services = () => {
  return (
    <>
      <section className="mb-32">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-16 flex flex-col text-center">
            <h3 className="mb-2 text-lg uppercase text-[#faa935] ">Services</h3>
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
    </>
  );
};

export default Services;
