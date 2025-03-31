
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
