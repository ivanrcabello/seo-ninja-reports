
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Settings2, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

const Navbar: React.FC<{ isMobile: boolean; closeMenu?: () => void }> = ({ 
  isMobile, 
  closeMenu = () => {} 
}) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

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
    { title: "Básico", description: "Ideal para pequeños negocios locales" },
    { title: "Profesional", description: "Para empresas que buscan expandir su presencia online" },
    { title: "Premium", description: "Servicios avanzados para máximos resultados" },
  ];

  if (isMobile) {
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
          to="/servicios"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary p-2 rounded',
            location.pathname === '/servicios'
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground'
          )}
          onClick={closeMenu}
        >
          Servicios
        </Link>
        <Link
          to="/paquetes"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary p-2 rounded',
            location.pathname === '/paquetes'
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground'
          )}
          onClick={closeMenu}
        >
          Paquetes
        </Link>
        <Link
          to="/blog"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary p-2 rounded',
            location.pathname === '/blog'
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground'
          )}
          onClick={closeMenu}
        >
          Blog
        </Link>
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
  }

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
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2">
              {servicios.map((servicio) => (
                <li key={servicio.title} className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/servicios"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{servicio.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {servicio.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Paquetes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-3">
              {paquetes.map((paquete) => (
                <li key={paquete.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/paquetes"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{paquete.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {paquete.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/blog">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
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

export default Navbar;
