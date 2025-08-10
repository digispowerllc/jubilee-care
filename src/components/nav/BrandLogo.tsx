import Link from 'next/link';

export const BrandLogo = ({ className = "" }: { className?: string }) => (
  <Link href="/" className={`text-xl font-semibold text-green-800 hover:text-green-600 ${className}`}>
    Jubilee Care <span className="text-green-600">.NG</span>
  </Link>
);