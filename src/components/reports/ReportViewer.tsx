
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Download, Share, Calendar, Globe, Activity, PenLine, Save, CheckCircle } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import AnimatedContainer from '../ui/AnimatedContainer';
import { Report } from '@/types/report.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';

interface ReportViewerProps {
  report: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const { title, date, url, content } = report;
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
      <BlurredCard className="w-full bg-gradient-to-r from-background/80 to-background/50 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary-foreground">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(date), 'd MMM yyyy', { locale: es })}</span>
              </div>
              {url && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 self-end md:self-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <CheckCircle className="h-4 w-4 group-hover:text-primary-foreground" />
                  <span className="hidden sm:inline">Terminar Edición</span>
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 group-hover:text-primary-foreground" />
                  <span className="hidden sm:inline">Editar</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all">
              <Download className="h-4 w-4 group-hover:text-primary-foreground" />
              <span className="hidden sm:inline">Descargar</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all">
              <Share className="h-4 w-4 group-hover:text-primary-foreground" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
          </div>
        </div>
      </BlurredCard>
      
      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
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
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl glass">
          <DialogHeader>
            <DialogTitle>Editar {activeSection ? getSectionTitle(activeSection) : ''}</DialogTitle>
            <DialogDescription>
              Modifica el contenido de esta sección del informe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReportSectionProps {
  title: string;
  content: string;
  sectionKey: string;
  onEdit: (section: string, content: string) => void;
  isEditing: boolean;
  delay?: number;
  isRecommendations?: boolean;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  content,
  sectionKey,
  onEdit,
  isEditing,
  delay = 0,
  isRecommendations = false
}) => {
  // Format content based on type
  const formattedContent = isRecommendations
    ? content.split('\n').map((item, i) => {
        if (!item.trim()) return null;
        return (
          <div key={i} className="flex items-start gap-3 p-4 bg-background/50 rounded-lg mb-3 backdrop-blur-sm shadow-sm border border-primary/5 hover:border-primary/10 transition-colors">
            <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {(i + 1)}
            </div>
            <div className="flex-1">{item.replace(/^\d+\.\s*/, '')}</div>
          </div>
        );
      }).filter(Boolean)
    : content.split('\n').map((paragraph, i) => {
        if (!paragraph.trim()) return null;
        return (
          <p key={i} className="mb-4 last:mb-0 leading-relaxed">
            {paragraph}
          </p>
        );
      }).filter(Boolean);

  return (
    <AnimatedContainer animation="fade" delay={delay} className="mt-4">
      <BlurredCard className="glass-card bg-gradient-to-br from-background/90 to-background/70">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
          {isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit(sectionKey, content)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </CardHeader>
        <Separator className="bg-primary/10" />
        <CardContent className="pt-6">
          <div className="prose prose-sm md:prose-base max-w-none">
            {formattedContent}
          </div>
        </CardContent>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default ReportViewer;
