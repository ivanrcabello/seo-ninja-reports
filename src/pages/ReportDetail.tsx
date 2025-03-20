
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import useAuth from '@/hooks/useAuth';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import ReportDetailContent from '@/components/reports/detail/ReportDetailContent';
import usePersistentState from '@/hooks/usePersistentState';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialIsEditing = searchParams.get('mode') === 'edit';
  const [isEditing, setIsEditing] = usePersistentState<boolean>(`report-edit-state-${id}`, initialIsEditing);
  
  const { user, loading: authLoading } = useAuth();
  const { getClient } = useClients();
  const { getReport, isLoading: reportsLoading, deleteReport } = useReports();
  
  // Update URL when editing state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isEditing) {
      params.set('mode', 'edit');
    } else {
      params.delete('mode');
    }
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [isEditing, location.pathname, navigate]);
  
  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const report = getReport(id);
  const isLoading = authLoading || reportsLoading;
  const client = report ? getClient(report.clientId) : null;

  const handleDeleteReport = async () => {
    if (!report) return;
    
    await deleteReport(report.id);
    window.location.href = client ? `/clients/${client.id}` : '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <ReportDetailContent
            report={report}
            client={client}
            isLoading={isLoading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleDeleteReport={handleDeleteReport}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportDetail;
