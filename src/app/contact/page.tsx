"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, LocateFixed, ExternalLink } from "lucide-react";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent!");
  };

  useEffect(() => {
    // Trigger fade-in animation on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <section className="h-screen bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h1 className="mt-30 text-3xl font-bold text-green-800">
              Contact Us
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-gray-600">
              We’d love to hear from you. Whether you have a question about
              services, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>
          </div>

          <div className="mx-auto max-w-5xl rounded-2xl bg-white px-6 py-10 shadow-lg sm:px-10 md:px-16 lg:px-20">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <Mail className="h-4 w-4 opacity-60" />
                  </h4>
                  <p className="text-gray-600">
                    <a
                      href="mailto:info@jubileecare.ng"
                      className="hover:text-green-700"
                    >
                      info@jubileecare.ng{" "}
                      <ExternalLink className="inline h-4 w-4 ml-1" />
                    </a>
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <Phone className="h-4 w-4 opacity-60" />
                  </h4>
                  <p className="text-gray-600">
                    <a
                      href="tel:+2347039792389"
                      className="hover:text-green-700"
                    >
                      +234 703 979 2389{" "}
                      <ExternalLink className="inline h-4 w-4 ml-1" />
                    </a>
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <LocateFixed className="h-4 w-4 opacity-60" />
                  </h4>
                  <p className="text-gray-600">
                    <a
                      href="https://www.google.com/maps/place/Umuahia+Nigeria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-700"
                    >
                      Umuahia, Abia State, Nigeria{" "}
                      <ExternalLink className="inline h-4 w-4 ml-1" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    // readOnly
                    placeholder="Your name"
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    // readOnly
                    required
                    placeholder="you@example.com"
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    // readOnly
                    required
                    placeholder="Type your message here..."
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    // disabled={true || !name || !email || !message}
                    className="rounded-lg bg-[#008751] px-6 py-3 text-white text-base font-medium hover:bg-[#006f42] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#006f42] focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </div>

                {/* ✅ WhatsApp Button */}
                {/* <button
                  type="button"
                  onClick={() => {
                    const whatsappMessage = `Hello! You have a new message from Jubilee Care ICT contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
                    const encodedMessage = encodeURIComponent(whatsappMessage);
                    window.open(
                      `https://wa.me/2347039792389?text=${encodedMessage}`,
                      "_blank"
                    );
                  }}
                  className="fixed bottom-[-30px] right-6 z-50 rounded-full bg-green-600 p-4 text-white shadow-lg transition hover:bg-green-700 hover:bg-green-700 hover:scale-105"
                  title="Send message via WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.13 1.6 5.93L0 24l6.3-1.64a11.86 11.86 0 005.7 1.45h.02c6.63 0 12-5.37 12-12a11.88 11.88 0 00-3.48-8.33zM12 22c-1.64 0-3.24-.4-4.68-1.16l-.34-.18-3.74.97.99-3.64-.22-.37A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10 2.67 0 5.19 1.04 7.07 2.93A9.93 9.93 0 0122 12c0 5.52-4.48 10-10 10zm5.33-7.4c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.2-.33.22-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36s-1 1-1 2.46 1.02 2.85 1.16 3.04c.14.19 2.02 3.09 4.9 4.33.68.29 1.21.46 1.63.59.68.22 1.3.19 1.79.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.08-.12-.26-.19-.55-.33z" />
                  </svg>
                </button> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
