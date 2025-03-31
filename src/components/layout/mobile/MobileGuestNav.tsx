
import React from 'react';
import MobileMainLinks from './MobileMainLinks';

interface MobileGuestNavProps {
  closeMenu: () => void;
}

const MobileGuestNav: React.FC<MobileGuestNavProps> = ({ closeMenu }) => {
  return (
    <div className="flex flex-col space-y-6">
      <MobileMainLinks closeMenu={closeMenu} />
    </div>
  );
};

export default MobileGuestNav;
