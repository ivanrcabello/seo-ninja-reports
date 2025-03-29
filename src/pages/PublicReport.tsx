
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportHeader, PublicReportContent, PublicReportError, PublicReportLoading, PublicReportEmpty } from '@/components/public-reports';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';
import { toast } from 'sonner';
import useReportData from '@/components/public-reports/useReportData';

const PublicReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected,
    accessGranted,
    setAccessGranted,
    verifyPassword,
    refetch 
  } = useReportData(reportId || '');

  const handlePasswordSubmit = async (password: string) => {
    try {
      setPasswordError(null);
      
      const success = await verifyPassword(password);
      
      if (success) {
        setAccessGranted(true);
        toast.success('Acceso concedido');
        refetch();
      } else {
        setPasswordError('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      setPasswordError('Error al verificar la contraseña');
    }
  };

  console.log('Public Report State:', { 
    reportId, 
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted,
    hasReport: !!report
  });

  // Show password dialog if protected and access not granted
  if (isPasswordProtected && !accessGranted && !isLoading) {
    return (
      <PasswordProtectionDialog 
        onSubmit={handlePasswordSubmit}
        onCancel={() => window.history.back()}
        type="report"
        error={passwordError}
      />
    );
  }
  
  // Loading state
  if (isLoading) {
    return <PublicReportLoading />;
  }
  
  // Error state
  if (error || !report) {
    return <PublicReportError errorMessage={error || 'No se pudo cargar el informe'} />;
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
