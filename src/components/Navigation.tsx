'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-30 bg-white px-6 py-4 shadow-xs select-none">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="mr-3 p-2 focus:outline-none sm:hidden"
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* ✅ Fixed branding link */}
        <Link href="/" className="text-xl font-semibold text-green-800 hover:text-green-600">
          Jubilee Care <span className="text-green-600">.NG</span>
        </Link>

        <div className="hidden space-x-6 sm:flex">
          <a href="#about" className="text-base font-medium text-gray-700 hover:text-green-700">About Us</a>
          <a href="#services" className="text-base font-medium text-gray-700 hover:text-green-700">Our Services</a>
          <a href="#projects" className="text-base font-medium text-gray-700 hover:text-green-700">Projects</a>
          <Link href="#contact" className="text-base font-medium text-gray-700 hover:text-green-700">Contact Us</Link>
        </div>
      </div>

      {navOpen && (
        <div className="mt-3 flex flex-col divide-y divide-gray-50 sm:hidden bg-white border border-gray-100 rounded-md shadow-sm">
          <a href="#about" className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700">About Us</a>
          <a href="#services" className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700">Our Services</a>
          <a href="#projects" className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700">Projects</a>
          <Link href="#contact" className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700">Contact Us</Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
