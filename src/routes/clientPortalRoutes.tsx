
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientPortal from '@/pages/ClientPortal';
import ClientPortalDashboard from '@/pages/ClientPortalDashboard';
import ClientPortalLogin from '@/pages/ClientPortalLogin';

// Add portal routes
export const clientPortalRoutes: RouteObject[] = [
  {
    path: '/portal',
    element: <ClientPortal />
  },
  {
    path: '/portal/login',
    element: <ClientPortalLogin />
  },
  {
    path: '/portal/dashboard',
    element: <ClientPortalDashboard />
  }
];
