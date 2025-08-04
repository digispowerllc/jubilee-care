'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle  } from 'lucide-react';


const socials = [
  { name: 'Facebook', url: 'https://facebook.com/JCGNigeria', icon: <Facebook /> },
    { name: 'Instagram', url: 'https://instagram.com/JCGNigeria', icon: <Instagram /> },
  { name: 'WhatsApp', url: 'https://wa.me/2347039792389', icon: <MessageCircle /> },
  { name: 'Twitter', url: 'https://twitter.com/JCGNigeria', icon: <Twitter /> },
];

const SocialHandles: React.FC = () => {
  return (
    <section className="bg-white px-6 pt-10 pb-6 text-center">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Follow Us & Stay Connected</h2>
      <div className="flex justify-center gap-6 text-gray-500 text-2xl">
        {socials.map(({ name, url, icon }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${name}`}
            title={name}
            className="transition-transform transform hover:scale-110 hover:text-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
          >
            <span aria-hidden="true">{icon}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialHandles;
