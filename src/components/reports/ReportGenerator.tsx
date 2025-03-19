
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
import ReportGeneratorStep3 from './report-steps/ReportGeneratorStep3';
import ReportGeneratorStep4 from './report-steps/ReportGeneratorStep4';
import { BusinessProfile } from '@/types/report.types';

interface ReportGeneratorProps {
  clientId: string;
}

interface Keyword {
  keyword: string;
  searchVolume?: string;
  difficulty?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || '';
  });
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [notes, setNotes] = useState('');
  const [businessUrl, setBusinessUrl] = useState('');
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const navigate = useNavigate();
  
  const client = getClient(clientId);
  const hasGoogleApiKey = !!localStorage.getItem('google_pagespeed_api_key');
  const hasOpenAIApiKey = !!localStorage.getItem('openai_api_key');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Debes proporcionar una URL válida');
      return;
    }

    if (!hasOpenAIApiKey) {
      toast.error('Debes configurar una API key de OpenAI en la sección de Configuración');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Generating report for client:', clientId, 'URL:', url);
      console.log('Using PageSpeed data:', pageSpeedData);
      console.log('Keywords:', keywords);
      console.log('Notes:', notes);
      console.log('Business Profile:', businessProfile);
      
      // Format keywords for database storage
      const formattedKeywords = keywords.map(k => ({
        keyword: k.keyword,
        searchVolume: k.searchVolume ? parseInt(k.searchVolume) : undefined,
        difficulty: k.difficulty ? parseInt(k.difficulty) : undefined
      }));
      
      // Pass the pre-fetched PageSpeed data to the generateReport function
      const report = await generateReport(
        clientId, 
        url, 
        files, 
        customPrompt, 
        pageSpeedData, 
        formattedKeywords,
        notes,
        businessProfile
      );
      
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

  const goToNextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const nextStep = () => {
    if (step === 1 && !url) {
      toast.error('Debes proporcionar una URL válida');
      return;
    }
    goToNextStep();
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <ReportGeneratorHeader clientName={client?.name} />
        
        {!hasOpenAIApiKey && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">No has configurado una API key de OpenAI</p>
            <p className="text-sm">Debes configurar una API key válida en la sección de Configuración para generar informes.</p>
          </div>
        )}
        
        {step === 1 && (
          <ReportGeneratorStep1
            url={url}
            setUrl={setUrl}
            hasGoogleApiKey={hasGoogleApiKey}
            nextStep={nextStep}
            setPageSpeedData={setPageSpeedData}
          />
        )}
        
        {step === 2 && (
          <ReportGeneratorStep2
            files={files}
            setFiles={setFiles}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            hasGoogleApiKey={hasGoogleApiKey}
            pageSpeedDataFetched={!!pageSpeedData}
            isLoading={isLoading}
            previousStep={goToPreviousStep}
            nextStep={goToNextStep}
            businessUrl={businessUrl}
            setBusinessUrl={setBusinessUrl}
            businessProfile={businessProfile}
            setBusinessProfile={setBusinessProfile}
          />
        )}
        
        {step === 3 && (
          <ReportGeneratorStep3
            keywords={keywords}
            setKeywords={setKeywords}
            isLoading={isLoading}
            previousStep={goToPreviousStep}
            nextStep={goToNextStep}
          />
        )}
        
        {step === 4 && (
          <ReportGeneratorStep4
            notes={notes}
            setNotes={setNotes}
            isLoading={isLoading}
            previousStep={goToPreviousStep}
            handleSubmit={handleSubmit}
          />
        )}
      </Card>
    </BlurredCard>
  );
};

export default ReportGenerator;
