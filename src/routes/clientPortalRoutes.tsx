
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientPortal from '@/pages/ClientPortal';
import ClientPortalDashboard from '@/pages/ClientPortalDashboard';

// Add portal routes
export const clientPortalRoutes: RouteObject[] = [
  {
    path: '/portal',
    element: <ClientPortal />
  },
  {
    path: '/portal/dashboard',
    element: <ClientPortalDashboard />
  }
];
