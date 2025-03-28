
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import PublicReportHeader from '@/components/public-reports/PublicReportHeader';
import PublicReportContent from '@/components/public-reports/PublicReportContent';
import PublicReportError from '@/components/public-reports/PublicReportError';
import PublicReportLoading from '@/components/public-reports/PublicReportLoading';
import PublicReportEmpty from '@/components/public-reports/PublicReportEmpty';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';

interface PublicReportData extends Report {
  client_name?: string;
  client_website?: string;
}

const PublicReport = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<PublicReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string) => {
    try {
      // Call function to verify password
      const { data, error: verifyError } = await supabase
        .rpc('verify_shared_report_password', { 
          report_id_param: id || '',
          password_param: password
        });
      
      if (verifyError) throw new Error(verifyError.message);
      
      if (data === true) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        fetchReport();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        throw new Error('ID de informe no especificado');
      }
      
      console.log('Fetching public report with ID:', id);
      
      // Check if report is password protected without requiring the password
      const { data: protectionData, error: protectionError } = await supabase
        .rpc('check_report_password_protection', { 
          report_id_param: id 
        });
      
      if (protectionError) throw new Error(protectionError.message);
      
      // If password protected and access not granted yet, show password dialog
      if (protectionData === true && !accessGranted) {
        setIsPasswordProtected(true);
        setIsPasswordDialogOpen(true);
        setLoading(false);
        return;
      }
      
      // Use the public_reports view that doesn't require authentication
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
          recommendations: data.content.recommendations || '',
          localSeo: data.content.localSeo || '',
          serviceProposal: data.content.serviceProposal || '',
          keywords: data.content.keywords || '',
          businessProfile: data.content.businessProfile || null
        };
      } else {
        // Initialize with empty values if content is not in expected format
        reportContent = {
          executiveSummary: '',
          technicalAnalysis: '',
          contentAnalysis: '',
          backlinksAnalysis: '',
          recommendations: '',
          localSeo: '',
          serviceProposal: '',
          keywords: ''
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
      toast.success('Informe cargado correctamente');
    } catch (err: any) {
      console.error('Error loading public report:', err);
      setError(err.message || 'No se pudo cargar el informe. Es posible que no exista o que no tengas permisos para verlo.');
      
      // Show error toast
      toast.error('Error', {
        description: err.message || 'No se pudo cargar el informe'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  if (isPasswordDialogOpen) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => setError('Acceso denegado')}
        type="report"
      />
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6 flex flex-col items-center">
      <PublicReportHeader 
        title={report.title} 
        date={report.date} 
        url={report.url}
        clientName={report.client_name}
        clientWebsite={report.client_website}
      />
      
      <PublicReportContent content={report.content} />
      
      <div className="w-full max-w-5xl mx-auto mt-16 p-6 bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-sm rounded-lg border border-primary/10 shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-center">¿Necesitas ayuda con tu SEO?</h3>
        <p className="text-center text-muted-foreground mb-4">
          Nuestro equipo de expertos está listo para ayudarte a mejorar tu presencia en línea.
        </p>
        <div className="flex justify-center">
          <a 
            href="https://soyseolocal.com/contacto" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicReport;
