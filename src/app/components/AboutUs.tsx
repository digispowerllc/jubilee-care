"use client";

import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h3 className="mb-6 text-2xl font-bold text-green-800">Who We Are</h3>
        <p className="mx-auto max-w-3xl text-base text-gray-700 sm:text-lg">
          <span className="font-semibold text-green-700">
            Jubilee Care ICT Innovative Consult
          </span>{" "}
          is a forward-thinking digital identity and ICT firm, officially
          recognized as a
          <span className="font-medium text-green-600">
            {" "}
            NIMC Front-End Partner (FEP)
          </span>
          .
          <br className="hidden sm:block" />
          We deliver secure NIN enrollment, verification, and modification
          services — plus premium tech training and digital transformation for
          communities and institutions.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
