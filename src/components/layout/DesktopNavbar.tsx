
import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNavbar = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/servicios" 
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Servicios
      </Link>
      <Link 
        to="/productos" 
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Productos
      </Link>
      <Link 
        to="/recursos" 
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Recursos
      </Link>
      <Link 
        to="/contacto" 
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Contacto
      </Link>
    </nav>
  );
};

export default DesktopNavbar;
