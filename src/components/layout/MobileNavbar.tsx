
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';

interface MobileNavbarProps {
  closeMenu: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeMenu }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Paquetes', href: '/paquetes' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="flex flex-col space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary p-2 rounded',
            location.pathname === item.href
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground'
          )}
          onClick={closeMenu}
        >
          {item.label}
        </Link>
      ))}
      <Link
        to="/settings"
        className={cn(
          'flex items-center gap-1 p-2 text-sm font-medium transition-colors rounded',
          'hover:text-foreground',
          location.pathname === '/settings' ? 'text-foreground' : 'text-muted-foreground'
        )}
        onClick={closeMenu}
      >
        <Settings2 className="h-4 w-4" />
        <span>Configuración</span>
      </Link>
    </nav>
  );
};

export default MobileNavbar;
