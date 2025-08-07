"use client";

import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  // const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 px-4 py-3 sm:px-6 lg:px-8 border-t border-gray-100 shadow-md">
      <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 flex flex-col items-center space-y-2 space-x-0">
        <div className="flex items-center gap-1 space-y-2 sm:space-x-2 sm:space-y-0">
          <span className="text-base leading-[48px]"></span>
          <a
            href="https://www.i3hub.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="I3 Hub"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="https://res.cloudinary.com/djimok28g/image/upload/v1754309653/i3hub_logo_lnxlzj.png"
              alt="I3 Hub Logo"
              width={48}
              height={48}
              unoptimized
            />
          </a>
        </div>
        <p>
          {/* © {year} Jubilee Care ICT Innovative Consult. All rights reserved. */}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
