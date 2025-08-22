// File: src/app/contact/page.tsx
"use client";

import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { handleContactSubmit } from "./contact-utils";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const success = await handleContactSubmit(
      { name, email, message },
      setName,
      setEmail,
      setMessage,
      setErrors,
      setLoading
    );

    if (success) setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      content: "info@jubileecare.ng",
      href: "mailto:info@jubileecare.ng",
      description: "Send us an email anytime",
    },
    {
      icon: FiPhone,
      title: "Phone",
      content: "+234 703 979 2389",
      href: "tel:+2347039792389",
      description: "Call us during business hours",
    },
    {
      icon: FiMapPin,
      title: "Location",
      content: "Umuahia, Abia State, Nigeria",
      href: "https://www.google.com/maps/place/Umuahia+Nigeria",
      description: "Visit our headquarters",
    },
  ];

  return (
    <>
      <Head>
        <title>Contact Us | Jubilee Care Identity Agency</title>
        <meta
          name="description"
          content="Contact Jubilee Care Identity Agency. Reach out via email, phone, or our online form. We are here to help you with identity solutions."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md w-full space-y-6 text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Message Sent Successfully!
              </h2>
              <p className="text-gray-600">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <motion.button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send another message
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Contact Info Sidebar */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-green-100 mb-6">
                    Our friendly team is here to help with any questions.
                  </p>

                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-green-100 hover:text-white transition-colors flex items-center mt-1"
                          >
                            {item.content}
                            <FiExternalLink className="h-3 w-3 ml-1" />
                          </a>
                          <p className="text-green-200 text-sm mt-1">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Extra Info */}
                  <div className="pt-6 border-t border-green-500/30 mt-6">
                    <div className="flex items-center gap-2 text-green-100 text-sm mb-2">
                      <FiClock className="h-4 w-4" />
                      <span>
                        <strong>Business Hours:</strong> Mon - Fri, 9AM - 5PM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <FiCalendar className="h-4 w-4" />
                      <span>
                        <strong>Response Time:</strong> Within 24 hours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="p-8">
                  <form onSubmit={onSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      Contact Us
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                      We'd love to hear from you. Send us a message below.
                    </p>

                    {errors.length > 0 && (
                      <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                        <div className="flex items-center">
                          <FiAlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                          <ul className="list-disc list-inside text-sm text-red-700">
                            {errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setErrors([]);
                            }}
                            type="text"
                            placeholder="Your full name"
                            aria-label="Full Name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors([]);
                            }}
                            type="email"
                            placeholder="your.email@example.com"
                            aria-label="Email Address"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <div className="relative">
                          <FiMessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <textarea
                            id="message"
                            value={message}
                            onChange={(e) => {
                              setMessage(e.target.value);
                              setErrors([]);
                            }}
                            rows={5}
                            placeholder="Tell us how we can help..."
                            aria-label="Message"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-lg font-medium text-white transition-all ${
                        loading
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      }`}
                      whileHover={{ scale: loading ? 1 : 1.01 }}
                      whileTap={{ scale: loading ? 1 : 0.99 }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ContactPage;