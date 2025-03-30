
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
  
  console.log('PublicReport page loaded with reportId:', reportId);
  
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
    if (!passwordInput.trim()) {
      setShowError(true);
      return;
    }
    
    setVerifying(true);
    setShowError(false);
    
    console.log('Verifying password for report:', reportId);
    const success = await verifyPassword(passwordInput);
    
    if (success) {
      console.log('Password verification successful');
      await refetch();
    } else {
      console.log('Password verification failed');
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
    console.error('Error loading report:', error);
    return <PublicReportError errorMessage={error} />;
  }

  // Show password protection dialog
  if (isPasswordProtected && !accessGranted) {
    console.log('Report is password protected and access not granted');
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
    console.log('No report found');
    return <PublicReportEmpty />;
  }

  console.log('Rendering report:', report);
  
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
