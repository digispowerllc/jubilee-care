"use client";

import React from "react";
import Image from "next/image";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiExternalLink, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiHeart
} from "react-icons/fi";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    // { name: "Agent Login", href: "/agent/signin" },
    // { name: "Agent Signup", href: "/agent/signup" }
  ];

  const services = [
    { name: "NIN Enrollment", href: "/services#enrollment" },
    { name: "Verification", href: "/services#verification" },
    { name: "ICT Training", href: "/services#training" },
    { name: "Consultancy", href: "/services#consultancy" },
    { name: "Support", href: "/services#support" }
  ];

  const socialLinks = [
    { icon: FiFacebook, href: "#", label: "Facebook" },
    { icon: FiTwitter, href: "#", label: "Twitter" },
    { icon: FiInstagram, href: "#", label: "Instagram" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-200">
      {/* Main Footer Content */}
      <div className="px-6 py-12 lg:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Jubilee Care Home"
                >
                  <Image
                    src="https://res.cloudinary.com/djimok28g/image/upload/v1754309653/i3hub_logo_lnxlzj.png"
                    alt="I3 Hub Logo"
                    width={56}
                    height={56}
                    unoptimized
                    className="rounded-lg"
                  />
                </Link>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Jubilee Care</h3>
                  <p className="text-sm text-green-600">ICT Innovative Consult</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Official NIMC Front-End Partner delivering secure digital identity 
                services and ICT solutions across Nigeria.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-white text-green-600 p-2 rounded-lg border border-green-200 hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <link
                      href={link.href}
                      className="text-gray-600 hover:text-green-700 text-sm transition-colors duration-300 flex items-center gap-2"
                    >
                      <FiExternalLink className="h-3 w-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link
                      href={service.href}
                      className="text-gray-600 hover:text-green-700 text-sm transition-colors duration-300"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Umuahia, Abia State, Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <Link
                    href="tel:+2347039792389"
                    className="text-gray-600 hover:text-green-700 text-sm transition-colors duration-300"
                  >
                    +234 703 979 2389
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <Link
                    href="mailto:info@jubileecare.ng"
                    className="text-gray-600 hover:text-green-700 text-sm transition-colors duration-300"
                  >
                    info@jubileecare.ng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-200 bg-white">
        <div className="px-6 py-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm flex items-center gap-1">
                © {currentYear} Jubilee Care ICT Innovative Consult. All rights reserved.
                <FiHeart className="h-3 w-3 text-red-500" />
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-green-700 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-green-700 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/sitemap" className="hover:text-green-700 transition-colors duration-300">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/contact"
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Contact Us"
        >
          <FiMail className="h-6 w-6" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;