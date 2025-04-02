
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { adminRoutes } from './adminRoutes';
import { authRoutes } from './authRoutes';
import { sharedRoutes } from './sharedRoutes';
import { clientPortalRoutes } from './clientPortalRoutes';

// Combine all routes
const allRoutes: RouteObject[] = [
  ...appRoutes,
  ...adminRoutes,
  ...authRoutes,
  ...sharedRoutes,
  ...clientPortalRoutes
];

// Create the router with all routes
export const router = createBrowserRouter(allRoutes);

export default router;
