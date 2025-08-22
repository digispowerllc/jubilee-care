"use client";

import React from "react";
import { FiAward, FiUsers, FiTarget, FiHeart, FiShield, FiGlobe } from "react-icons/fi";

const AboutUs: React.FC = () => {
  const values = [
    {
      icon: FiShield,
      title: "Security First",
      description: "Prioritizing data protection and secure identity management"
    },
    {
      icon: FiUsers,
      title: "Community Focus",
      description: "Serving local communities with accessible digital solutions"
    },
    {
      icon: FiTarget,
      title: "Excellence",
      description: "Delivering high-quality services with precision and care"
    },
    {
      icon: FiHeart,
      title: "Empowerment",
      description: "Enabling Nigerians through digital inclusion and education"
    }
  ];

  return (
    <section id="about" className="relative bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-20 lg:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <FiAward className="mr-2 h-4 w-4" />
            Official NIMC Partner
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Who <span className="text-green-600">We Are</span>
          </h2>
          
          <p className="mx-auto mt-6 max-w-4xl text-lg text-gray-600 leading-relaxed">
            <span className="font-semibold text-green-700">
              Jubilee Care ICT Innovative Consult
            </span>{" "}
            is a forward-thinking digital identity and ICT firm, officially
            recognized as a{" "}
            <span className="font-medium text-green-600">
              NIMC Front-End Partner (FEP)
            </span>
            . We deliver secure NIN enrollment, verification, and modification
            services — plus premium tech training and digital transformation for
            communities and institutions across Nigeria.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6">
              <FiTarget className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To bridge the digital divide in Nigeria by providing accessible, secure, 
              and innovative identity solutions that empower individuals, communities, 
              and institutions through technology.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6">
              <FiGlobe className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be Nigeria's leading partner in digital identity transformation, 
              creating a future where every citizen has equal access to secure digital 
              services and opportunities for growth.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our <span className="text-green-600">Core Values</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-4 mx-auto group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                  <value.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Statement */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Making a Difference Across Nigeria
          </h3>
          <p className="text-green-100 max-w-3xl mx-auto">
            Through our partnership with NIMC, we're bringing digital identity services 
            to urban and rural communities alike, ensuring every Nigerian has access to 
            secure identification and the opportunities it unlocks.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 max-w-2xl mx-auto">
            <p className="text-gray-700 mb-4">
              Ready to partner with us or learn more about our services?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Get In Touch
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-all"
              >
                Explore Services
              </a>
            </div>
          </div>
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

export default AboutUs;