
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Settings2, Mail } from 'lucide-react';
import NavDropdown from './NavDropdown';

const DesktopNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  const servicios = [
    { title: "Posicionamiento SEO Local", description: "Mejora tu visibilidad en búsquedas locales" },
    { title: "SEO Técnico", description: "Optimización técnica para mejorar el rendimiento de tu web" },
    { title: "Auditoría SEO", description: "Análisis completo de tu web para identificar oportunidades" },
    { title: "Contenido SEO", description: "Creación de contenido optimizado para motores de búsqueda" },
  ];

  const paquetes = [
    { title: "Plan Starter", description: "Ideal para pequeños negocios locales", href: "/paquetes/starter" },
    { title: "Plan Ascenso", description: "Para empresas que buscan expandir su presencia online", href: "/paquetes/ascenso" },
    { title: "Plan Master", description: "Servicios avanzados para máximos resultados", href: "/paquetes/master" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link to={item.href}>
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
          <NavDropdown items={servicios} columns={2} />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Paquetes</NavigationMenuTrigger>
          <NavDropdown items={paquetes} columns={3} />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/blog">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/contacto">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Mail className="h-4 w-4 mr-2" />
              Contacto
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/settings">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Settings2 className="h-4 w-4 mr-2" />
              Configuración
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavbar;
