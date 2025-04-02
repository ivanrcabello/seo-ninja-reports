
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Servicios from '@/pages/Servicios';
import Paquetes from '@/pages/Paquetes';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Contacto from '@/pages/Contacto';
import Precios from '@/pages/Precios';
import Caracteristicas from '@/pages/Caracteristicas';
import Guias from '@/pages/Guias';
import Documentacion from '@/pages/Documentacion';
import Recursos from '@/pages/Recursos';
import Privacidad from '@/pages/Privacidad';
import Cookies from '@/pages/Cookies';
import Terminos from '@/pages/Terminos';
import NotFoundPage from '@/pages/NotFoundPage';

// Service Pages
import SeoLocal from '@/pages/servicios/SeoLocal';
import SeoTecnico from '@/pages/servicios/SeoTecnico';
import SeoIA from '@/pages/servicios/SeoIA';
import ContenidoSeo from '@/pages/servicios/ContenidoSeo';
import SeoCompetencia from '@/pages/servicios/SeoCompetencia';
import GoogleBusiness from '@/pages/servicios/GoogleBusiness';
import Resenas from '@/pages/servicios/Resenas';

// Package Pages
import PackStarter from '@/pages/packs/PackStarter';
import PackAscenso from '@/pages/packs/PackAscenso';
import PackMaster from '@/pages/packs/PackMaster';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Index />
  },
  // Servicios
  {
    path: '/servicios',
    element: <Servicios />
  },
  {
    path: '/servicios/seo-local',
    element: <SeoLocal />
  },
  {
    path: '/servicios/seo-tecnico',
    element: <SeoTecnico />
  },
  {
    path: '/servicios/seo-ia',
    element: <SeoIA />
  },
  {
    path: '/servicios/contenido-seo',
    element: <ContenidoSeo />
  },
  {
    path: '/servicios/seo-competencia',
    element: <SeoCompetencia />
  },
  {
    path: '/servicios/google-business',
    element: <GoogleBusiness />
  },
  {
    path: '/servicios/resenas',
    element: <Resenas />
  },
  
  // Paquetes
  {
    path: '/paquetes',
    element: <Paquetes />
  },
  {
    path: '/paquetes/starter',
    element: <PackStarter />
  },
  {
    path: '/paquetes/ascenso',
    element: <PackAscenso />
  },
  {
    path: '/paquetes/master',
    element: <PackMaster />
  },
  
  // Blog
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/blog/:slug',
    element: <BlogDetail />
  },
  
  // Otras páginas
  {
    path: '/caracteristicas',
    element: <Caracteristicas />
  },
  {
    path: '/precios',
    element: <Precios />
  },
  {
    path: '/guias',
    element: <Guias />
  },
  {
    path: '/documentacion',
    element: <Documentacion />
  },
  {
    path: '/recursos',
    element: <Recursos />
  },
  {
    path: '/contacto',
    element: <Contacto />
  },
  {
    path: '/privacidad',
    element: <Privacidad />
  },
  {
    path: '/cookies',
    element: <Cookies />
  },
  {
    path: '/terminos',
    element: <Terminos />
  },
  
  // 404 page
  {
    path: '*',
    element: <NotFoundPage />
  }
];
