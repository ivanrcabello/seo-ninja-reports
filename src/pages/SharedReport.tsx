
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useReportData from '@/components/public-reports/useReportData';
import PublicReportContent from '@/components/public-reports/PublicReportContent';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';
import sharedContentLogger from '@/utils/sharedContentLogger';

const SharedReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword
  } = useReportData(reportId || '');

  sharedContentLogger.info('Public Report State:', {
    reportId,
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted,
    hasReport: !!report
  });

  // Handle password verification
  const handlePasswordSubmit = async (password: string) => {
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        setIsPasswordDialogOpen(false);
        setPasswordError(null);
        return;
      } else {
        setPasswordError('Contraseña incorrecta');
        return 'Contraseña incorrecta';
      }
    } catch (err) {
      setPasswordError('Error al verificar la contraseña');
      return 'Error al verificar la contraseña';
    }
  };

  // Show password dialog if needed
  React.useEffect(() => {
    if (isPasswordProtected && !accessGranted && !isLoading && !isPasswordDialogOpen) {
      setIsPasswordDialogOpen(true);
    }
  }, [isPasswordProtected, accessGranted, isLoading, isPasswordDialogOpen]);

  // Determine what to render
  if (isLoading) {
    return <PublicReportLoading />;
  }

  if (error) {
    return <PublicReportError errorMessage={error} />;
  }

  if (isPasswordProtected && !accessGranted) {
    return (
      <PasswordProtectionDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSubmit={handlePasswordSubmit}
        onCancel={() => {}} // No-op, handled by onOpenChange
        type="report"
        error={passwordError}
      />
    );
  }

  if (!report || !report.content) {
    return <PublicReportEmpty />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-background/80 backdrop-blur-sm border border-primary/10 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-primary/10">
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <div className="text-sm text-muted-foreground mt-2">
              <p>{report.client_name} {report.client_website && (
                <span>• <a href={report.client_website.startsWith('http') ? report.client_website : `https://${report.client_website}`} 
                   target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:underline">{report.client_website}</a></span>
              )}</p>
              <p className="mt-1">Generado el {new Date(report.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
          
          <div className="p-6">
            <PublicReportContent report={report} />
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SEO Local • Informe SEO Confidencial</p>
        </div>
      </div>
    </div>
  );
};

export default SharedReport;
