'use client';

import React from 'react';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const SocialHandles: React.FC = () => {
  const socials = [
    { 
      name: 'Facebook', 
      url: 'https://facebook.com/JCGNigeria', 
      icon: FiFacebook,
      color: 'hover:text-[#1877F2]'
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/JCGNigeria', 
      icon: FiInstagram,
      color: 'hover:text-[#E4405F]'
    },
    { 
      name: 'WhatsApp', 
      url: 'https://wa.me/2347039792389', 
      icon: FiMessageCircle,
      color: 'hover:text-[#25D366]'
    },
    { 
      name: 'Twitter', 
      url: 'https://twitter.com/JCGNigeria', 
      icon: FiTwitter,
      color: 'hover:text-[#1DA1F2]'
    },
  ];

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'info@jubileecare.ng',
      href: 'mailto:info@jubileecare.ng'
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+234 703 979 2389',
      href: 'tel:+2347039792389'
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: 'Umuahia, Abia State',
      href: 'https://maps.google.com/?q=Umuahia,AbiaState,Nigeria'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-12 lg:py-16">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjJnIGZpbGw9IiNmMWZhZjQiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay <span className="text-green-600">Connected</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow us on social media and reach out through your preferred channel. 
            We're here to help you with all your digital identity needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social Media Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Follow Us
            </h3>
            <div className="flex justify-center gap-6">
              {socials.map(({ name, url, icon: Icon, color }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${name}`}
                  title={name}
                  className={`bg-green-100 text-green-600 p-4 rounded-xl transition-all duration-300 transform hover:scale-110 hover:bg-green-600 hover:text-white ${color} focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm mt-6">
              Get updates, tips, and news about our services
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Contact Info
            </h3>
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Location' ? '_blank' : undefined}
                  rel={label === 'Location' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-300 group"
                >
                  <div className="flex-shrink-0 bg-green-600 text-white p-2 rounded-lg group-hover:bg-green-700 transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-green-800">{label}</div>
                    <div className="text-gray-600 text-sm">{value}</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm mt-6">
              We typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need immediate assistance?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2347039792389"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              <FiMessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:info@jubileecare.ng"
              className="inline-flex items-center justify-center gap-2 border border-green-600 text-green-700 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-300"
            >
              <FiMail className="h-5 w-5" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialHandles;