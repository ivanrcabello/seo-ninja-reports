
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  HomeIcon, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Newspaper,
  Phone,
  Package,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface MobileNavbarProps {
  closeMenu: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeMenu }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleSignOut = () => {
    signOut();
    closeMenu();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="py-4 bg-background">
      {user ? (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3 pb-6 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name || 'Usuario'}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-1">
            <Button
              variant={isActive('/servicios') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/servicios">
                <Briefcase className="mr-2 h-4 w-4" />
                Servicios
              </Link>
            </Button>
            
            <Button
              variant={isActive('/paquetes') || isActive('/productos') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/paquetes">
                <Package className="mr-2 h-4 w-4" />
                Productos
              </Link>
            </Button>
            
            <Button
              variant={isActive('/blog') || isActive('/recursos') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/blog">
                <BookOpen className="mr-2 h-4 w-4" />
                Recursos
              </Link>
            </Button>
            
            <Button
              variant={isActive('/contacto') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/contacto">
                <Phone className="mr-2 h-4 w-4" />
                Contacto
              </Link>
            </Button>
            
            <div className="border-t my-4"></div>
            
            <Button
              variant="default"
              className="justify-start bg-emerald-600 hover:bg-emerald-700"
              asChild
              onClick={closeMenu}
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/blog-admin">
                <Newspaper className="mr-2 h-4 w-4" />
                Blog Admin
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </nav>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          <nav className="flex flex-col space-y-1">
            <Button
              variant={isActive('/servicios') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/servicios">
                <Briefcase className="mr-2 h-4 w-4" />
                Servicios
              </Link>
            </Button>
            
            <Button
              variant={isActive('/paquetes') || isActive('/productos') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/paquetes">
                <Package className="mr-2 h-4 w-4" />
                Productos
              </Link>
            </Button>
            
            <Button
              variant={isActive('/blog') || isActive('/recursos') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/blog">
                <BookOpen className="mr-2 h-4 w-4" />
                Recursos
              </Link>
            </Button>
            
            <Button
              variant={isActive('/contacto') ? 'default' : 'ghost'}
              className="justify-start"
              asChild
              onClick={closeMenu}
            >
              <Link to="/contacto">
                <Phone className="mr-2 h-4 w-4" />
                Contacto
              </Link>
            </Button>
          </nav>
          
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
      )}
    </div>
  );
};

export default MobileNavbar;
