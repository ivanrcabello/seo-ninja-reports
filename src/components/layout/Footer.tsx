
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-4 bg-slate-50 dark:bg-slate-950 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                SoySeoLocal.com
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Mejoramos la visibilidad online de tu negocio local con estrategias SEO avanzadas e informes automatizados.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Madrid, España</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="https://wa.me/34654633796" className="hover:text-primary transition-colors">
                  +34 654 633 796
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@soyseolocal.com</span>
              </div>
            </div>
          </div>
          
          {/* Column 2: Servicios */}
          <div className="space-y-4">
            <h3 className="font-bold text-base">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicios/seo-local" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  SEO Local
                </Link>
              </li>
              <li>
                <Link to="/servicios/seo-tecnico" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  SEO Técnico
                </Link>
              </li>
              <li>
                <Link to="/servicios/seo-ia" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  SEO con IA
                </Link>
              </li>
              <li>
                <Link to="/servicios/contenido-seo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contenido SEO
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Empresa */}
          <div className="space-y-4">
            <h3 className="font-bold text-base">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/caracteristicas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/paquetes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Paquetes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Recursos */}
          <div className="space-y-4">
            <h3 className="font-bold text-base">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/guias" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Centro de recursos
                </Link>
              </li>
              <li>
                <Link to="/documentacion" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentación
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © {currentYear} SoySeoLocal.com. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacidad" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/privacidad#cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
            <Link to="/privacidad#terminos" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
