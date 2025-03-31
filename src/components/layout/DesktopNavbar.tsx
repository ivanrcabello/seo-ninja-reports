
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavDropdown } from './NavDropdown';
import { LogOut, User, Settings, LayoutDashboard, Newspaper } from 'lucide-react';

const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      {/* Main navigation links */}
      <nav className="hidden md:flex items-center space-x-1">
        <Button
          variant={isActive('/servicios') ? 'default' : 'ghost'}
          className="px-4"
          asChild
        >
          <Link to="/servicios">Servicios</Link>
        </Button>
        
        <Button
          variant={isActive('/productos') || isActive('/paquetes') ? 'default' : 'ghost'}
          className="px-4"
          asChild
        >
          <Link to="/paquetes">Productos</Link>
        </Button>
        
        <Button
          variant={isActive('/recursos') || isActive('/blog') ? 'default' : 'ghost'}
          className="px-4"
          asChild
        >
          <Link to="/blog">Recursos</Link>
        </Button>
        
        <Button
          variant={isActive('/contacto') ? 'default' : 'ghost'}
          className="px-4"
          asChild
        >
          <Link to="/contacto">Contacto</Link>
        </Button>
      </nav>
      
      {/* User-related buttons and dropdown */}
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              asChild
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/blog-admin">Blog Admin</Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/settings">Configuración</Link>
            </Button>
            
            <NavDropdown
              trigger={
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              }
              items={[
                {
                  icon: <User className="mr-2 h-4 w-4" />,
                  label: user.name || 'Usuario',
                  href: '/settings',
                },
                {
                  icon: <Settings className="mr-2 h-4 w-4" />,
                  label: 'Configuración',
                  href: '/settings',
                },
                {
                  icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
                  label: 'Dashboard',
                  href: '/dashboard',
                },
                {
                  icon: <Newspaper className="mr-2 h-4 w-4" />,
                  label: 'Blog Admin',
                  href: '/blog-admin',
                },
                {
                  icon: <LogOut className="mr-2 h-4 w-4" />,
                  label: 'Cerrar Sesión',
                  onClick: signOut,
                  href: '#',
                },
              ]}
            />
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
            
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/auth?register=true">Registrarse</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
