
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import BlogAdmin from '@/pages/BlogAdmin';
import ClientDetail from '@/pages/ClientDetail';
import CrawlerDetailPage from '@/pages/CrawlerDetailPage';
import ReportDetail from '@/pages/ReportDetail';
import AllReports from '@/pages/AllReports';

// Auth guard component to protect admin routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

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
