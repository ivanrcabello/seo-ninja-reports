
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

interface PublicReportData extends Report {
  client_name?: string;
  client_website?: string;
}

const PublicReport = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<PublicReportData | null>(null);
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
        
        // Use the public_reports view we created to avoid RLS issues
        const { data: publicReportData, error: fetchError } = await supabase
          .from('public_reports')
          .select('*')
          .eq('id', id);
        
        if (fetchError) {
          console.error('Error fetching public report:', fetchError);
          throw new Error(`Error al cargar informe: ${fetchError.message}`);
        }
        
        if (!publicReportData || publicReportData.length === 0) {
          console.error('No data returned for public report ID:', id);
          throw new Error(`Informe con ID ${id} no encontrado`);
        }
        
        console.log('Public report data retrieved successfully:', publicReportData[0]);
        
        const data = publicReportData[0];
        
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
        
        const formattedReport: PublicReportData = {
          id: data.id,
          clientId: '', // No client_id in the view but not needed for public display
          title: data.title,
          date: data.date,
          status: data.status as 'processing' | 'completed' | 'failed',
          url: data.url,
          summary: data.summary,
          content: reportContent,
          client_name: data.client_name,
          client_website: data.client_website
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
        clientName={report.client_name}
        clientWebsite={report.client_website}
      />
      
      <PublicReportContent content={report.content} />
    </div>
  );
};

export default PublicReport;
