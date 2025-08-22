"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useState } from "react";
import { FiStar, FiDroplet } from "react-icons/fi";

const testimonials = [
  {
    name: "Amina L.",
    role: "Youth Leader, Imo State",
    text: "Jubilee Care has brought real ICT opportunities to our community.",
    avatar:
      "https://ui-avatars.com/api/?name=Amina+L&background=10B981&color=fff",
    rating: 5,
  },
  {
    name: "Tunde K.",
    role: "ICT Coordinator, Rivers State",
    text: "Their support for digital identity made our center more efficient and accessible to everyone in our community.",
    avatar:
      "https://ui-avatars.com/api/?name=Tunde+K&background=059669&color=fff",
    rating: 5,
  },
  {
    name: "Hamza E.",
    role: "Parent, Yobe State",
    text: "My children got their NINs easily thanks to Jubilee's outreach program. The process was smooth and professional.",
    avatar:
      "https://ui-avatars.com/api/?name=Hamza+E&background=065F46&color=fff",
    rating: 4,
  },
  {
    name: "Ezinne K.",
    role: "Health Worker, Abia State",
    text: "We now register health staff faster with Jubilee's assistance. Their digital solutions have transformed our operations.",
    avatar:
      "https://ui-avatars.com/api/?name=Ezinne+K&background=047857&color=fff",
    rating: 5,
  },
  {
    name: "Chijioke M.",
    role: "Community Organizer, Enugu State",
    text: "Their training programs are empowering our youth with real skills that lead to employment opportunities.",
    avatar:
      "https://ui-avatars.com/api/?name=Chijioke+M&background=10B981&color=fff",
    rating: 5,
  },
  {
    name: "Fatima S.",
    role: "Teacher, Kano State",
    text: "Jubilee Care's digital support has transformed our school's operations and improved our administrative efficiency.",
    avatar:
      "https://ui-avatars.com/api/?name=Fatima+S&background=059669&color=fff",
    rating: 4,
  },
  {
    name: "Emeka O.",
    role: "Local Business Owner, Lagos State",
    text: "Their NIN verification service has made my business more secure and streamlined our customer onboarding process.",
    avatar:
      "https://ui-avatars.com/api/?name=Emeka+O&background=065F46&color=fff",
    rating: 5,
  },
  {
    name: "Zainab R.",
    role: "Student, Kaduna State",
    text: "I got my NIN quickly and easily through Jubilee's outreach program. The staff were helpful and professional.",
    avatar:
      "https://ui-avatars.com/api/?name=Zainab+R&background=047857&color=fff",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWZhZjQiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative mx-auto max-w-7xl text-center">
        <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
          <FiDroplet className="mr-2 h-4 w-4" />
          Community Voices
        </div>

        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          What <span className="text-green-600">People Say</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Real stories from Nigerians impacted by Jubilee Care&#39;s ICT
          initiatives and digital identity services.
        </p>

        <div className="mt-12 mb-8 overflow-visible">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-green-600 !opacity-20",
              bulletActiveClass: "swiper-pagination-bullet-active !opacity-100",
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx} className="!h-auto">
                <div className="h-full px-2 sm:px-3 md:px-4 py-2">
                  <div
                    onMouseEnter={() => setActiveCard(idx)}
                    onMouseLeave={() => setActiveCard(null)}
                    onFocus={() => setActiveCard(idx)}
                    onBlur={() => setActiveCard(null)}
                    tabIndex={0}
                    className={`flex h-full flex-col justify-between rounded-2xl bg-white p-6 transition-all duration-300 ${
                      activeCard === idx
                        ? "shadow-xl scale-[1.02] translate-y-[-4px] ring-2 ring-green-300"
                        : "shadow-md hover:shadow-lg"
                    }`}
                  >
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <FiDroplet className="h-8 w-8 text-green-600" />
                    </div>

                    {/* Rating stars */}
                    <div className="flex mb-4">{renderStars(t.rating)}</div>

                    <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                    &quot;t.tst&quot;
                    </p>

                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        className="h-12 w-12 rounded-full ring-2 ring-green-100"
                        width={48}
                        height={48}
                        loading="lazy"
                        unoptimized
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-semibold text-green-800 truncate">
                          {t.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to action */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-green-100 max-w-2xl mx-auto">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-green-700">
              Join thousands of satisfied Nigerians
            </span>{" "}
            who have benefited from our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-green-700 transition-all"
            >
              Share Your Experience
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-all"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
