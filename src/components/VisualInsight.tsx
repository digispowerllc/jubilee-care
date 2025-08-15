"use client";

import React from "react";
import Image from "next/image";

const VisualInsight: React.FC = () => {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto max-w-7xl flex flex-col items-center text-center">
        <h2 className="mb-6 text-2xl font-bold text-green-800 sm:text-4xl lg:text-5xl">
          Your NIMC Experience, Reimagined
        </h2>
        <p className="mb-8 max-w-3xl text-gray-700 sm:text-lg">
          A glimpse into how Jubilee visualizes NIMC services, trends, and
          digital inclusion in motion.
        </p>

        {/* Image wrapper prevents right-click */}
        <div
          className="w-full flex justify-center"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image
            src="https://cdn.prod.website-files.com/5bff8886c3964a992e90d465/5c006187d9549d3368158d3d_mixes.gif"
            alt="Jubilee Visualization Demo"
            width={800}
            height={400}
            className="pointer-events-none select-none max-w-full h-auto"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};

export default VisualInsight;
