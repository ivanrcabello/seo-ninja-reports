
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const DesktopNavbar = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/servicios/seo-local" title="SEO Local">
                Optimización para atraer clientes de su zona geográfica
              </ListItem>
              <ListItem href="/servicios/seo-tecnico" title="SEO Técnico">
                Mejoras técnicas para optimizar su web en buscadores
              </ListItem>
              <ListItem href="/servicios/seo-ia" title="SEO con IA">
                Estrategias avanzadas con inteligencia artificial
              </ListItem>
              <ListItem href="/servicios/contenido-seo" title="Contenido SEO">
                Creación de contenidos optimizados para conversión
              </ListItem>
              <li className="col-span-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none items-center justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/servicios"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Ver todos los servicios</div>
                      <p className="text-sm text-muted-foreground">
                        Explore nuestra gama completa de servicios SEO 
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Paquetes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <ListItem href="/paquetes/starter" title="Pack Starter">
                Ideal para pequeños negocios locales
              </ListItem>
              <ListItem href="/paquetes/ascenso" title="Pack Ascenso">
                Para empresas que buscan crecer y expandirse
              </ListItem>
              <ListItem href="/paquetes/master" title="Pack Master">
                Solución completa para dominar su mercado local
              </ListItem>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none items-center justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/paquetes"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Comparar paquetes</div>
                      <p className="text-sm text-muted-foreground">
                        Vea todos nuestros planes y precios
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/blog" title="Blog">
                Artículos y guías sobre SEO y marketing digital
              </ListItem>
              <ListItem href="/guias" title="Guías SEO">
                Tutoriales detallados para mejorar su presencia online
              </ListItem>
              <ListItem href="/documentacion" title="Documentación">
                Información técnica sobre nuestra plataforma
              </ListItem>
              <ListItem href="/caracteristicas" title="Características">
                Conozca las funciones de nuestra plataforma SaaS
              </ListItem>
              <li className="col-span-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none items-center justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/recursos"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">Centro de recursos</div>
                      <p className="text-sm text-muted-foreground">
                        Todos los recursos SEO en un solo lugar
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link 
              to="/contacto" 
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Contacto
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default DesktopNavbar;
