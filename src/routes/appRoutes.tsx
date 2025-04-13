
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ClientList from '@/pages/ClientList';
import ClientDetail from '@/pages/ClientDetail';
import ReportDetail from '@/pages/ReportDetail';
import AllReports from '@/pages/AllReports';
import ClientForm from '@/pages/ClientForm';
import AuthGuard from '@/components/auth/AuthGuard';
import NotFoundPage from '@/pages/NotFoundPage';
import GenerateReport from '@/pages/GenerateReport';
import Settings from '@/pages/Settings';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/dashboard',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/clients',
    element: <AuthGuard><ClientList /></AuthGuard>,
  },
  {
    path: '/clients/new',
    element: <AuthGuard><ClientForm /></AuthGuard>,
  },
  {
    path: '/clients/:id',
    element: <AuthGuard><ClientDetail /></AuthGuard>,
  },
  {
    path: '/clients/:id/edit',
    element: <AuthGuard><ClientForm /></AuthGuard>,
  },
  {
    path: '/reports',
    element: <AuthGuard><AllReports /></AuthGuard>,
  },
  {
    path: '/reports/:id',
    element: <AuthGuard><ReportDetail /></AuthGuard>,
  },
  // Agregamos la ruta para generar informes
  {
    path: '/clients/:clientId/generate-report',
    element: <AuthGuard><GenerateReport /></AuthGuard>,
  },
  // Agrega también un alias para la ruta que estás usando
  {
    path: '/clients/:clientId/reports/new',
    element: <AuthGuard><GenerateReport /></AuthGuard>,
  },
  {
    path: '/settings',
    element: <AuthGuard><Settings /></AuthGuard>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
