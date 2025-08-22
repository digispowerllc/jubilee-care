"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEye, FiTrendingUp, FiUsers, FiShield, FiAward, FiPlay } from "react-icons/fi";

const VisualInsight: React.FC = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const features = [
    {
      id: "analytics",
      icon: FiTrendingUp,
      title: "Real-time Analytics",
      description: "Monitor enrollment trends and service performance with live dashboards"
    },
    {
      id: "community",
      icon: FiUsers,
      title: "Community Impact",
      description: "Track digital inclusion progress across different regions and demographics"
    },
    {
      id: "security",
      icon: FiShield,
      title: "Security First",
      description: "Advanced encryption and data protection for all NIMC services"
    },
    {
      id: "excellence",
      icon: FiAward,
      title: "Service Excellence",
      description: "Consistent high-quality service delivery metrics and performance indicators"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-20 lg:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <FiEye className="mr-2 h-4 w-4" />
            Interactive Insights
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Your NIMC Experience, <span className="text-green-600">Reimagined</span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 leading-relaxed">
            Discover how Jubilee Care transforms NIMC services with cutting-edge visualization, 
            real-time analytics, and community-focused digital inclusion initiatives.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
                activeTab === feature.id
                  ? "bg-white border-green-300 shadow-lg shadow-green-100 text-green-700"
                  : "bg-white/50 border-gray-200 hover:border-green-200 text-gray-600 hover:text-green-700"
              }`}
            >
              <feature.icon className="h-5 w-5" />
              <span className="font-medium">{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-green-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image/Visualization */}
            <div
              className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 z-10"></div>
              <Image
                src="https://cdn.prod.website-files.com/5bff8886c3964a992e90d465/5c006187d9549d3368158d3d_mixes.gif"
                alt="Jubilee Visualization Demo"
                width={600}
                height={400}
                className="w-full h-auto pointer-events-none select-none"
                unoptimized
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <FiPlay className="h-8 w-8 text-green-600 ml-1" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {features.find(f => f.id === activeTab)?.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {features.find(f => f.id === activeTab)?.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">98%</div>
                  <div className="text-sm text-green-600">Accuracy Rate</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">24/7</div>
                  <div className="text-sm text-emerald-600">Service Availability</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">45s</div>
                  <div className="text-sm text-green-600">Average Processing</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">99.9%</div>
                  <div className="text-sm text-emerald-600">Uptime</div>
                </div>
              </div>

              {/* Call to action */}
              <div className="pt-4">
                <a
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Explore Our Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Our visualization tools provide real-time insights into NIMC service delivery, 
            helping communities track progress and identify opportunities for digital inclusion.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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

export default VisualInsight;