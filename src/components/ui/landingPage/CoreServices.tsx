"use client";

import React from "react";
import {
  FiUserCheck,
  FiShield,
  FiBookOpen,
  FiBriefcase,
  FiAward,
  FiUsers,
  FiGlobe,
  FiHeart,
} from "react-icons/fi";

const CoreServices: React.FC = () => {
  const services = [
    {
      icon: FiUserCheck,
      title: "NIN Enrollment",
      description:
        "Professional registration and updates for National Identification Numbers with secure data handling.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FiShield,
      title: "Verification Services",
      description:
        "Quick, secure identity verification across government and private sector platforms.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiBookOpen,
      title: "ICT Training",
      description:
        "Comprehensive digital literacy programs empowering communities through structured tech education.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FiBriefcase,
      title: "Digital Consultancy",
      description:
        "Expert guidance for institutions navigating digital transformation and identity management solutions.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: FiAward,
      title: "Certification",
      description:
        "Official recognition and certification for digital identity professionals and partners.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: FiUsers,
      title: "Community Outreach",
      description:
        "Grassroots initiatives bringing digital identity services to underserved communities.",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: FiGlobe,
      title: "National Coverage",
      description:
        "Expanding access to digital identity services across all Nigerian states and territories.",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: FiHeart,
      title: "Support Services",
      description:
        "Ongoing technical support and assistance for all our partners and community members.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section
      id="services"
      className="relative bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-20 lg:py-28"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWZhZjQiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-4">
            <FiAward className="mr-2 h-4 w-4" />
            Trusted Services
          </div>

          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Our <span className="text-green-600">Core Services</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 leading-relaxed">
            Delivering comprehensive digital identity and ICT solutions that
            empower Nigerians and transform communities through secure,
            accessible technology.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient accent */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.gradient}`}
              ></div>

              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6`}
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our network of certified agents and bring digital identity
              services to your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/agent/signup"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <FiUserCheck className="mr-2 h-5 w-5" />
                Become an Agent
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-green-600 px-8 py-3 text-base font-semibold text-green-700 hover:bg-green-50 transition-all"
              >
                <FiBriefcase className="mr-2 h-5 w-5" />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreServices;
