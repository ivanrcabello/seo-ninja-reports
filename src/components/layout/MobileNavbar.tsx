
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  X, Home, BookOpen, Briefcase, FileText, Phone, LogIn, 
  UserPlus, ChevronDown, ChevronUp, Layout, Package, Newspaper, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { toast } from 'sonner';
import MobileUserNav from './mobile/MobileUserNav';

interface MobileNavbarProps {
  closeMenu: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SubmenuProps {
  title: string;
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  closeMenu: () => void;
}

const Submenu: React.FC<SubmenuProps> = ({ title, items, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="pl-4 mt-2 space-y-2">
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileNavbar: React.FC<MobileNavbarProps> = ({ closeMenu, isOpen, onOpenChange }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };
  
  const serviciosItems = [
    { title: 'SEO Local', href: '/servicios/seo-local' },
    { title: 'SEO Técnico', href: '/servicios/seo-tecnico' },
    { title: 'SEO con IA', href: '/servicios/seo-ia' },
    { title: 'Contenido SEO', href: '/servicios/contenido-seo' },
    { title: 'Ver todos', href: '/servicios' }
  ];
  
  const paquetesItems = [
    { title: 'Pack Starter', href: '/paquetes/starter' },
    { title: 'Pack Ascenso', href: '/paquetes/ascenso' },
    { title: 'Pack Master', href: '/paquetes/master' },
    { title: 'Comparar paquetes', href: '/paquetes' }
  ];
  
  const recursosItems = [
    { title: 'Blog', href: '/blog' },
    { title: 'Guías SEO', href: '/guias' },
    { title: 'Documentación', href: '/documentacion' },
    { title: 'Centro de recursos', href: '/recursos' }
  ];
  
  const plataformaItems = [
    { title: 'Características', href: '/caracteristicas' },
    { title: 'Planes y precios', href: '/precios' }
  ];
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[80vw] sm:w-[350px] pt-8">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-left flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center"
              onClick={closeMenu}
            >
              <img src="/lovable-uploads/46c042b9-bcdb-4ac6-aaa3-dc6d747f7d10.png" alt="SoySeoLocal" className="h-8" />
            </Link>
            <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center" onClick={closeMenu}>
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        
        {user ? (
          <MobileUserNav 
            user={user} 
            closeMenu={closeMenu} 
            handleSignOut={handleSignOut} 
          />
        ) : (
          <>
            <div className="mb-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
                onClick={closeMenu}
              >
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
            </div>
            
            <Submenu title="Servicios" items={serviciosItems} closeMenu={closeMenu} />
            <Submenu title="Paquetes" items={paquetesItems} closeMenu={closeMenu} />
            <Submenu title="Recursos" items={recursosItems} closeMenu={closeMenu} />
            <Submenu title="Plataforma SaaS" items={plataformaItems} closeMenu={closeMenu} />
            
            <Link 
              to="/contacto" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2 border-b border-border pb-4 mb-4"
              onClick={closeMenu}
            >
              <Phone className="h-4 w-4" />
              <span>Contacto</span>
            </Link>
            
            <div className="pt-4">
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full" onClick={closeMenu}>
                  <Link to="/auth">Acceso administración</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
