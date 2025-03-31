
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSharedReportData } from './hooks/useSharedReportData';
import PublicReportContent from './PublicReportContent';
import PublicReportLoading from './PublicReportLoading';
import PublicReportEmpty from './PublicReportEmpty';
import PublicReportError from './PublicReportError';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { toast } from 'sonner';

const SharedReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [retryCount, setRetryCount] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted,
    verifyPassword 
  } = useSharedReportData(reportId || '');

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      window.location.reload();
    }
  };

  const handleVerifyPassword = async () => {
    if (!passwordInput.trim()) {
      setShowError(true);
      return;
    }
    
    setVerifying(true);
    setShowError(false);
    
    try {
      const success = await verifyPassword(passwordInput);
      
      if (success) {
        toast.success('Acceso concedido');
      } else {
        setShowError(true);
        toast.error('Contraseña incorrecta');
      }
    } catch (err) {
      setShowError(true);
      toast.error('Error al verificar la contraseña');
    } finally {
      setVerifying(false);
    }
  };

  if (isPasswordProtected && !accessGranted) {
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

  if (isLoading) {
    return <PublicReportLoading onRetry={handleRetry} />;
  }

  if (error) {
    return (
      <PublicReportError 
        errorMessage={error}
        onRetry={handleRetry}
        onHome={() => window.location.href = '/'}
        retryCount={retryCount}
      />
    );
  }

  if (!report) {
    return (
      <PublicReportEmpty 
        onRetry={handleRetry}
        onBack={() => window.location.href = '/'}
      />
    );
  }

  return <PublicReportContent report={report} />;
};

export default SharedReport;
