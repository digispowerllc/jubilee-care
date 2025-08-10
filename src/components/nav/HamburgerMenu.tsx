export const HamburgerMenu = ({ 
  onClick,
  className = ""
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`p-2 focus:outline-none sm:hidden ${className}`}
    aria-label="Toggle Menu"
  >
    <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
);