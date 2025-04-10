
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PublicReportContent from '@/components/public-reports/PublicReportContent';
import PublicReportHeader from '@/components/public-reports/PublicReportHeader';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import BackButton from '@/components/navigation/BackButton';
import { checkContentPasswordProtection, verifyContentPassword } from '@/api/shared-content/utils';
import { getSharedReport } from '@/services/sharedContentService';

const PublicReport = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string) => {
    try {
      const verified = await verifyContentPassword(sharedUrl || '', 'report', password);
      
      if (verified) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        fetchReport();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  const fetchReport = async () => {
    if (!sharedUrl) return;
    
    try {
      setIsLoading(true);
      
      // Check if the report is password protected directly from the response
      const response = await getSharedReport(sharedUrl);
      
      if (response.isPasswordProtected && !accessGranted) {
        setIsPasswordProtected(true);
        setIsPasswordDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      if (response.error) {
        console.error("Error fetching report:", response.error);
        throw new Error(response.error);
      }
      
      if (!response.data) {
        throw new Error('Informe no encontrado');
      }
      
      setReport(response.data);
    } catch (err: any) {
      console.error("Error in fetchReport:", err);
      setError(err.message || 'No se pudo cargar el informe');
      
      toast.error('Error', { 
        description: err.message || 'No se pudo cargar el informe'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReport();
  }, [sharedUrl]);

  if (isPasswordDialogOpen) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => setError('Acceso denegado')}
        type="report"
      />
    );
  }

  if (isLoading) {
    return <PublicReportLoading />;
  }

  if (error || !report) {
    return <PublicReportError errorMessage={error} />;
  }

  if (!report.content) {
    return <PublicReportEmpty />;
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Informes Públicos', href: '/shared/reports' },
    { label: report.title || 'Informe' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <BackButton />
        </div>
        
        <PublicReportHeader 
          title={report.title} 
          clientName={report.client_name}
          clientWebsite={report.client_website}
          date={report.date}
        />
        
        <div className="mt-8">
          <PublicReportContent content={report.content} />
        </div>
      </div>
    </div>
  );
};

export default PublicReport;
