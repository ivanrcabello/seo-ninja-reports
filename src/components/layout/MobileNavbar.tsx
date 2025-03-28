
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Home, BookOpen, Briefcase, FileText, Phone, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import MobileUserNav from './mobile/MobileUserNav';

interface MobileNavbarProps {
  closeMenu: () => void;
  handleSignOut?: () => Promise<void>;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeMenu, handleSignOut }) => {
  const { user } = useAuth();
  
  return (
    <SheetContent side="left" className="w-[80vw] sm:w-[350px] pt-8">
      <SheetHeader className="mb-6">
        <SheetTitle className="text-left flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700"
            onClick={closeMenu}
          >
            SoySeoLocal
          </Link>
          <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center" onClick={closeMenu}>
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetTitle>
      </SheetHeader>
      
      <div className="flex flex-col gap-5">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <Home className="h-4 w-4" />
          <span>Inicio</span>
        </Link>
        
        <Link 
          to="/servicios" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <Briefcase className="h-4 w-4" />
          <span>Servicios</span>
        </Link>
        
        <Link 
          to="/productos" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <BookOpen className="h-4 w-4" />
          <span>Productos</span>
        </Link>
        
        <Link 
          to="/recursos" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <FileText className="h-4 w-4" />
          <span>Recursos</span>
        </Link>
        
        <Link 
          to="/contacto" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <Phone className="h-4 w-4" />
          <span>Contacto</span>
        </Link>
      </div>
      
      <div className="mt-8 pt-8 border-t border-border">
        {user ? (
          <>
            {user && handleSignOut && (
              <MobileUserNav 
                user={user} 
                closeMenu={closeMenu} 
                handleSignOut={handleSignOut} 
              />
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <Link 
                to="/auth" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar sesión</span>
              </Link>
              
              <Link 
                to="/registro" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                <UserPlus className="h-4 w-4" />
                <span>Registrarse</span>
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full" onClick={closeMenu}>
                <Link to="/portal">Área de clientes</Link>
              </Button>
              <Button asChild className="w-full" onClick={closeMenu}>
                <Link to="/auth">Acceso administración</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetContent>
  );
};

export default MobileNavbar;
