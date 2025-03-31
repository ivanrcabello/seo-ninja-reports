
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MobileUserNav from './mobile/MobileUserNav';
import MobileGuestNav from './mobile/MobileGuestNav';

interface MobileNavbarProps {
  closeMenu: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeMenu }) => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
    closeMenu();
  };
  
  return (
    <div className="py-4 bg-background">
      {user ? (
        <MobileUserNav user={user} closeMenu={closeMenu} handleSignOut={handleSignOut} />
      ) : (
        <MobileGuestNav closeMenu={closeMenu} />
      )}
    </div>
  );
};

export default MobileNavbar;
