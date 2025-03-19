
import React from 'react';
import useAuth from '@/hooks/useAuth';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

const Navbar: React.FC<{ isMobile: boolean; closeMenu?: () => void }> = ({ 
  isMobile, 
  closeMenu = () => {} 
}) => {
  const { user, signOut } = useAuth();

  if (isMobile) {
    return <MobileNavbar closeMenu={closeMenu} />;
  }

  return <DesktopNavbar />;
};

export default Navbar;
