
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Search, Building, Clock, AlertTriangle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClientTask, Client } from '@/types/client.types';
import { Link } from 'react-router-dom';
import useClients from '@/hooks/useClients';

const TasksTab = () => {
  const [tasks, setTasks] = useState<(ClientTask & { client_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const { clients } = useClients();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Recuperamos todas las tareas
        const { data: taskData, error: taskError } = await supabase
          .from('client_tasks')
          .select(`
            *,
            clients:client_id (
              id,
              name
            )
          `)
          .order('due_date', { ascending: true });

        if (taskError) {
          console.error('Error fetching tasks:', taskError);
          return;
        }

        // Transformamos los datos para incluir el nombre del cliente
        const transformedTasks = taskData.map(task => ({
          ...task,
          client_name: task.clients ? task.clients.name : 'Cliente desconocido'
        }));

        setTasks(transformedTasks);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filtrar tareas según los criterios
  const filteredTasks = tasks.filter(task => {
    // Filtro de búsqueda
    const matchesSearch = 
      (task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       task.client_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filtro de estado
    const matchesStatus = 
      statusFilter === 'all' || 
      task.status === statusFilter;
      
    // Filtro de cliente
    const matchesClient =
      clientFilter === 'all' ||
      task.client_id === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Alta</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Media</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Baja</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string, dueDate?: string) => {
    // Comprobar si está vencida
    const isOverdue = dueDate && isPast(new Date(dueDate)) && (status === 'pending' || status === 'in_progress');
    
    if (isOverdue) {
      return <Badge variant="destructive">Vencida</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Pendiente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completada</Badge>;
      case 'delayed':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Retrasada</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cronograma de Tareas</h2>
          <p className="text-muted-foreground">
            Gestiona y monitoriza las tareas de todos los clientes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título, descripción..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="delayed">Retrasadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Filtrar por cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clients && clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="ml-2 text-muted-foreground">Cargando tareas...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-muted/10 rounded-lg">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No se encontraron tareas</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Intenta ajustar los filtros o crea nuevas tareas para tus clientes
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] p-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(task.status, task.due_date)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      <Link to={`/clients/${task.client_id}`} className="hover:underline">
                        {task.client_name}
                      </Link>
                    </div>
                    {task.due_date && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          {format(new Date(task.due_date), "PPP", { locale: es })}
                        </span>
                      </div>
                    )}
                    {task.assigned_to && (
                      <div className="flex items-center">
                        <span>Asignado a: {task.assigned_to}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex md:block">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/clients/${task.client_id}`}>
                      Ver Cliente
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksTab;
