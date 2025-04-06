
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  
  const mainNavItems = [
    { href: "/", label: "Inicio" },
    { href: "/servicios/seo-tecnico", label: "SEO Técnico" },
    { href: "/servicios/content-marketing", label: "Content Marketing" },
    { href: "/servicios/local-seo", label: "SEO Local" },
    { href: "/pricing", label: "Precios" },
    { href: "/about", label: "Nosotros" },
    { href: "/contact", label: "Contacto" },
  ];
  
  return (
    <nav className="mx-6 hidden gap-6 md:flex">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-primary",
            location.pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNavigation;
