
import React from 'react';
import SharedInvoice from '@/pages/SharedInvoice';
import SharedProposal from '@/pages/SharedProposal';
import SharedContract from '@/pages/SharedContract';
import PublicReport from '@/pages/PublicReport';

export const sharedRoutes = [
  {
    path: '/shared/invoices/:sharedUrl',
    element: <SharedInvoice />,
  },
  {
    path: '/shared/proposals/:sharedUrl',
    element: <SharedProposal />,
  },
  {
    path: '/shared/contracts/:sharedUrl',
    element: <SharedContract />,
  },
  {
    path: '/shared/reports/:id',
    element: <PublicReport />,
  },
];
