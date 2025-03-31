
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { PublicReportContent, PublicReportEmpty, PublicReportError, PublicReportHeader, PublicReportLoading, useReportData } from '@/components/public-reports';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';
import { toast } from 'sonner';

const PublicReport: React.FC = () => {
  const navigate = useNavigate();
  const { reportId = '' } = useParams<{ reportId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  
  console.log('PublicReport page loaded with reportId:', reportId);
  
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted, 
    verifyPassword,
    refetch,
    notFound
  } = useReportData(reportId);

  useEffect(() => {
    if (reportId) {
      console.log(`PublicReport page initialized with reportId: ${reportId}`);
      // Log page view
      logSharedReportAccess(reportId, { 
        successful: true,
        action: 'page_view' 
      }, 'page_view');
    } else {
      console.error('No reportId parameter found in URL');
    }
  }, [reportId]);
  
  const handleVerifyPassword = async () => {
    if (!passwordInput.trim()) {
      setShowError(true);
      return;
    }
    
    setVerifying(true);
    setShowError(false);
    
    try {
      console.log('Verifying password for report:', reportId);
      const success = await verifyPassword(passwordInput);
      
      if (success) {
        console.log('Password verification successful, refetching report data');
        await refetch();
        toast.success('Acceso concedido', {
          description: 'Contraseña correcta. Cargando informe...'
        });
      } else {
        console.log('Password verification failed');
        setShowError(true);
        toast.error('Contraseña incorrecta');
      }
    } catch (err) {
      console.error('Error during password verification:', err);
      setShowError(true);
      toast.error('Error al verificar la contraseña');
    } finally {
      setVerifying(false);
    }
  };
  
  const handleRetry = () => {
    console.log('Retrying report fetch manually');
    setLoadRetries(prev => prev + 1);
    refetch();
    toast.info('Reintentando cargar el informe...');
  };

  // Show loading state
  if (isLoading) {
    console.log('PublicReport: Showing loading state');
    return <PublicReportLoading timeout={20000} />;
  }

  // Show error state
  if (error) {
    console.error('PublicReport: Error loading report:', error);
    return (
      <PublicReportError 
        errorMessage={error} 
        onRetry={handleRetry} 
        retryCount={loadRetries}
      />
    );
  }

  // Show not found state
  if (notFound) {
    console.log('PublicReport: Report not found, showing empty state');
    return <PublicReportEmpty onBack={() => navigate('/')} />;
  }

  // Show password protection dialog
  if (isPasswordProtected && !accessGranted) {
    console.log('PublicReport: Showing password protection dialog');
    return (
      <PasswordProtectionDialog
        isOpen={true}
        onClose={() => {}}
        title="Informe Protegido"
        description="Este informe está protegido con contraseña. Por favor, introduce la contraseña para acceder."
        password={passwordInput}
        setPassword={setPasswordInput}
        onVerify={handleVerifyPassword}
        isVerifying={verifying}
        showError={showError}
        errorMessage="Contraseña incorrecta. Por favor, inténtalo de nuevo."
      />
    );
  }

  // Show empty state if no report found
  if (!report) {
    console.log('PublicReport: No report found, showing empty state');
    return <PublicReportEmpty onBack={() => navigate('/')} />;
  }

  console.log('PublicReport: Rendering report content:', report);
  
  // Show report content
  return (
    <div className="min-h-screen bg-background">
      <PublicReportHeader 
        title={report.title || "Informe SEO"} 
        client={report.client_name}
        website={report.client_website}
        date={report.date}
      />
      
      <div className="container mx-auto py-8">
        <PublicReportContent report={report} />
      </div>
    </div>
  );
};

export default PublicReport;
