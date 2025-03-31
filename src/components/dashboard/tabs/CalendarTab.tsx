
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarPlus, CalendarClock, Clock, Trash2, Edit2 } from 'lucide-react';

// Definiría la interfaz para los eventos
interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  type: 'meeting' | 'deadline' | 'task' | 'reminder';
  clientId?: string;
  clientName?: string;
}

// Componente para el formulario de eventos
const EventForm = ({ 
  onSave, 
  onCancel, 
  event = null 
}: { 
  onSave: (event: Omit<Event, 'id'>) => void; 
  onCancel: () => void; 
  event?: Event | null 
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState<Date | undefined>(event?.date || new Date());
  const [description, setDescription] = useState(event?.description || '');
  const [type, setType] = useState(event?.type || 'meeting');
  const [clientName, setClientName] = useState(event?.clientName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!date) {
      toast.error('La fecha es obligatoria');
      return;
    }

    onSave({
      title,
      date,
      description,
      type: type as Event['type'],
      clientName: clientName || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Título del evento"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as any}
          className="rounded-md border"
          locale={es}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Evento</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meeting">Reunión</SelectItem>
            <SelectItem value="deadline">Fecha Límite</SelectItem>
            <SelectItem value="task">Tarea</SelectItem>
            <SelectItem value="reminder">Recordatorio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">Cliente (opcional)</Label>
        <Input 
          id="clientName" 
          value={clientName} 
          onChange={e => setClientName(e.target.value)} 
          placeholder="Nombre del cliente"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Descripción del evento"
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
};

// Componente para mostrar la lista de eventos
const EventsList = ({ 
  events, 
  onEdit, 
  onDelete 
}: { 
  events: Event[]; 
  onEdit: (event: Event) => void; 
  onDelete: (eventId: string) => void 
}) => {
  // Ordenamos los eventos por fecha
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return <CalendarClock className="h-4 w-4 text-blue-500" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'task':
        return <CalendarPlus className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <CalendarClock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getEventTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return 'Reunión';
      case 'deadline':
        return 'Fecha Límite';
      case 'task':
        return 'Tarea';
      case 'reminder':
        return 'Recordatorio';
    }
  };

  return (
    <div className="space-y-3">
      {sortedEvents.map(event => (
        <Card key={event.id} className="overflow-hidden">
          <div className="flex items-start p-4">
            <div className="bg-muted rounded-md p-2 mr-4">
              {getEventTypeIcon(event.type)}
            </div>
            
            <div className="flex-grow">
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {format(event.date, 'PPP', { locale: es })}
              </div>
              {event.clientName && (
                <div className="text-sm text-muted-foreground">
                  Cliente: {event.clientName}
                </div>
              )}
              {event.description && (
                <div className="text-sm mt-2">{event.description}</div>
              )}
            </div>
            
            <div className="flex gap-1 shrink-0">
              <Button size="sm" variant="ghost" onClick={() => onEdit(event)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(event.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {events.length === 0 && (
        <div className="text-center py-8">
          <CalendarClock className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">
            No hay eventos programados
          </p>
        </div>
      )}
    </div>
  );
};

// Componente principal del calendario
const CalendarTab = () => {
  // Estado para los eventos (en una aplicación real, esto vendría de una API)
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Reunión mensual de estrategia',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      type: 'meeting',
      description: 'Revisión de KPIs y planificación de tareas'
    },
    {
      id: '2',
      title: 'Entrega informe SEO Técnico',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'deadline',
      clientName: 'Restaurante Sabor Mediterráneo'
    },
    {
      id: '3',
      title: 'Revisión de keywords',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      type: 'task',
      clientName: 'Clínica Dental Sonrisas'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Manejador para abrir el formulario de creación
  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setIsDialogOpen(true);
  };
  
  // Manejador para abrir el formulario de edición
  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsDialogOpen(true);
  };
  
  // Manejador para guardar un evento
  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (currentEvent) {
      // Actualizar evento existente
      setEvents(prev => prev.map(e => 
        e.id === currentEvent.id 
          ? { ...eventData, id: currentEvent.id } 
          : e
      ));
      toast.success('Evento actualizado correctamente');
    } else {
      // Crear nuevo evento
      const newEvent = {
        ...eventData,
        id: Date.now().toString() // Esto es simplificado, en producción usaríamos un UUID
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success('Evento creado correctamente');
    }
    setIsDialogOpen(false);
  };
  
  // Manejador para eliminar un evento
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast.success('Evento eliminado correctamente');
  };
  
  // Filtrar eventos por fecha seleccionada
  const eventsForSelectedDate = date
    ? events.filter(e => 
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear())
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendario de Eventos</h2>
          <p className="text-muted-foreground">
            Gestiona reuniones, plazos y recordatorios
          </p>
        </div>
        <Button onClick={handleCreateEvent}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar fecha</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate as any}
              className="rounded-md border"
              locale={es}
            />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>
                  Eventos{date ? ` para ${format(date, 'PPP', { locale: es })}` : ''}
                </CardTitle>
                <CardDescription>
                  {eventsForSelectedDate.length} evento(s) programado(s)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <EventsList 
                events={eventsForSelectedDate}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <Button variant="outline" className="w-full" onClick={handleCreateEvent}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Añadir evento
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Próximos eventos</CardTitle>
              <CardDescription>
                Eventos programados en los próximos días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList 
                events={events.filter(e => e.date >= new Date()).slice(0, 5)}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentEvent ? 'Editar evento' : 'Crear nuevo evento'}
            </DialogTitle>
            <DialogDescription>
              {currentEvent 
                ? 'Modifica los detalles del evento seleccionado' 
                : 'Introduce los detalles para el nuevo evento'}
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            event={currentEvent}
            onSave={handleSaveEvent}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarTab;
