"use client";
import MasonryImagesGallery from "@/component/gallery/MasonryImagesGallery";
import dynamic from "next/dynamic";

// const MasonryImagesGallery = dynamic(() => import("./MasonryImagesGallery"), {
//   ssr: false,
// });

export default function Gallery() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-16 flex flex-col text-center">
        <h3 className="mb-2 text-lg uppercase text-[#faa935]">Gallry</h3>
        <h3 className="font-serif text-4xl uppercase leading-tight text-gray-900 lg:text-5xl lg:leading-snug">
          Our Respondive Gallery Framework
        </h3>
      </div>

      {/* Now render the component safely */}
      <MasonryImagesGallery />
    </div>
  );
}
