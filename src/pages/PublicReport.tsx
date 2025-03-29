
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportHeader, PublicReportContent, PublicReportError, PublicReportLoading, PublicReportEmpty } from '@/components/public-reports';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useReportData from '@/components/public-reports/useReportData';

const PublicReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected, 
    refetch 
  } = useReportData(reportId || '');

  const verifyPassword = async (password: string) => {
    try {
      if (!reportId) return;
      
      const { data, error: verifyError } = await supabase.rpc(
        'verify_shared_report_password',
        { 
          report_id_param: reportId,
          password_param: password
        }
      );
      
      if (verifyError) throw new Error(verifyError.message);
      
      if (data === true) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        refetch();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  // Show password dialog if protected and access not granted
  if (isPasswordProtected && !accessGranted && !isLoading) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => setIsPasswordDialogOpen(false)}
        type="report"
      />
    );
  }
  
  // Loading state
  if (isLoading) {
    return <PublicReportLoading />;
  }
  
  // Error state
  if (error || !report) {
    return <PublicReportError message={error || 'No se pudo cargar el informe'} />;
  }

  // Report is empty
  if (!report.content) {
    return <PublicReportEmpty />;
  }

  // Show report
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto py-8">
        <PublicReportHeader report={report} />
        <PublicReportContent report={report} />
      </div>
    </div>
  );
};

export default PublicReport;
