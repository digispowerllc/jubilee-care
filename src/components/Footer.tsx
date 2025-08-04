'use client';

import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Image
            src="https://res.cloudinary.com/djimok28g/image/upload/v1754309653/i3hub_logo_lnxlzj.png"
            alt="I3 Hub Logo"
            width={24}
            height={24}
            unoptimized // Remove this if using a local image in /public
          />
          <span>
            Powered by{' '}
            <a
              href="https://www.i3hub.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-700"
            >
              I3 Hub
            </a>
          </span>
        </div>
        <p>© {year} Jubilee Care ICT Innovative Consult. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
