import Link from "next/link";

export const BrandLogo = ({ className = "" }: { className?: string }) => (
  <Link
    href="/"
    className={`text-lg font-bold text-green-800 hover:text-green-600 tracking-tight ${className}`}
  >
    Jubilee <span className="text-green-600 text-sm align-top">.NG</span>
  </Link>
);
