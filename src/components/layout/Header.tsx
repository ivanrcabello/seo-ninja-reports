
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';
import { toast } from 'sonner';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              SoySeoLocal
            </Link>
          </div>

          <DesktopNavbar />
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild size="sm">
                  <Link to="/dashboard">Panel de administración</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Iniciar sesión</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/registro">Registrarse</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/portal">Área de clientes</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth">Acceso administración</Link>
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <MobileNavbar
        closeMenu={() => setIsMobileMenuOpen(false)}
        handleSignOut={handleSignOut}
      />
    </header>
  );
};

export default Header;
