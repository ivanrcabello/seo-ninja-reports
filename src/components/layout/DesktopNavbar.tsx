
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavDropdown } from './NavDropdown';
import { LogOut, User, Settings, BarChart3, Archive, Users, FileText, Newspaper } from 'lucide-react';

const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="hidden lg:flex w-full items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800">SoySeoLocal</Link>
        
        {user ? (
          <nav className="flex items-center space-x-1">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            
            <Button
              variant={isActive('/clients') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/clients">Clientes</Link>
            </Button>
            
            <Button
              variant={isActive('/all-reports') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/all-reports">Informes</Link>
            </Button>
            
            <Button
              variant={isActive('/activity') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/activity">Actividad</Link>
            </Button>

            <Button
              variant={isActive('/blog-admin') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/blog-admin">Blog Editor</Link>
            </Button>
          </nav>
        ) : (
          <nav className="flex items-center space-x-1">
            <Button
              variant={isActive('/caracteristicas') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/caracteristicas">Características</Link>
            </Button>
            
            <Button
              variant={isActive('/precios') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/precios">Precios</Link>
            </Button>
            
            <Button
              variant={isActive('/blog') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/blog">Blog</Link>
            </Button>
            
            <Button
              variant={isActive('/contacto') ? 'default' : 'ghost'}
              className="px-4"
              asChild
            >
              <Link to="/contacto">Contacto</Link>
            </Button>
          </nav>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
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
                label: 'Perfil',
                href: '/settings',
              },
              {
                icon: <Settings className="mr-2 h-4 w-4" />,
                label: 'Ajustes',
                href: '/settings',
              },
              {
                icon: <BarChart3 className="mr-2 h-4 w-4" />,
                label: 'Dashboard',
                href: '/dashboard',
              },
              {
                icon: <Users className="mr-2 h-4 w-4" />,
                label: 'Clientes',
                href: '/clients',
              },
              {
                icon: <FileText className="mr-2 h-4 w-4" />,
                label: 'Informes',
                href: '/all-reports',
              },
              {
                icon: <Newspaper className="mr-2 h-4 w-4" />,
                label: 'Blog Editor',
                href: '/blog-admin',
              },
              {
                icon: <LogOut className="mr-2 h-4 w-4" />,
                label: 'Cerrar sesión',
                onClick: signOut,
                href: '#',
              },
            ]}
          />
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
            
            <Button asChild>
              <Link to="/auth?register=true">Registrarse</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
