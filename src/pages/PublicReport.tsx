
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { useToast } from '@/hooks/use-toast';
import PublicReportHeader from '@/components/public-reports/PublicReportHeader';
import PublicReportContent from '@/components/public-reports/PublicReportContent';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';

const PublicReport = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID de informe no especificado');
        }
        
        console.log('Fetching public report with ID:', id);
        
        // Use the anonymous access provided by RLS policies
        const { data, error: fetchError } = await supabase
          .from('reports')
          .select('*, clients(name, website)')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching public report:', fetchError);
          throw new Error('No se pudo cargar el informe. Es posible que no exista o que no tengas permisos para verlo.');
        }
        
        if (!data) {
          console.error('No data returned for public report ID:', id);
          throw new Error('Informe no encontrado');
        }
        
        console.log('Public report data retrieved successfully:', data);
        
        // Safely type check the content from the database
        let reportContent;
        if (data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
          reportContent = {
            executiveSummary: data.content.executiveSummary || '',
            technicalAnalysis: data.content.technicalAnalysis || '',
            contentAnalysis: data.content.contentAnalysis || '',
            backlinksAnalysis: data.content.backlinksAnalysis || '',
            recommendations: data.content.recommendations || ''
          };
        } else {
          // Initialize with empty values if content is not in expected format
          reportContent = {
            executiveSummary: '',
            technicalAnalysis: '',
            contentAnalysis: '',
            backlinksAnalysis: '',
            recommendations: ''
          };
        }
        
        const formattedReport: Report = {
          id: data.id,
          clientId: data.client_id,
          title: data.title,
          date: data.date,
          status: data.status as 'processing' | 'completed' | 'failed',
          url: data.url,
          summary: data.summary,
          content: reportContent,
          customPrompt: data.custom_prompt
        };
        
        setReport(formattedReport);
        
        // Show success toast when report is loaded
        toast({
          title: 'Informe cargado',
          description: 'El informe se ha cargado correctamente',
        });
      } catch (err: any) {
        console.error('Error loading public report:', err);
        setError(err.message || 'No se pudo cargar el informe. Es posible que no exista o que no tengas permisos para verlo.');
        
        // Show error toast
        toast({
          title: 'Error',
          description: err.message || 'No se pudo cargar el informe',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchReport();
    }
  }, [id, toast]);

  if (loading) {
    return <PublicReportLoading />;
  }

  if (error || !report) {
    return <PublicReportError errorMessage={error} />;
  }

  if (!report.content) {
    return <PublicReportEmpty />;
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <PublicReportHeader 
        title={report.title} 
        date={report.date} 
        url={report.url} 
      />
      
      <PublicReportContent content={report.content} />
    </div>
  );
};

export default PublicReport;
