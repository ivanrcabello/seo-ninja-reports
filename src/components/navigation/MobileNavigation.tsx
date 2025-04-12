
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const MobileNavigation: React.FC<{ closeMenu?: () => void }> = ({ closeMenu = () => {} }) => {
  const location = useLocation();
  
  const mobileNavItems = [
    { href: "/", label: "Inicio" },
    { href: "/servicios/seo-tecnico", label: "SEO Técnico" },
    { href: "/servicios/contenido-seo", label: "Content Marketing" },
    { href: "/servicios/seo-local", label: "SEO Local" },
    { href: "/servicios/alquiler-paginas", label: "Alquiler de Páginas" },
    { href: "/precios", label: "Precios" },
    { href: "/paquetes", label: "Paquetes" },
    { href: "/contacto", label: "Contacto" },
  ];
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <nav className="flex flex-col gap-4">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={closeMenu}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-primary",
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
