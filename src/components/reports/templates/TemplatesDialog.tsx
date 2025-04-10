import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { ReportTemplate, Keyword } from '@/types/report-hooks.types';
import useReports from '@/hooks/useReports';
import KeywordTags from '@/components/reports/keywords/KeywordTags';
import { Loader2, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (template: ReportTemplate) => void;
  mode?: 'select' | 'manage';
}

const TemplatesDialog: React.FC<TemplatesDialogProps> = ({ 
  open, 
  onOpenChange,
  onSelect,
  mode = 'manage'
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const { saveReportTemplate, getReportTemplates, deleteReportTemplate } = useReports();
  
  const form = useForm({
    defaultValues: {
      name: '',
      customPrompt: localStorage.getItem('default_seo_prompt') || '',
      usePageSpeedData: true,
      useGmbData: true,
      useKeywordsData: true,
      keywords: [] as Keyword[],
      notes: '',
    }
  });
  
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const loadedTemplates = await getReportTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar plantillas');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);
  
  const handleSaveTemplate = async (values: any) => {
    setIsSaving(true);
    try {
      const newTemplate = await saveReportTemplate(values);
      setTemplates([...templates, newTemplate]);
      setShowNewForm(false);
      form.reset();
      toast.success('Plantilla guardada');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar plantilla');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteReportTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      toast.success('Plantilla eliminada');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar plantilla');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'select' ? 'Seleccionar plantilla' : 'Gestionar plantillas'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'select' 
              ? 'Selecciona una plantilla para usar en tu informe' 
              : 'Crea y gestiona plantillas para reutilizar en futuros informes'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(template.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {template.usePageSpeedData && (
                              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                PageSpeed
                              </span>
                            )}
                            {template.useGmbData && (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                Google Business
                              </span>
                            )}
                            {template.useKeywordsData && (
                              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs">
                                Keywords
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {mode === 'select' ? (
                            <Button 
                              size="sm" 
                              onClick={() => onSelect && onSelect(template as any)}
                            >
                              Seleccionar
                            </Button>
                          ) : (
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay plantillas guardadas</p>
              </div>
            )}
            
            {/* Formulario para nueva plantilla */}
            {showNewForm ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveTemplate)} className="space-y-4 border p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la plantilla</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. SEO Técnico Completo" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt personalizado</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Instrucciones personalizadas para el informe..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="usePageSpeedData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>PageSpeed</FormLabel>
                            <FormDescription>
                              Incluir datos PageSpeed
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="useGmbData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Google Business</FormLabel>
                            <FormDescription>
                              Incluir datos de GMB
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="useKeywordsData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Keywords</FormLabel>
                            <FormDescription>
                              Incluir keywords
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords por defecto</FormLabel>
                        <FormControl>
                          <KeywordTags
                            keywords={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Notas adicionales para los informes..." 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar plantilla
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Button 
                onClick={() => setShowNewForm(true)} 
                className="w-full"
              >
                Nueva plantilla
              </Button>
            )}
          </div>
        )}
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesDialog;
