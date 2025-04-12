import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import useReports from '@/hooks/useReports';
import { Loader2, Trash2, Check, Edit, SaveAll } from 'lucide-react';
import { Keyword, ReportTemplate } from '@/types/report-hooks.types';
import KeywordsList from '../keywords/KeywordsList';

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (template: ReportTemplate) => void;
  mode: 'save' | 'select';
  initialPrompt?: string;
  initialKeywords?: Keyword[];
  initialOptions?: {
    usePageSpeedData: boolean;
    useGmbData: boolean;
    useKeywordsData: boolean;
  };
  initialNotes?: string;
}

const TemplatesDialog: React.FC<TemplatesDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
  mode = 'save',
  initialPrompt = '',
  initialKeywords = [],
  initialOptions = {
    usePageSpeedData: true,
    useGmbData: true,
    useKeywordsData: true,
  },
  initialNotes = '',
}) => {
  const { saveReportTemplate, getReportTemplates, deleteReportTemplate } = useReports();
  
  const [activeTab, setActiveTab] = useState<string>(mode === 'save' ? 'create' : 'select');
  const [templateName, setTemplateName] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>(initialPrompt);
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [usePageSpeedData, setUsePageSpeedData] = useState<boolean>(initialOptions.usePageSpeedData);
  const [useGmbData, setUseGmbData] = useState<boolean>(initialOptions.useGmbData);
  const [useKeywordsData, setUseKeywordsData] = useState<boolean>(initialOptions.useKeywordsData);
  
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      loadTemplates();
      setTemplateName('');
      setCustomPrompt(initialPrompt);
      setKeywords(initialKeywords);
      setNotes(initialNotes);
      setUsePageSpeedData(initialOptions.usePageSpeedData);
      setUseGmbData(initialOptions.useGmbData);
      setUseKeywordsData(initialOptions.useKeywordsData);
      setActiveTab(mode === 'save' ? 'create' : 'select');
    }
  }, [open, initialPrompt, initialKeywords, initialNotes, initialOptions, mode]);
  
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const templatesData = await getReportTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar las plantillas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Debes proporcionar un nombre para la plantilla');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const templateData = {
        name: templateName,
        customPrompt,
        usePageSpeedData,
        useGmbData,
        useKeywordsData,
        keywords,
        notes
      };
      
      await saveReportTemplate(templateData);
      
      toast.success('Plantilla guardada correctamente');
      await loadTemplates();
      setActiveTab('select');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    try {
      setIsDeleting(true);
      
      await deleteReportTemplate(id);
      
      toast.success('Plantilla eliminada correctamente');
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar la plantilla');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSelectTemplate = (template: ReportTemplate) => {
    setSelectedTemplateId(template.id);
    
    if (onSelect) {
      onSelect(template);
      onOpenChange(false);
    }
  };
  
  const handleEditTemplate = (template: ReportTemplate) => {
    setTemplateName(template.name);
    setCustomPrompt(template.customPrompt);
    setKeywords(template.keywords);
    setNotes(template.notes);
    setUsePageSpeedData(template.usePageSpeedData);
    setUseGmbData(template.useGmbData);
    setUseKeywordsData(template.useKeywordsData);
    setActiveTab('create');
  };
  
  const handleRemoveKeyword = (index: number) => {
    setKeywords(prevKeywords => prevKeywords.filter((_, i) => i !== index));
  };
  
  const renderKeywordsSection = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Palabras clave incluidas</h3>
        <KeywordsList 
          keywords={keywords} 
          readOnly={true}
          showHeader={true}
        />
      </div>
    );
  };
  
  const renderTemplateCard = (template: ReportTemplate) => {
    return (
      <Card key={template.id} className="p-4 mb-4 relative">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{template.name}</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect && handleSelectTemplate(template)}
              >
                <Check className="h-4 w-4 mr-1" />
                Seleccionar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-colors"
                onClick={() => handleDeleteTemplate(template.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">PageSpeed:</span>{' '}
              {template.usePageSpeedData ? 'Activado' : 'Desactivado'}
            </div>
            <div>
              <span className="font-medium">GMB:</span>{' '}
              {template.useGmbData ? 'Activado' : 'Desactivado'}
            </div>
            <div>
              <span className="font-medium">Keywords:</span>{' '}
              {template.useKeywordsData ? 'Activado' : 'Desactivado'}
            </div>
          </div>
          
          {template.keywords && template.keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Palabras clave ({template.keywords.length})</h4>
              <KeywordsList keywords={template.keywords} readOnly={true} showHeader={false} />
            </div>
          )}
          
          {template.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Notas</h4>
              <p className="text-sm text-muted-foreground">{template.notes}</p>
            </div>
          )}
        </div>
      </Card>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'save' ? 'Guardar como plantilla' : 'Seleccionar plantilla'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={mode === 'save' ? 'create' : 'select'}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Mis plantillas</TabsTrigger>
            <TabsTrigger value="create">Crear plantilla</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center p-6">
                <p className="text-muted-foreground">No tienes plantillas guardadas.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Crea tu primera plantilla para agilizar la creación de informes.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="p-4 mb-4 relative">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">{template.name}</h3>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onSelect && handleSelectTemplate(template)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Seleccionar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-colors"
                              onClick={() => handleDeleteTemplate(template.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">PageSpeed:</span>{' '}
                            {template.usePageSpeedData ? 'Activado' : 'Desactivado'}
                          </div>
                          <div>
                            <span className="font-medium">GMB:</span>{' '}
                            {template.useGmbData ? 'Activado' : 'Desactivado'}
                          </div>
                          <div>
                            <span className="font-medium">Keywords:</span>{' '}
                            {template.useKeywordsData ? 'Activado' : 'Desactivado'}
                          </div>
                        </div>
                        
                        {template.keywords && template.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Palabras clave ({template.keywords.length})</h4>
                            <KeywordsList keywords={template.keywords} readOnly={true} showHeader={false} />
                          </div>
                        )}
                        
                        {template.notes && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Notas</h4>
                            <p className="text-sm text-muted-foreground">{template.notes}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nombre de la plantilla</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Mi plantilla personalizada"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Prompt personalizado</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Introduce un prompt personalizado para el informe..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-pagespeed" 
                    checked={usePageSpeedData}
                    onCheckedChange={setUsePageSpeedData}
                  />
                  <Label htmlFor="use-pagespeed">Incluir datos de PageSpeed</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-gmb" 
                    checked={useGmbData}
                    onCheckedChange={setUseGmbData}
                  />
                  <Label htmlFor="use-gmb">Incluir datos de Google My Business</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-keywords" 
                    checked={useKeywordsData}
                    onCheckedChange={setUseKeywordsData}
                  />
                  <Label htmlFor="use-keywords">Incluir análisis de palabras clave</Label>
                </div>
              </div>
              
              {useKeywordsData && (
                <div className="space-y-2 border-l-2 border-primary/20 pl-4">
                  <h3 className="text-sm font-medium">Palabras clave</h3>
                  <KeywordsList 
                    keywords={keywords} 
                    onRemove={handleRemoveKeyword}
                    readOnly={false}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales para el informe..."
                  rows={3}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSaveTemplate}
                disabled={isSaving || !templateName.trim()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <SaveAll className="h-4 w-4 mr-2" />
                    Guardar plantilla
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesDialog;
