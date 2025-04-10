
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { format, addDays, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReportTemplate } from '@/types/report-hooks.types';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';
import { Loader2, CalendarDays } from 'lucide-react';
import { Client } from '@/types/client.types';

interface ScheduleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onScheduled?: () => void;
}

const ScheduleReportDialog: React.FC<ScheduleReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  client,
  onScheduled 
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );
  
  const { getReportTemplates, scheduleReport } = useReports();
  
  const form = useForm({
    defaultValues: {
      url: '',
      templateId: '',
      frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly',
      dayOfWeek: 1,
      dayOfMonth: 1,
    }
  });
  
  const frequency = form.watch('frequency');
  
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);
  
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const loadedTemplates = await getReportTemplates();
      setTemplates(loadedTemplates);
      
      if (loadedTemplates.length > 0) {
        form.setValue('templateId', loadedTemplates[0].id);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar plantillas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSchedule = async (values: any) => {
    if (!startDate) {
      toast.error('Debes seleccionar una fecha de inicio');
      return;
    }
    
    setIsSaving(true);
    try {
      // Calculate nextRunDate based on selected date
      const nextRunDate = startDate.toISOString();
      
      await scheduleReport({
        clientId: client.id,
        url: values.url,
        templateId: values.templateId,
        frequency: values.frequency,
        dayOfWeek: values.frequency === 'weekly' ? values.dayOfWeek : undefined,
        dayOfMonth: values.frequency === 'monthly' || values.frequency === 'quarterly' ? values.dayOfMonth : undefined,
        active: true
      });
      
      toast.success('Informe programado correctamente');
      onOpenChange(false);
      if (onScheduled) onScheduled();
    } catch (error) {
      console.error('Error scheduling report:', error);
      toast.error('Error al programar el informe');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programar informe</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground mb-4">No hay plantillas disponibles para programar informes</p>
            <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSchedule)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del sitio</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plantilla</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una plantilla" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {frequency === 'weekly' && (
                <FormField
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día de la semana</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value, 10))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona día" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Lunes</SelectItem>
                          <SelectItem value="2">Martes</SelectItem>
                          <SelectItem value="3">Miércoles</SelectItem>
                          <SelectItem value="4">Jueves</SelectItem>
                          <SelectItem value="5">Viernes</SelectItem>
                          <SelectItem value="6">Sábado</SelectItem>
                          <SelectItem value="0">Domingo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              
              {(frequency === 'monthly' || frequency === 'quarterly') && (
                <FormField
                  control={form.control}
                  name="dayOfMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día del mes</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value, 10))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona día" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 28 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              
              <FormItem>
                <FormLabel>Fecha de inicio</FormLabel>
                <FormDescription>
                  Selecciona cuándo debe ejecutarse el primer informe
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {startDate ? (
                          format(startDate, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Programar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReportDialog;
