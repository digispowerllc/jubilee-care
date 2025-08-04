"use client";

import React, { useEffect, useState } from "react";

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
      <section className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-green-800">Contact Us</h1>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            We’d love to hear from you. Whether you have a question about
            services, pricing, or anything else, our team is ready to answer all
            your questions.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl bg-white px-6 py-10 shadow-lg sm:px-10 md:px-16 lg:px-20">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600">
                  <a
                    href="mailto:info@jubileecare.ng"
                    className="hover:text-green-700"
                  >
                    info@jubileecare.ng
                  </a>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800">Phone</h4>
                <p className="text-gray-600">
                  <a href="tel:+2347039792389" className="hover:text-green-700">
                    +234 703 979 2389
                  </a>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800">Address</h4>
                <p className="text-gray-600">
                  <a
                    href="https://www.google.com/maps/place/Umuahia+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-700"
                  >
                    Umuahia, Abia State, Nigeria
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
                  placeholder="Your name"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-green-600"
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
                  required
                  placeholder="you@example.com"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-green-600"
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
                  required
                  placeholder="Type your message here..."
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-green-600"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
