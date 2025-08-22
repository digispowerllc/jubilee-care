"use client";

import React from "react";
import {
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiUsers,
  FiMapPin,
  FiAward,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";

interface StatProps {
  label: string;
  value: string;
  color: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatProps> = ({ label, value, color, icon: Icon }) => {
  return (
    <div className="text-center group">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="h-8 w-8" />
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">and counting</div>
    </div>
  );
};

const ImpactSection: React.FC = () => {
  const mainStats = [
    {
      label: "Enrollments",
      value: "86k+",
      color: "#16A34A",
      icon: FiUser,
    },
    {
      label: "Slip Reprints",
      value: "120k+",
      color: "#2563EB",
      icon: FiFileText,
    },
    {
      label: "Verifications",
      value: "320k+",
      color: "#FF9B21",
      icon: FiCheckCircle,
    },
    {
      label: "Assisted Citizens",
      value: "123k+",
      color: "#DC2626",
      icon: FiUsers,
    },
  ];

  const additionalStats = [
    { icon: FiMapPin, label: "States Covered", value: "36+", color: "#9333EA" },
    {
      icon: FiAward,
      label: "Certified Agents",
      value: "2.5k+",
      color: "#0891B2",
    },
    {
      icon: FiTrendingUp,
      label: "Success Rate",
      value: "98%",
      color: "#16A34A",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-50 px-6 py-16 lg:py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 mb-4">
            <FiTrendingUp className="mr-2 h-3 w-3" />
            Making an Impact
          </div>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our <span className="text-green-600">National Impact</span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 leading-relaxed">
            Transforming digital identity access across Nigeria with secure,
            reliable, and community-focused services that make a real
            difference.
          </p>
        </div>

        {/* Main stats with icons only */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {mainStats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Additional stats */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg border border-green-100">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            Nationwide Coverage & Excellence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-100 text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 mx-auto">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact statement */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-600 rounded-xl p-8 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4 mx-auto">
              <FiGlobe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              Building a Digitally Inclusive Nigeria
            </h3>
            <p className="text-green-100 max-w-3xl mx-auto">
              Through our partnership with NIMC, we&#39;re bridging the digital
              divide and ensuring every Nigerian has access to secure identity
              services, empowering communities and driving national development.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default ImpactSection;
