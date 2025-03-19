
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlurredCard from '@/components/ui/BlurredCard';
import { Report } from '@/types/report.types';
import { formatReportContent } from '@/utils/reportUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Globe, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

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
        
        // Fetch the report using the public anon access
        const { data, error: fetchError } = await supabase
          .from('reports')
          .select('*, clients(name, website)')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching report:', fetchError);
          throw new Error('No se pudo cargar el informe. Es posible que no exista o que no tengas permisos para verlo.');
        }
        
        if (!data) {
          throw new Error('Informe no encontrado');
        }
        
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
        console.error('Error loading report:', err);
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
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <BlurredCard className="w-full max-w-4xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-primary/10 rounded-full w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/10 rounded-full w-1/2 mx-auto mb-8"></div>
            <div className="h-32 bg-primary/5 rounded-lg w-full mx-auto"></div>
          </div>
        </BlurredCard>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <BlurredCard className="w-full max-w-4xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">{error || 'Informe no encontrado'}</p>
        </BlurredCard>
      </div>
    );
  }

  const { title, date, url, content } = report;

  if (!content) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <BlurredCard className="w-full max-w-4xl p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No hay contenido disponible</h3>
          <p className="text-muted-foreground">Este informe aún no tiene contenido.</p>
        </BlurredCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <BlurredCard className="w-full max-w-4xl mb-8 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-lg border-primary/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gradient-primary">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(date), 'd MMM yyyy', { locale: es })}</span>
              </div>
              {url && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full group hover:bg-primary/20 transition-all">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </BlurredCard>
      
      <div className="w-full max-w-4xl">
        <Tabs defaultValue="executive-summary" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10">
            <TabsTrigger value="executive-summary" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumen Ejecutivo</TabsTrigger>
            <TabsTrigger value="technical" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Técnico</TabsTrigger>
            <TabsTrigger value="content" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contenido</TabsTrigger>
            <TabsTrigger value="backlinks" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Backlinks</TabsTrigger>
            <TabsTrigger value="recommendations" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recomendaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="executive-summary">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Resumen Ejecutivo</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {formatReportContent(content.executiveSummary)}
              </div>
            </BlurredCard>
          </TabsContent>
          
          <TabsContent value="technical">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis Técnico</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {formatReportContent(content.technicalAnalysis)}
              </div>
            </BlurredCard>
          </TabsContent>
          
          <TabsContent value="content">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis de Contenido</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {formatReportContent(content.contentAnalysis)}
              </div>
            </BlurredCard>
          </TabsContent>
          
          <TabsContent value="backlinks">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis de Backlinks y Autoridad</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {formatReportContent(content.backlinksAnalysis)}
              </div>
            </BlurredCard>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Recomendaciones y Acciones</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {formatReportContent(content.recommendations)}
              </div>
            </BlurredCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicReport;
