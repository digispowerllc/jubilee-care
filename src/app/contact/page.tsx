"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, LocateFixed, ExternalLink } from "lucide-react";
import { handleContactSubmit } from "./handleContactSubmit";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    handleContactSubmit(
      { name, email, message },
      setName,
      setEmail,
      setMessage,
      setErrors,
      setLoading
    );
  };

  useEffect(() => {
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
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
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
                    placeholder="Type your message here..."
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#008751] px-6 py-3 text-white text-base font-medium hover:bg-[#006f42] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#006f42] focus:ring-offset-2 flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg
                        className="h-4 w-4 animate-spin mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : null}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
