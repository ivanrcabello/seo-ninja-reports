
import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ClientDetail from '@/pages/ClientDetail';
import ReportDetail from '@/pages/ReportDetail';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import SeoTecnico from '@/pages/servicios/SeoTecnico';
import ContentMarketing from '@/pages/servicios/ContentMarketing';
import LocalSeo from '@/pages/servicios/LocalSeo';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/auth/AuthGuard';

export const appRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/servicios/seo-tecnico',
    element: <SeoTecnico />,
  },
  {
    path: '/servicios/content-marketing',
    element: <ContentMarketing />,
  },
  {
    path: '/servicios/local-seo',
    element: <LocalSeo />,
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
    element: <AuthGuard><ReportDetail /></AuthGuard>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
