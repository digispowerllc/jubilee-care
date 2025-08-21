"use client";

import { useNavigation } from "./navigationHandlers";
import { DesktopLinks, MobileLinks } from "./NavigationLinks";
import { HamburgerMenu } from "./HamburgerMenu";
import { BrandLogo } from "./BrandLogo";

// Extend props to include optional agentId
interface NavigationProps {
  authenticated: boolean;
  agentId?: string;
}

const Navigation = ({ authenticated, agentId }: NavigationProps) => {
  const { navOpen, setNavOpen, navRef } = useNavigation();

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-30 bg-white px-6 py-4 shadow-xs select-none"
    >
      <div className="flex items-center justify-between">
        {authenticated ? (
          <>
            <BrandLogo />
            {/* Optional: display agentId somewhere if needed */}
            {agentId && (
              <span className="ml-4 text-sm text-gray-600">
                {/* Agent: {agentId} */}
              </span>
            )}
          </>
        ) : (
          <>
            <HamburgerMenu
              onClick={() => setNavOpen(!navOpen)}
              className="mr-3"
            />
            <BrandLogo />
            <DesktopLinks />
          </>
        )}
      </div>

      {!authenticated && <MobileLinks navOpen={navOpen} />}
    </nav>
  );
};

export default Navigation;
