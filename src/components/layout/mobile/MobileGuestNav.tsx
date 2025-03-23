
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
          variant="outline"
          asChild
          onClick={closeMenu}
        >
          <Link to="/auth">Iniciar sesión</Link>
        </Button>
        
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          asChild
          onClick={closeMenu}
        >
          <Link to="/auth?register=true">Registrarse</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileGuestNav;
