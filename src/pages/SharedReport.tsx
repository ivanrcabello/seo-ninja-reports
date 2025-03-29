
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportContent } from '@/components/public-reports';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';
import { useReportData } from '@/components/public-reports/useReportData';

const SharedReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [passwordInputOpen, setPasswordInputOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Using the custom hook to fetch report data
  const { 
    report, 
    isLoading, 
    error, 
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch
  } = useReportData(reportId || '');

  // Handle password submission
  const handlePasswordSubmit = async (password: string) => {
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        setPasswordInputOpen(false);
        await refetch();
      } else {
        setErrorMessage("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      setErrorMessage("Error al verificar la contraseña. Por favor, inténtalo de nuevo.");
    }
  };

  // Handle closing the password dialog
  const handleCancel = () => {
    setPasswordInputOpen(false);
  };

  // If the report requires a password and access is not granted, show the password dialog
  React.useEffect(() => {
    if (isPasswordProtected && !accessGranted && !isLoading && !error) {
      setPasswordInputOpen(true);
    }
  }, [isPasswordProtected, accessGranted, isLoading, error]);

  // Show appropriate UI based on the state
  if (isLoading) {
    return <PublicReportLoading />;
  }

  if (error) {
    return <PublicReportError errorMessage={error} />;
  }

  if (!report) {
    return <PublicReportEmpty />;
  }

  return (
    <>
      <PublicReportContent 
        report={report}
        passwordRequired={isPasswordProtected && !accessGranted}
        onPasswordRequested={() => setPasswordInputOpen(true)}
        errorMessage={errorMessage}
        passwordInputOpen={passwordInputOpen}
        onPasswordSubmit={handlePasswordSubmit}
        onPasswordCancel={handleCancel}
      />
    </>
  );
};

export default SharedReport;
