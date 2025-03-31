
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import MobileMainLinks from './MobileMainLinks';
import { useAuth } from '@/context/AuthContext';

interface MobileGuestNavProps {
  closeMenu: () => void;
}

const MobileGuestNav: React.FC<MobileGuestNavProps> = ({ closeMenu }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col space-y-6">
      <MobileMainLinks closeMenu={closeMenu} />
      
      <div className="pt-4 border-t border-border">
        {user ? (
          <Button variant="outline" asChild className="w-full justify-start" onClick={closeMenu}>
            <Link to="/dashboard">
              <User className="h-4 w-4 mr-2" />
              Área de admin
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild className="w-full justify-start" onClick={closeMenu}>
            <Link to="/auth">
              <User className="h-4 w-4 mr-2" />
              Acceder
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileGuestNav;
