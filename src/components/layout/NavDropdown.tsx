
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Settings, User, Briefcase, ChevronDown, ChevronUp, BarChart, Compass, Cpu, Database, HelpCircle, Book, FileText, Code } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface NavDropdownItemProps {
  href: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface NavDropdownProps {
  trigger: React.ReactNode;
  items: NavDropdownItemProps[];
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ trigger, items }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            {item.onClick ? (
              <button 
                onClick={item.onClick} 
                className="w-full flex items-center cursor-pointer px-2 py-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link to={item.href} className="flex items-center w-full">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const renderServiceItems = () => [
  {
    href: "/servicios/seo-local",
    label: "SEO Local",
    description: "Mejora la visibilidad de tu negocio en búsquedas locales",
    icon: <Compass className="h-4 w-4 text-primary" />,
  },
  {
    href: "/servicios/seo-tecnico",
    label: "SEO Técnico",
    description: "Optimización técnica de tu sitio web para buscadores",
    icon: <Code className="h-4 w-4 text-primary" />,
  },
  {
    href: "/servicios/seo-ia",
    label: "SEO con IA",
    description: "Análisis y estrategias impulsadas por inteligencia artificial",
    icon: <Cpu className="h-4 w-4 text-primary" />,
  },
  {
    href: "/servicios/contenido-seo",
    label: "Contenido SEO",
    description: "Creación de contenido optimizado para buscadores",
    icon: <FileText className="h-4 w-4 text-primary" />,
  },
];

export const renderProductItems = () => [
  {
    href: "/plataforma-seo",
    label: "Plataforma SEO IA",
    description: "Herramienta SaaS para automatizar tu estrategia SEO",
    icon: <Database className="h-4 w-4 text-primary" />,
  },
  {
    href: "/paquetes",
    label: "Paquetes",
    description: "Planes de servicios para diferentes necesidades",
    icon: <CreditCard className="h-4 w-4 text-primary" />,
  },
  {
    href: "/informes-seo",
    label: "Informes SEO",
    description: "Análisis detallados para tu negocio",
    icon: <BarChart className="h-4 w-4 text-primary" />,
  },
  {
    href: "/demo",
    label: "Solicitar Demo",
    description: "Prueba nuestra plataforma sin compromiso",
    icon: <HelpCircle className="h-4 w-4 text-primary" />,
  },
];

export const renderResourceItems = () => [
  {
    href: "/blog",
    label: "Blog",
    description: "Artículos y guías sobre SEO local",
    icon: <Book className="h-4 w-4 text-primary" />,
  },
  {
    href: "/guias",
    label: "Guías",
    description: "Recursos educativos para mejorar tu SEO",
    icon: <FileText className="h-4 w-4 text-primary" />,
  },
  {
    href: "/documentacion",
    label: "Documentación",
    description: "Documentación técnica de nuestra plataforma",
    icon: <FileText className="h-4 w-4 text-primary" />,
  },
];
