
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import CrawlerDetail from '@/components/clients/seo-crawler/CrawlerDetail';

const CrawlerDetailPage: React.FC = () => {
  const { clientId, crawlId } = useParams<{ clientId: string; crawlId: string }>();
  const { user, loading } = useAuth();
  
  // Redirect if no authenticated user
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if missing any parameters
  if (!clientId || !crawlId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <CrawlerDetail 
            clientId={clientId}
            crawlId={crawlId} 
            onBack={() => window.history.back()}
          />
        </div>
      </main>
    </Layout>
  );
};

export default CrawlerDetailPage;
