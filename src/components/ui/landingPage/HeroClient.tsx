// src/components/HeroClient.tsx
"use client";

import React from "react";
import { FiUserPlus, FiLogIn, FiAward, FiUsers, FiGlobe } from "react-icons/fi";

const HeroClient: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-16 sm:py-24 lg:py-32 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-8">
            <FiAward className="mr-2 h-4 w-4" />
            Official NIMC Partner
          </div>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="block">NIMC Front-End</span>
            <span className="block text-green-600 mt-2">Partner Platform</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Empowering Nigeria with digital identity and ICT innovation —
            transforming communities through secure, accessible technology
            solutions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/agent/signup"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:from-green-700 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              <FiUserPlus className="mr-2 h-5 w-5" />
              Agent Onboarding
            </a>
            <a
              href="/agent/signin"
              className="inline-flex items-center justify-center rounded-xl border border-green-600 px-8 py-4 text-base font-semibold text-green-700 hover:bg-green-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              <FiLogIn className="mr-2 h-5 w-5" />
              Sign In
            </a>
          </div>
        </div>

        {/* Stats/Features */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Community Focused
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Serving local communities across Nigeria
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FiGlobe className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nationwide Reach
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Expanding digital identity access
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FiAward className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Certified Partner
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Official NIMC recognition
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

export default HeroClient;
