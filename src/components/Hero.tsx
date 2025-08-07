"use client";

import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="bg-white px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-green-800 sm:text-4xl lg:text-5xl">
          NIMC Front-End Partner
        </h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Empowering Nigeria with digital identity and ICT innovation — one
          community at a time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/agent/signup"
            className="inline-block rounded-lg bg-green-700 px-8 py-3 text-white font-semibold shadow-sm hover:bg-green-800"
          >
            Get Started
          </a>
          <a
            href="#services"
            className="inline-block rounded-lg border border-green-700 px-8 py-3 text-green-700 font-semibold hover:bg-green-50"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
