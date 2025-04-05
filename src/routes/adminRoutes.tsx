
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import BlogAdmin from '@/pages/BlogAdmin';
import ClientDetail from '@/pages/ClientDetail';
import NewClientPage from '@/pages/NewClientPage';
import CrawlerDetailPage from '@/pages/CrawlerDetailPage';
import ReportDetail from '@/pages/ReportDetail';
import AllReports from '@/pages/AllReports';
import AuthGuard from '@/components/auth/AuthGuard';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AuthGuard><Dashboard /></AuthGuard>
  },
  {
    path: '/dashboard',
    element: <AuthGuard><Dashboard /></AuthGuard>
  },
  {
    path: '/clients/new',
    element: <AuthGuard><NewClientPage /></AuthGuard>
  },
  {
    path: '/clients/:id',
    element: <AuthGuard><ClientDetail /></AuthGuard>
  },
  {
    path: '/clients/:clientId/crawl/:crawlId',
    element: <AuthGuard><CrawlerDetailPage /></AuthGuard>
  },
  {
    path: '/clients/:clientId/reports/:id',
    element: <AuthGuard><ReportDetail /></AuthGuard>
  },
  {
    path: '/reports/:id',
    element: <AuthGuard><ReportDetail /></AuthGuard>
  },
  {
    path: '/reports',
    element: <AuthGuard><AllReports /></AuthGuard>
  },
  {
    path: '/settings',
    element: <AuthGuard><Settings /></AuthGuard>
  },
  {
    path: '/admin/blog',
    element: <AuthGuard><BlogAdmin /></AuthGuard>
  }
];
