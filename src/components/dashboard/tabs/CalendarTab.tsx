
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Definir el tipo para los eventos
type EventType = 'meeting' | 'deadline' | 'task' | 'reminder';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  clientId?: string | null;
  description?: string;
}

const CalendarTab: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión mensual de estrategia',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Entrega informe SEO Técnico',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'deadline',
      clientId: '1',
    },
    {
      id: '3',
      title: 'Revisión de keywords',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      type: 'task',
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date(),
    type: 'meeting',
  });
  
  // Obtener eventos del día seleccionado
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  // Agregar nuevo evento
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as EventType,
      description: newEvent.description,
      clientId: newEvent.clientId,
    };

    setEvents([...events, event]);
    setIsDialogOpen(false);
    toast.success("Evento creado con éxito");
    
    // Resetear el formulario
    setNewEvent({
      title: '',
      date: new Date(),
      type: 'meeting',
    });
  };

  // Manejar el cambio del tipo de evento
  const handleEventTypeChange = (value: EventType) => {
    setNewEvent({
      ...newEvent,
      type: value,
    });
  };

  // Obtener color de badge según el tipo de evento
  const getEventBadgeColor = (type: EventType) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'task':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendario</h2>
          <p className="text-muted-foreground">
            Gestiona tus eventos, reuniones y plazos
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={es}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "Selecciona una fecha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No hay eventos programados para este día
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start justify-between border-b pb-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getEventBadgeColor(event.type)}>
                          {event.type === 'meeting' && 'Reunión'}
                          {event.type === 'deadline' && 'Plazo'}
                          {event.type === 'task' && 'Tarea'}
                          {event.type === 'reminder' && 'Recordatorio'}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      <div className="text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="inline-block h-3 w-3 mr-1" />
                        {format(event.date, "HH:mm", { locale: es })}
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para agregar eventos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del evento</Label>
              <Input 
                id="title" 
                placeholder="Título del evento" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Calendar
                mode="single"
                selected={newEvent.date}
                onSelect={(date) => date && setNewEvent({...newEvent, date})}
                className="rounded-md border"
                locale={es}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de evento</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={handleEventTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Reunión</SelectItem>
                    <SelectItem value="deadline">Plazo</SelectItem>
                    <SelectItem value="task">Tarea</SelectItem>
                    <SelectItem value="reminder">Recordatorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input 
                  id="time" 
                  type="time" 
                  defaultValue="09:00" 
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(newEvent.date || new Date());
                    newDate.setHours(hours, minutes);
                    setNewEvent({...newEvent, date: newDate});
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input 
                id="description" 
                placeholder="Descripción del evento" 
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEvent}>Guardar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarTab;
