
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const MobileNavbar = ({ closeMenu }: { closeMenu: () => void }) => {
  const { user } = useAuth();
  
  // Verificar si el usuario tiene correo de administrador
  const isAdmin = user?.email?.includes('@soyseolocal.com');

  return (
    <div className="py-4 flex flex-col space-y-3">
      <Link to="/" onClick={closeMenu}>
        <Button variant="ghost" className="w-full justify-start">
          Inicio
        </Button>
      </Link>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
        <span className="text-xs font-bold px-4 text-muted-foreground">Servicios</span>
        <Link to="/servicios" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start mt-1">Todos los servicios</Button>
        </Link>
        <Link to="/servicios/seo-local" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">SEO Local</Button>
        </Link>
        <Link to="/servicios/seo-tecnico" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">SEO Técnico</Button>
        </Link>
        <Link to="/servicios/seo-ia" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">SEO + IA</Button>
        </Link>
        <Link to="/servicios/contenido-seo" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Contenido SEO</Button>
        </Link>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
        <span className="text-xs font-bold px-4 text-muted-foreground">Productos</span>
        <Link to="/paquetes" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start mt-1">Todos los paquetes</Button>
        </Link>
        <Link to="/paquetes/starter" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Pack Starter</Button>
        </Link>
        <Link to="/paquetes/ascenso" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Pack Ascenso</Button>
        </Link>
        <Link to="/paquetes/master" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Pack Master</Button>
        </Link>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
        <span className="text-xs font-bold px-4 text-muted-foreground">Recursos</span>
        <Link to="/blog" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start mt-1">Blog</Button>
        </Link>
        <Link to="/documentacion" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Documentación</Button>
        </Link>
        <Link to="/caracteristicas" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Características</Button>
        </Link>
        <Link to="/precios" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Precios</Button>
        </Link>
        <Link to="/guias" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start">Guías</Button>
        </Link>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
        <Link to="/contacto" onClick={closeMenu}>
          <Button variant="ghost" className="w-full justify-start mt-1">Contacto</Button>
        </Link>
      </div>
      
      {user && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
          <span className="text-xs font-bold px-4 text-muted-foreground">Área de usuario</span>
          <Link to="/dashboard" onClick={closeMenu}>
            <Button variant="ghost" className="w-full justify-start mt-1">Dashboard</Button>
          </Link>
          {isAdmin && (
            <>
              <Link to="/blog-admin" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Blog Admin</Button>
              </Link>
              <Link to="/settings" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Configuración</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
