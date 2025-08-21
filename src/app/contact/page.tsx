"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Send,
  User,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { handleContactSubmit } from "./handleContactSubmit";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
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

    if (success) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@jubileecare.ng",
      href: "mailto:info@jubileecare.ng",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+234 703 979 2389",
      href: "tel:+2347039792389",
      description: "Call us during business hours",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Umuahia, Abia State, Nigeria",
      href: "https://www.google.com/maps/place/Umuahia+Nigeria",
      description: "Visit our headquarters",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 flex items-center justify-center py-12">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-4xl text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-gray-600 text-lg">
              We&#39;d love to hear from you. Whether you have a question about
              services, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Contact Info Sidebar */}
              <div className="bg-green-400 p-8 text-black">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-green-100">
                      Our friendly team is here to help you with any questions
                      or concerns you might have.
                    </p>
                  </div>

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
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-green-100 hover:text-white transition-colors flex items-center mt-1"
                          >
                            {item.content}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                          <p className="text-green-200 text-sm mt-1">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="pt-6 border-t border-green-500/30">
                    <p className="text-green-100 text-sm">
                      <strong>Business Hours:</strong> Monday - Friday, 9AM -
                      5PM
                    </p>
                    <p className="text-green-100 text-sm mt-1">
                      <strong>Response Time:</strong> Typically within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center space-y-6 py-12"
                    >
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <Send className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-gray-600">
                          Thank you for reaching out. We&#39;ll get back to you
                          within 24 hours.
                        </p>
                      </div>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={onSubmit}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Send us a Message
                      </h2>

                      {errors.length > 0 && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">
                                Please fix the following errors:
                              </h3>
                              <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc list-inside space-y-1">
                                  {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Your full name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="your.email@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          />
                        </div>

                        <div className="relative">
                          <MessageCircle className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Tell us how we can help you..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
