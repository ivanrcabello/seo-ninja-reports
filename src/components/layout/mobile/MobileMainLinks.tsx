
import React from 'react';
import { Briefcase, Package, BookOpen, Phone } from 'lucide-react';
import MobileNavLink from './MobileNavLink';

interface MobileMainLinksProps {
  closeMenu: () => void;
}

const MobileMainLinks: React.FC<MobileMainLinksProps> = ({ closeMenu }) => {
  return (
    <nav className="flex flex-col space-y-1">
      <MobileNavLink 
        to="/servicios" 
        icon={Briefcase}
        onClick={closeMenu}
      >
        Servicios
      </MobileNavLink>
      
      <MobileNavLink 
        to="/paquetes" 
        icon={Package}
        onClick={closeMenu}
      >
        Productos
      </MobileNavLink>
      
      <MobileNavLink 
        to="/blog" 
        icon={BookOpen}
        onClick={closeMenu}
      >
        Recursos
      </MobileNavLink>
      
      <MobileNavLink 
        to="/contacto" 
        icon={Phone}
        onClick={closeMenu}
      >
        Contacto
      </MobileNavLink>
    </nav>
  );
};

export default MobileMainLinks;
