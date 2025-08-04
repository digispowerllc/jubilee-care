"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const testimonials = [
  {
    name: "Amina L.",
    role: "Youth Leader, Imo State",
    text: "Jubilee Care has brought real ICT opportunities to our community.",
    avatar: "https://ui-avatars.com/api/?name=Amina+L&background=ffffff",
  },
  {
    name: "Tunde K.",
    role: "ICT Coordinator, Rivers State",
    text: "Their support for digital identity made our center more efficient.",
    avatar: "https://ui-avatars.com/api/?name=Tunde+K&background=ffffff",
  },
  {
    name: "Hamza E.",
    role: "Parent, Yobe State",
    text: "My children got their NINs easily thanks to Jubilee’s outreach.",
    avatar: "https://ui-avatars.com/api/?name=Hamza+E&background=ffffff",
  },
  {
    name: "Ezinne K.",
    role: "Health Worker, Abia State",
    text: "We now register health staff faster with Jubilee’s assistance.",
    avatar: "https://ui-avatars.com/api/?name=Ezinne+K&background=ffffff",
  },
];

const Testimonials: React.FC = () => (
  <section className="relative bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
    <div className="mx-auto max-w-6xl text-center">
      <h2 className="mb-6 text-2xl font-bold text-green-800 sm:text-4xl lg:text-5xl">
        What the citizens say
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-gray-600">
        Real stories from people impacted by Jubilee Care’s ICT initiatives.
      </p>

      <div className="mt-20 mb-10 overflow-hidden">
        {" "}
        {/* Important */}
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 5000 }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="overflow-hidden"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx} className="!h-auto">
              <div className="h-full px-2 sm:px-3 md:px-4">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg">
                  <p className="text-gray-600 italic line-clamp-4">
                    “{t.text}”
                  </p>

                  <div className="mt-8 flex items-center gap-4 justify-end">
                    <div className="text-right space-y-1">
                      <div className="truncate max-w-[140px] text-sm font-semibold text-green-800">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full ring-2 ring-green-600 ring-offset-2 ring-offset-white"
                      width={40}
                      height={40}
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  </section>
);

export default Testimonials;
