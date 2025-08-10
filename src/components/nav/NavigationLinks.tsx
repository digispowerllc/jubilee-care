import Link from "next/link";

export const DesktopLinks = () => (
  <div className="hidden space-x-6 sm:flex">
    <a
      href="#about"
      className="text-base font-medium text-gray-700 hover:text-green-700"
    >
      About Us
    </a>
    <a
      href="#services"
      className="text-base font-medium text-gray-700 hover:text-green-700"
    >
      Our Services
    </a>
    <a
      href="#projects"
      className="text-base font-medium text-gray-700 hover:text-green-700"
    >
      Projects
    </a>
    <Link
      href="/contact"
      className="text-base font-medium text-gray-700 hover:text-green-700"
    >
      Contact Us
    </Link>
  </div>
);

export const MobileLinks = ({ navOpen }: { navOpen: boolean }) =>
  navOpen && (
    <div className="mt-3 flex flex-col divide-y divide-gray-50 sm:hidden bg-white border border-gray-100 rounded-md shadow-sm">
      <a
        href="#about"
        className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700"
      >
        About Us
      </a>
      <a
        href="#services"
        className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700"
      >
        Our Services
      </a>
      <a
        href="#projects"
        className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700"
      >
        Projects
      </a>
      <Link
        href="/contact"
        className="block w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50 hover:text-green-700"
      >
        Contact Us
      </Link>
    </div>
  );
