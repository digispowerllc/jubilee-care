"use client";

import React from "react";

const CoreServices: React.FC = () => {
  return (
    <section id="services" className="bg-gray-50 px-6 py-20 text-center">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold text-green-800">
          Our Core Services
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          We offer secure NIN enrollment, verification, training and digital
          support services across Nigeria.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Add your service cards here */}
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">
              NIN Enrollment
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Register and update National Identification Numbers.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">
              Verification
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Quick and secure identity verifications across platforms.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">
              ICT Training
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Empowering communities through structured tech programs.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">
              Consultancy
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Supporting institutions with digital transformation solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreServices;
