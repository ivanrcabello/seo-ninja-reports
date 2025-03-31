import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicReportContent from '@/components/public-reports/PublicReportContent';
import PublicReportHeader from '@/components/public-reports/PublicReportHeader';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';

const PublicReport = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string) => {
    try {
      // Call function to verify password from our API utility
      const verified = await verifyContentPassword(id || '', 'report', password);
      
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
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Check if report is password protected
      const isProtected = await checkContentPasswordProtection(id, 'report');
      
      // If password protected and access not granted yet, show password dialog
      if (isProtected && !accessGranted) {
        setIsPasswordProtected(true);
        setIsPasswordDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      // Use service to get the report
      const response = await getSharedReport(id);
      
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
  }, [id]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
