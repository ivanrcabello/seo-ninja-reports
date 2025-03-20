
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

interface NavDropdownProps {
  title: string;
  items: {
    href: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title, items, open, setOpen }) => {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1.5 font-medium text-base">
          {title}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 md:w-96" align="end">
        <div className="grid md:grid-cols-2 p-2">
          {items.map((item, index) => (
            <DropdownMenuItem key={index} asChild className="p-3 cursor-pointer rounded-md">
              <Link to={item.href} className="flex flex-col" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.description && (
                  <span className="text-xs text-muted-foreground pt-1">
                    {item.description}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const renderServiceItems = () => [
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

const renderProductItems = () => [
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

const renderResourceItems = () => [
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

export { NavDropdown, renderServiceItems, renderProductItems, renderResourceItems };
