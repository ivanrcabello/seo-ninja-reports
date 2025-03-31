
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileMainLinks from './MobileMainLinks';

interface MobileGuestNavProps {
  closeMenu: () => void;
}

const MobileGuestNav: React.FC<MobileGuestNavProps> = ({ closeMenu }) => {
  return (
    <div className="flex flex-col space-y-6">
      <MobileMainLinks closeMenu={closeMenu} />
      
      <div className="mt-auto space-y-2">
        <Button
          className="w-full"
          asChild
          onClick={closeMenu}
        >
          <Link to="/auth">Acceso administración</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileGuestNav;
