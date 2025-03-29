
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { PublicReportContent, PublicReportEmpty, PublicReportError, PublicReportHeader, PublicReportLoading } from '@/components/public-reports';
import useReportData from '@/components/public-reports/useReportData';

const PublicReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted, 
    verifyPassword,
    refetch 
  } = useReportData(reportId || '');

  const handleVerifyPassword = async () => {
    setVerifying(true);
    setShowError(false);
    
    const success = await verifyPassword(passwordInput);
    
    if (success) {
      await refetch();
    } else {
      setShowError(true);
    }
    
    setVerifying(false);
  };

  // Show loading state
  if (isLoading) {
    return <PublicReportLoading />;
  }

  // Show error state
  if (error) {
    return <PublicReportError message={error} />;
  }

  // Show password protection dialog
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

  // Show empty state if no report found
  if (!report) {
    return <PublicReportEmpty />;
  }

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
