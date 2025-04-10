
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Keyword, ReportTemplate } from "@/types/report-hooks.types";
import useReports from "@/hooks/useReports";

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string;
  initialKeywords?: Keyword[];
  initialNotes?: string;
  initialUsePageSpeedData?: boolean;
  initialUseGmbData?: boolean;
  initialUseKeywordsData?: boolean;
  onSelect?: (template: ReportTemplate) => void;
  mode?: 'save' | 'select';
}

const TemplatesDialog: React.FC<TemplatesDialogProps> = ({
  open,
  onOpenChange,
  initialPrompt = '',
  initialKeywords = [],
  initialNotes = '',
  initialUsePageSpeedData = true,
  initialUseGmbData = true,
  initialUseKeywordsData = true,
  onSelect,
  mode = 'save',
}) => {
  const { saveReportTemplate, getReportTemplates, deleteReportTemplate } = useReports();
  
  const [activeTab, setActiveTab] = useState<string>(mode === 'save' ? 'save' : 'select');
  const [templateName, setTemplateName] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>(initialPrompt);
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [usePageSpeedData, setUsePageSpeedData] = useState<boolean>(initialUsePageSpeedData);
  const [useGmbData, setUseGmbData] = useState<boolean>(initialUseGmbData);
  const [useKeywordsData, setUseKeywordsData] = useState<boolean>(initialUseKeywordsData);
  
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      loadTemplates();
      // Reset states
      setTemplateeName('');
      setCustomPrompt(initialPrompt);
      setKeywords(initialKeywords);
      setNotes(initialNotes);
      setUsePageSpeedData(initialUsePageSpeedData);
      setUseGmbData(initialUseGmbData);
      setUseKeywordsData(initialUseKeywordsData);
      setActiveTab(mode === 'save' ? 'save' : 'select');
    }
  }, [open, initialPrompt, initialKeywords, initialNotes, 
      initialUsePageSpeedData, initialUseGmbData, initialUseKeywordsData, mode]);
  
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
      setIsLoading(true);
      
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
      setIsLoading(false);
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
  
  // Define a function to set the template name with the correct signature
  const setTemplateeName = (name: string) => {
    setTemplateName(name);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plantillas de informes</DialogTitle>
          <DialogDescription>
            Guarda y reutiliza configuraciones de informes para ahorrar tiempo.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Seleccionar</TabsTrigger>
            <TabsTrigger value="save">Guardar nueva</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="mt-4">
            {isLoading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No hay plantillas guardadas</p>
                <p className="text-sm mt-2">Crea tu primera plantilla en la pestaña "Guardar nueva"</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div 
                      key={template.id} 
                      className={`p-4 border rounded-md cursor-pointer transition-all hover:border-primary
                        ${template.id === selectedTemplateId ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.usePageSpeedData && (
                            <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">PageSpeed</span>
                          )}
                          {template.useGmbData && (
                            <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">Google My Business</span>
                          )}
                          {template.useKeywordsData && (
                            <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                              Keywords ({template.keywords.length})
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 line-clamp-2">
                          <span className="font-medium">Prompt:</span> {template.customPrompt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="save" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nombre de la plantilla</Label>
                <Input 
                  id="template-name" 
                  placeholder="Ej: Informe SEO estándar" 
                  value={templateName} 
                  onChange={(e) => setTemplateeName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt personalizado</Label>
                <Textarea 
                  id="prompt" 
                  placeholder="Prompt para el informe" 
                  value={customPrompt} 
                  onChange={(e) => setCustomPrompt(e.target.value)} 
                  className="h-20"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-pagespeed" 
                    checked={usePageSpeedData} 
                    onCheckedChange={setUsePageSpeedData} 
                  />
                  <Label htmlFor="use-pagespeed">Usar datos de PageSpeed</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-gmb" 
                    checked={useGmbData} 
                    onCheckedChange={setUseGmbData} 
                  />
                  <Label htmlFor="use-gmb">Usar datos de Google My Business</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-keywords" 
                    checked={useKeywordsData} 
                    onCheckedChange={setUseKeywordsData} 
                  />
                  <Label htmlFor="use-keywords">Usar palabras clave ({keywords.length})</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {activeTab === 'save' && (
            <Button onClick={handleSaveTemplate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar plantilla'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesDialog;
