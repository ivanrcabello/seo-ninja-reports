
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ClientDetail from '@/pages/ClientDetail';
import ReportDetail from '@/pages/ReportDetail';
import AllReports from '@/pages/AllReports';
import AuthGuard from '@/components/auth/AuthGuard';
import NotFoundPage from '@/pages/NotFoundPage';
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
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/clients/new',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/clients/:id',
    element: <AuthGuard><ClientDetail /></AuthGuard>,
  },
  {
    path: '/clients/:id/edit',
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: '/reports',
    element: <AuthGuard><AllReports /></AuthGuard>,
  },
  {
    path: '/reports/:id',
    element: <AuthGuard><ReportDetail /></AuthGuard>,
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
