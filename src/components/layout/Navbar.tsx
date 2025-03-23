
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

const Navbar: React.FC<{ isMobile: boolean; closeMenu?: () => void }> = ({ 
  isMobile, 
  closeMenu = () => {} 
}) => {
  const { user } = useAuth();

  if (isMobile) {
    return <MobileNavbar closeMenu={closeMenu} />;
  }

  return <DesktopNavbar />;
};

export default Navbar;
