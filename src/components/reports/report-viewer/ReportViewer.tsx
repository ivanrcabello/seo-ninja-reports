
import React, { useEffect, useState } from 'react';
import { Report } from '@/types/report.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ReportHeader from '../ReportHeader';
import ReportTabs from './ReportTabs';
import { getPageSpeedData } from '@/services/api/pagespeed/getPageSpeedData';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import ReportEditDialog from '../ReportEditDialog';
import { updateExistingReport } from '@/services/reportService';

interface ReportViewerProps {
  report: Report | undefined;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ 
  report, 
  isEditing = false, 
  setIsEditing = () => {} 
}) => {
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editMode = searchParams.get('mode') === 'edit';
    setIsEditing(editMode);
  }, [location.search, setIsEditing]);
  
  useEffect(() => {
    const fetchPageSpeedData = async () => {
      if (!report || !report.id) return;
      
      try {
        setIsLoadingPageSpeed(true);
        const data = await getPageSpeedData(report.id);
        
        if (data) {
          console.log('PageSpeed data loaded:', data);
          setPageSpeedData(data);
        } else {
          console.log('No PageSpeed data found for report:', report.id);
        }
      } catch (error) {
        console.error('Error fetching PageSpeed data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de PageSpeed",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPageSpeed(false);
      }
    };
    
    fetchPageSpeedData();
  }, [report, toast]);

  const handleEditSection = (section: string, content: string) => {
    setActiveSection(section);
    setEditContent(content);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!report || !activeSection) return;
    
    try {
      const updatedContent = {
        ...report.content,
        [activeSection]: editContent
      };
      
      await updateExistingReport(report.id, { content: updatedContent });
      
      if (report && report.content) {
        report.content[activeSection as keyof typeof report.content] = editContent as never;
      }
      
      toast({
        title: "Guardado",
        description: "Contenido actualizado correctamente",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el contenido",
        variant: "destructive"
      });
    }
  };

  const getSectionTitle = (section: string): string => {
    switch (section) {
      case 'executiveSummary': return 'Resumen Ejecutivo';
      case 'technicalAnalysis': return 'Análisis Técnico SEO';
      case 'contentAnalysis': return 'Análisis de Contenido';
      case 'backlinksAnalysis': return 'Análisis de Backlinks';
      case 'localSeo': return 'SEO Local';
      case 'recommendations': return 'Recomendaciones';
      case 'serviceProposal': return 'Propuesta de Servicios';
      case 'keywords': return 'Palabras Clave';
      default: return 'Sección';
    }
  };

  if (!report) {
    return (
      <div className="p-8 text-center rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm">
        <h2 className="text-xl font-medium text-muted-foreground">Informe no encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">El informe que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden backdrop-blur-sm border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
        <ReportHeader 
          title={report.title} 
          date={report.date} 
          url={report.url} 
          isEditing={isEditing} 
          setIsEditing={setIsEditing}
          reportId={report.id}
          variant="simple"
        />
      </CardHeader>
      <CardContent className="overflow-auto flex-1 p-0 pt-4">
        <ReportTabs 
          report={report} 
          pageSpeedData={pageSpeedData} 
          isLoadingPageSpeed={isLoadingPageSpeed} 
          isEditing={isEditing}
          onEdit={handleEditSection}
        />
      </CardContent>
      
      <ReportEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        activeSection={activeSection}
        editContent={editContent}
        setEditContent={setEditContent}
        onSave={handleSaveEdit}
        getSectionTitle={getSectionTitle}
      />
    </Card>
  );
};

export default ReportViewer;
