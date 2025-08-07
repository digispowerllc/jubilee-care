"use client";

import React from "react";

interface StatProps {
  label: string;
  value: string;
  color: string;
}

const CircularStat: React.FC<StatProps> = ({ label, value, color }) => (
  <div className="text-center">
    <div className="text-2xl font-bold" style={{ color }}>
      {value}
    </div>
    <div className="mt-1 text-sm text-gray-600">{label}</div>
  </div>
);

const ImpactSection: React.FC = () => {
  return (
    <section className="bg-white px-6 py-20 text-center">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold text-green-800 sm:text-4xl lg:text-5xl">
          Jubilee Care & NIMC Impact
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 sm:text-lg">
          Delivering secure identity services and digital inclusion across
          Nigeria.
        </p>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          <CircularStat label="Enrollments" value="86k+" color="#16A34A" />
          <CircularStat label="Slip Reprints" value="120k+" color="#2563EB" />
          <CircularStat label="Verifications" value="320k+" color="#FF9B21" />
          <CircularStat
            label="Assisted Citizens"
            value="123k+"
            color="#DC2626"
          />
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
