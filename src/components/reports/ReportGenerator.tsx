import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import BlurredCard from '../ui/BlurredCard';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { toast } from 'sonner';
import { useReportGenerator } from '@/context/ReportGeneratorContext';
import { useCrawler } from '@/hooks/useCrawler';
import { PDFExtractor } from '@/utils/PDFExtractor';
import { fetchClientSeoReports } from '@/services/seoReport';
import { SeoReport } from '@/types/seo-reporting.types';

// Import steps
import ReportGeneratorHeader from './report-steps/ReportGeneratorHeader';
import CrawlDataStep from './report-steps/CrawlDataStep';
import UrlAndSpeedStep from './report-steps/UrlAndSpeedStep';
import BusinessProfileStep from './report-steps/BusinessProfileStep';
import KeywordsStep from './report-steps/KeywordsStep';
import DocumentsAndNotesStep from './report-steps/DocumentsAndNotesStep';
import ReviewAndGenerateStep from './report-steps/ReviewAndGenerateStep';

interface ReportGeneratorProps {
  clientId: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const {
    url, setUrl,
    files, setFiles,
    pageSpeedData,
    customPrompt, 
    keywords,
    notes,
    businessProfile,
    usePageSpeedData,
    useGmbData,
    useKeywordsData,
    selectedSeoReport,
    crawlId,
    crawlData,
    useCrawlData,
    setCrawlId,
    setCrawlData,
    reset
  } = useReportGenerator();
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const { getCrawl } = useCrawler();
  const navigate = useNavigate();
  const location = useLocation();
  
  const client = getClient(clientId);
  const hasGoogleApiKey = !!localStorage.getItem('google_pagespeed_api_key');
  const hasOpenAIApiKey = !!localStorage.getItem('openai_api_key');

  // Check for crawlId in query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const crawlIdParam = params.get('crawlId');
    
    if (crawlIdParam) {
      setCrawlId(crawlIdParam);
      const crawlData = getCrawl(crawlIdParam);
      
      if (crawlData) {
        setCrawlData(crawlData);
        // Set URL from crawl data
        setUrl(crawlData.url || '');
      }
    }
  }, [location, setCrawlId, setCrawlData, getCrawl, setUrl]);

  const clearPersistedData = () => {
    // Clear all persisted data
    reset();
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
      
      const formattedKeywords = keywords.map(k => ({
        keyword: k.keyword,
        searchVolume: k.searchVolume ? parseInt(k.searchVolume as string) : undefined,
        difficulty: k.difficulty ? parseInt(k.difficulty as string) : undefined
      }));
      
      // Generate the report with the proper parameters
      const report = await generateReport(
        clientId, 
        url, 
        files, 
        customPrompt, 
        usePageSpeedData ? pageSpeedData : null,
        useKeywordsData ? formattedKeywords : [],
        notes,
        useGmbData ? businessProfile : null,
        selectedSeoReport ? { 
          id: selectedSeoReport,
          clientId: clientId,
          domain: url.replace(/^https?:\/\//, '').split('/')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : undefined
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
    if (step < 6) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <ReportGeneratorHeader clientName={client?.name} step={step} totalSteps={6} />
        
        {!hasOpenAIApiKey && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">No has configurado una API key de OpenAI</p>
            <p className="text-sm">Debes configurar una API key válida en la sección de Configuración para generar informes.</p>
          </div>
        )}
        
        {step === 1 && (
          <CrawlDataStep
            nextStep={goToNextStep}
            crawlId={crawlId}
            crawlData={crawlData}
            useCrawlData={useCrawlData}
          />
        )}
        
        {step === 2 && (
          <UrlAndSpeedStep
            nextStep={goToNextStep}
            previousStep={goToPreviousStep}
            hasGoogleApiKey={hasGoogleApiKey}
          />
        )}
        
        {step === 3 && (
          <BusinessProfileStep
            nextStep={goToNextStep}
            previousStep={goToPreviousStep}
          />
        )}
        
        {step === 4 && (
          <KeywordsStep
            nextStep={goToNextStep}
            previousStep={goToPreviousStep}
          />
        )}
        
        {step === 5 && (
          <DocumentsAndNotesStep
            nextStep={goToNextStep}
            previousStep={goToPreviousStep}
          />
        )}
        
        {step === 6 && (
          <ReviewAndGenerateStep
            previousStep={goToPreviousStep}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </Card>
    </BlurredCard>
  );
};

export default ReportGenerator;
