
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import BlurredCard from '../ui/BlurredCard';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { toast } from 'sonner';
import ReportGeneratorHeader from './report-steps/ReportGeneratorHeader';
import ReportGeneratorStep1 from './report-steps/ReportGeneratorStep1';
import ReportGeneratorStep2 from './report-steps/ReportGeneratorStep2';

interface ReportGeneratorProps {
  clientId: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [customPrompt, setCustomPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || '';
  });
  
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const navigate = useNavigate();
  
  const client = getClient(clientId);
  const hasGoogleApiKey = !!localStorage.getItem('google_pagespeed_api_key');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Generating report for client:', clientId, 'URL:', url);
      const report = await generateReport(clientId, url, files, customPrompt);
      
      console.log('Report generated successfully:', report);
      
      if (report && report.id) {
        toast.success('Informe creado', {
          description: 'Informe creado exitosamente',
        });
        
        // Small delay to ensure the report is fully saved in the database
        setTimeout(() => {
          navigate(`/reports/${report.id}`);
        }, 500);
      } else {
        throw new Error('El informe no tiene un ID válido');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error('Error', {
        description: error.message || 'Error al generar informe',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (url) {
      setStep(2);
    }
  };

  const previousStep = () => {
    setStep(1);
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <ReportGeneratorHeader clientName={client?.name} />
        
        {step === 1 ? (
          <ReportGeneratorStep1
            url={url}
            setUrl={setUrl}
            hasGoogleApiKey={hasGoogleApiKey}
            nextStep={nextStep}
          />
        ) : (
          <ReportGeneratorStep2
            files={files}
            setFiles={setFiles}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            hasGoogleApiKey={hasGoogleApiKey}
            isLoading={isLoading}
            previousStep={previousStep}
            handleSubmit={handleSubmit}
          />
        )}
      </Card>
    </BlurredCard>
  );
};

export default ReportGenerator;
