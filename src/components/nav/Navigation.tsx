"use client";

import { useNavigation } from "./navigationHandlers";
import { DesktopLinks, MobileLinks } from "./NavigationLinks";
import { HamburgerMenu } from "./HamburgerMenu";
import { BrandLogo } from "./BrandLogo";

const Navigation = ({ authenticated }: { authenticated: boolean }) => {
  const { navOpen, setNavOpen, navRef } = useNavigation();

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-30 bg-white px-6 py-4 shadow-xs select-none"
    >
      <div className="flex items-center justify-between">
        {/* If authenticated → only show logo */}
        {authenticated ? (
          <BrandLogo />
        ) : (
          <>
            <HamburgerMenu onClick={() => setNavOpen(!navOpen)} className="mr-3" />
            <BrandLogo />
            <DesktopLinks />
          </>
        )}
      </div>

      {/* Mobile nav only if not authenticated */}
      {!authenticated && <MobileLinks navOpen={navOpen} />}
    </nav>
  );
};

export default Navigation;
