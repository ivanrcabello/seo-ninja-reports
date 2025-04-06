
import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ClientDetail from '@/pages/ClientDetail';
import ReportDetail from '@/pages/ReportDetail';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/auth/AuthGuard';
import Index from '@/pages/Index';
import Servicios from '@/pages/Servicios';
import Contacto from '@/pages/Contacto';
import Paquetes from '@/pages/Paquetes';
import Precios from '@/pages/Precios';
import SeoTecnico from '@/pages/servicios/SeoTecnico';
import ContenidoSeo from '@/pages/servicios/ContenidoSeo';
import SeoLocal from '@/pages/servicios/SeoLocal';
import CrawlerDetailPage from '@/pages/CrawlerDetailPage';

export const appRoutes = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/servicios',
    element: <Servicios />,
  },
  {
    path: '/contacto',
    element: <Contacto />,
  },
  {
    path: '/paquetes',
    element: <Paquetes />,
  },
  {
    path: '/precios',
    element: <Precios />,
  },
  {
    path: '/servicios/seo-tecnico',
    element: <SeoTecnico />,
  },
  {
    path: '/servicios/contenido-seo',
    element: <ContenidoSeo />,
  },
  {
    path: '/servicios/seo-local',
    element: <SeoLocal />,
  },
  {
    path: '/dashboard',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/clients/:clientId',
    element: <AuthGuard><ClientDetail /></AuthGuard>,
  },
  {
    path: '/clients/:clientId/reports/:id',
    element: <AuthGuard><ReportDetail /></AuthGuard>,
  },
  {
    path: '/clients/:clientId/crawler/:crawlId',
    element: <AuthGuard><CrawlerDetailPage /></AuthGuard>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
