
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientPortalLogin from '@/pages/ClientPortalLogin';
import ClientPortalDashboard from '@/pages/ClientPortalDashboard';

// Add portal routes
export const clientPortalRoutes: RouteObject[] = [
  {
    path: '/portal',
    element: <ClientPortalLogin />
  },
  {
    path: '/portal/dashboard',
    element: <ClientPortalDashboard />
  }
];
