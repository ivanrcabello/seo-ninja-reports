
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlurredCard from '../ui/BlurredCard';
import { Report } from '@/types/report.types';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';
import ReportSection from './ReportSection';
import ReportHeader from './ReportHeader';
import ReportEditDialog from './ReportEditDialog';

interface ReportViewerProps {
  report: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const { id, title, date, url, content } = report;
  const { updateReport } = useReports();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  
  if (!content) {
    return (
      <BlurredCard className="p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No hay contenido disponible</h3>
        <p className="text-muted-foreground">Este informe aún no tiene contenido.</p>
      </BlurredCard>
    );
  }
  
  const handleEditSection = (section: string, sectionContent: string) => {
    setActiveSection(section);
    setEditContent(sectionContent);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!activeSection || !editContent.trim()) return;
    
    const updatedContent = { ...content };
    
    // Update the appropriate section
    switch (activeSection) {
      case 'executiveSummary':
        updatedContent.executiveSummary = editContent;
        break;
      case 'technicalAnalysis':
        updatedContent.technicalAnalysis = editContent;
        break;
      case 'contentAnalysis':
        updatedContent.contentAnalysis = editContent;
        break;
      case 'backlinksAnalysis':
        updatedContent.backlinksAnalysis = editContent;
        break;
      case 'recommendations':
        updatedContent.recommendations = editContent;
        break;
      default:
        break;
    }
    
    try {
      await updateReport(report.id, { content: updatedContent });
      toast.success('Sección actualizada correctamente');
      setEditDialogOpen(false);
    } catch (error) {
      toast.error('Error al actualizar la sección');
      console.error('Error updating report section:', error);
    }
  };
  
  const getSectionTitle = (section: string): string => {
    switch (section) {
      case 'executiveSummary':
        return 'Resumen Ejecutivo';
      case 'technicalAnalysis':
        return 'Análisis Técnico';
      case 'contentAnalysis':
        return 'Análisis de Contenido';
      case 'backlinksAnalysis':
        return 'Análisis de Backlinks y Autoridad';
      case 'recommendations':
        return 'Recomendaciones y Acciones';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-8">
      <ReportHeader 
        title={title} 
        date={date} 
        url={url} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
        reportId={id}
      />
      
      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10">
          <TabsTrigger value="executive-summary" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="technical" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Técnico</TabsTrigger>
          <TabsTrigger value="content" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contenido</TabsTrigger>
          <TabsTrigger value="backlinks" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Backlinks</TabsTrigger>
          <TabsTrigger value="recommendations" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recomendaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive-summary">
          <ReportSection
            title="Resumen Ejecutivo"
            content={content.executiveSummary}
            sectionKey="executiveSummary"
            onEdit={handleEditSection}
            isEditing={isEditing}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="technical">
          <ReportSection
            title="Análisis Técnico"
            content={content.technicalAnalysis}
            sectionKey="technicalAnalysis"
            onEdit={handleEditSection}
            isEditing={isEditing}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="content">
          <ReportSection
            title="Análisis de Contenido"
            content={content.contentAnalysis}
            sectionKey="contentAnalysis"
            onEdit={handleEditSection}
            isEditing={isEditing}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="backlinks">
          <ReportSection
            title="Análisis de Backlinks y Autoridad"
            content={content.backlinksAnalysis}
            sectionKey="backlinksAnalysis"
            onEdit={handleEditSection}
            isEditing={isEditing}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <ReportSection
            title="Recomendaciones y Acciones"
            content={content.recommendations}
            sectionKey="recommendations"
            onEdit={handleEditSection}
            isEditing={isEditing}
            delay={0}
            isRecommendations
          />
        </TabsContent>
      </Tabs>
      
      <ReportEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        activeSection={activeSection}
        editContent={editContent}
        setEditContent={setEditContent}
        onSave={handleSaveEdit}
        getSectionTitle={getSectionTitle}
      />
    </div>
  );
};

export default ReportViewer;
