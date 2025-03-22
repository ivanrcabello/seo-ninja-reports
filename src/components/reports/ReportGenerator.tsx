import React, { useState, useEffect } from 'react';
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
import ReportGeneratorStep5 from './report-steps/ReportGeneratorStep5';
import { BusinessProfile } from '@/types/report.types';
import usePersistentState from '@/hooks/usePersistentState';
import { PDFExtractor } from '@/utils/PDFExtractor';
import { fetchClientSeoReports } from '@/services/seoReport';
import { SeoReport } from '@/types/seo-reporting.types';

interface ReportGeneratorProps {
  clientId: string;
}

interface Keyword {
  keyword: string;
  searchVolume?: string;
  difficulty?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const [url, setUrl] = usePersistentState<string>(`report-generator-url-${clientId}`, '');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = usePersistentState<1 | 2 | 3 | 4 | 5>(`report-generator-step-${clientId}`, 1);
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = usePersistentState<string>('report-generator-prompt', 
    localStorage.getItem('default_seo_prompt') || '');
  const [keywords, setKeywords] = usePersistentState<Keyword[]>(`report-generator-keywords-${clientId}`, []);
  const [notes, setNotes] = usePersistentState<string>(`report-generator-notes-${clientId}`, '');
  const [businessUrl, setBusinessUrl] = usePersistentState<string>(`report-generator-business-url-${clientId}`, '');
  const [businessProfile, setBusinessProfile] = usePersistentState<Partial<BusinessProfile> | null>(
    `report-generator-business-profile-${clientId}`, null);
  
  const [seoReports, setSeoReports] = useState<SeoReport[]>([]);
  const [selectedSeoReport, setSelectedSeoReport] = usePersistentState<string | null>(
    `report-generator-selected-seo-report-${clientId}`, null);
  const [usePageSpeedData, setUsePageSpeedData] = usePersistentState<boolean>(
    `report-generator-use-pagespeed-${clientId}`, true);
  const [useGmbData, setUseGmbData] = usePersistentState<boolean>(
    `report-generator-use-gmb-${clientId}`, true);
  const [useKeywordsData, setUseKeywordsData] = usePersistentState<boolean>(
    `report-generator-use-keywords-${clientId}`, true);
  
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const navigate = useNavigate();
  
  const client = getClient(clientId);
  const hasGoogleApiKey = !!localStorage.getItem('google_pagespeed_api_key');
  const hasOpenAIApiKey = !!localStorage.getItem('openai_api_key');

  useEffect(() => {
    const loadSeoReports = async () => {
      try {
        const reports = await fetchClientSeoReports(clientId);
        setSeoReports(reports);
        console.log('Loaded SEO reports:', reports.length);
      } catch (error) {
        console.error('Error loading SEO reports:', error);
      }
    };
    
    loadSeoReports();
  }, [clientId]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pageSpeedData === null) {
        const savedData = sessionStorage.getItem(`report-generator-pagespeed-${clientId}`);
        if (savedData) {
          try {
            setPageSpeedData(JSON.parse(savedData));
          } catch (e) {
            console.error('Error parsing saved PageSpeed data:', e);
          }
        }
      } else if (pageSpeedData !== null) {
        sessionStorage.setItem(`report-generator-pagespeed-${clientId}`, JSON.stringify(pageSpeedData));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clientId, pageSpeedData]);
  
  const clearPersistedData = () => {
    sessionStorage.removeItem(`report-generator-url-${clientId}`);
    sessionStorage.removeItem(`report-generator-step-${clientId}`);
    sessionStorage.removeItem(`report-generator-keywords-${clientId}`);
    sessionStorage.removeItem(`report-generator-notes-${clientId}`);
    sessionStorage.removeItem(`report-generator-business-url-${clientId}`);
    sessionStorage.removeItem(`report-generator-business-profile-${clientId}`);
    sessionStorage.removeItem(`report-generator-pagespeed-${clientId}`);
    sessionStorage.removeItem(`report-generator-selected-seo-report-${clientId}`);
    sessionStorage.removeItem(`report-generator-use-pagespeed-${clientId}`);
    sessionStorage.removeItem(`report-generator-use-gmb-${clientId}`);
    sessionStorage.removeItem(`report-generator-use-keywords-${clientId}`);
  };

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
      console.log('Using PageSpeed data:', usePageSpeedData ? pageSpeedData : 'No');
      console.log('Using GMB data:', useGmbData ? businessProfile : 'No');
      console.log('Using Keywords data:', useKeywordsData ? keywords : 'No');
      console.log('Selected SEO report:', selectedSeoReport);
      console.log('Notes:', notes);
      
      const formattedKeywords = keywords.map(k => ({
        keyword: k.keyword,
        searchVolume: k.searchVolume ? parseInt(k.searchVolume) : undefined,
        difficulty: k.difficulty ? parseInt(k.difficulty) : undefined
      }));
      
      const seoReportData = selectedSeoReport 
        ? seoReports.find(r => r.id === selectedSeoReport) || null
        : null;
      
      console.log('SEO report data:', seoReportData);
      
      const report = await generateReport(
        clientId, 
        url, 
        files, 
        customPrompt, 
        usePageSpeedData ? pageSpeedData : null,
        useKeywordsData ? formattedKeywords : [],
        notes,
        useGmbData ? businessProfile : null,
        seoReportData
      );
      
      console.log('Report generated successfully:', report);
      
      if (report && report.id) {
        toast.success('Informe creado', {
          description: 'Informe creado exitosamente',
        });
        
        clearPersistedData();
        
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
    if (step < 5) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
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
            usePageSpeedData={usePageSpeedData}
            setUsePageSpeedData={setUsePageSpeedData}
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
            useGmbData={useGmbData}
            setUseGmbData={setUseGmbData}
          />
        )}
        
        {step === 3 && (
          <ReportGeneratorStep3
            keywords={keywords}
            setKeywords={setKeywords}
            isLoading={isLoading}
            previousStep={goToPreviousStep}
            nextStep={goToNextStep}
            useKeywordsData={useKeywordsData}
            setUseKeywordsData={setUseKeywordsData}
          />
        )}
        
        {step === 4 && (
          <ReportGeneratorStep4
            notes={notes}
            setNotes={setNotes}
            seoReports={seoReports}
            selectedSeoReport={selectedSeoReport}
            setSelectedSeoReport={setSelectedSeoReport}
            isLoading={isLoading}
            previousStep={goToPreviousStep}
            nextStep={goToNextStep}
          />
        )}
        
        {step === 5 && (
          <ReportGeneratorStep5
            url={url}
            usePageSpeedData={usePageSpeedData}
            useGmbData={useGmbData}
            useKeywordsData={useKeywordsData}
            selectedSeoReport={selectedSeoReport ? seoReports.find(r => r.id === selectedSeoReport) : null}
            filesCount={files.length}
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
