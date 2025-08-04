'use client';

import React from 'react';
import Image from 'next/image';

const VisualInsight: React.FC = () => {
  return (
    <section className="px-6 py-20 text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-3xl font-bold text-green-800 sm:text-4xl">
          Your NIMC Experience, Reimagined
        </h2>
        <p className="mb-8 max-w-2xl mx-auto text-gray-700 sm:text-lg">
          A glimpse into how Jubilee visualizes NIMC services, trends, and digital inclusion in motion.
        </p>

        {/* ✅ Attach onContextMenu here instead of on Image */}
        <div onContextMenu={(e) => e.preventDefault()}>
          <Image
            src="https://cdn.prod.website-files.com/5bff8886c3964a992e90d465/5c006187d9549d3368158d3d_mixes.gif"
            alt="Jubilee Visualization Demo"
            width={800}
            height={400}
            className="pointer-events-none select-none"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};

export default VisualInsight;
