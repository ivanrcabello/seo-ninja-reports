
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown, renderServiceItems, renderProductItems, renderResourceItems } from './NavDropdown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const DesktopNavbar = () => {
  const { user, logout } = useAuth();
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="hidden md:flex items-center gap-x-1">
      <NavDropdown
        title="Servicios"
        items={renderServiceItems()}
        open={openDropdown === 'services'}
        setOpen={(isOpen) => {
          if (isOpen) handleDropdownToggle('services');
          else setOpenDropdown(null);
        }}
      />
      
      <NavDropdown
        title="Productos"
        items={renderProductItems()}
        open={openDropdown === 'products'}
        setOpen={(isOpen) => {
          if (isOpen) handleDropdownToggle('products');
          else setOpenDropdown(null);
        }}
      />
      
      <NavDropdown
        title="Recursos"
        items={renderResourceItems()}
        open={openDropdown === 'resources'}
        setOpen={(isOpen) => {
          if (isOpen) handleDropdownToggle('resources');
          else setOpenDropdown(null);
        }}
      />
      
      <Link to="/contacto">
        <Button variant="ghost" className="font-medium text-base">Contacto</Button>
      </Link>

      <div className="pl-4 flex items-center">
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="default" size="sm">Dashboard</Button>
            </Link>
            {user.email?.includes('@soyseolocal.com') && (
              <Link to="/blog-admin">
                <Button variant="outline" size="sm">Blog Admin</Button>
              </Link>
            )}
          </div>
        ) : (
          <Link to="/auth">
            <Button>Iniciar sesión</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
