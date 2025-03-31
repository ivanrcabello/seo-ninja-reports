
import React, { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarClock, PlusCircle, Clock, AlertTriangle } from 'lucide-react';
import { ClientTask } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import useClientTasks from '@/hooks/useClientTasks';
import ClientTaskItem from './ClientTaskItem';
import ClientTaskFormDialog from './ClientTaskFormDialog';

interface ClientTasksProps {
  clientId: string;
  clientName: string;
}

const ClientTasks: React.FC<ClientTasksProps> = ({ clientId, clientName }) => {
  const { 
    tasks, 
    isLoading, 
    createTask, 
    updateTask, 
    removeTask,
    getPendingTasks,
    getCompletedTasks,
    getOverdueTasks
  } = useClientTasks(clientId);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ClientTask | null>(null);
  
  const pendingTasks = getPendingTasks();
  const completedTasks = getCompletedTasks();
  const overdueTasks = getOverdueTasks();
  
  const handleAddTask = () => {
    setTaskToEdit(null);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: ClientTask) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };
  
  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };
  
  const handleTaskFormSubmit = async (data: any) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, data);
    } else {
      await createTask(data);
    }
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cronograma de Trabajo</h2>
          <p className="text-muted-foreground">
            Gestiona las tareas pendientes y completadas para {clientName}
          </p>
        </div>
        <Button onClick={handleAddTask} className="self-start">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>
      
      {overdueTasks.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Tareas Atrasadas ({overdueTasks.length})
            </CardTitle>
            <CardDescription>
              Estas tareas han pasado su fecha límite y necesitan atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTasks.map(task => (
                <ClientTaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => removeTask(task.id)}
                  onStatusUpdate={(status) => updateTask(task.id, { status })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pending">
            Pendientes ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="ml-2 text-muted-foreground">Cargando tareas...</span>
            </div>
          ) : pendingTasks.length === 0 ? (
            <div className="text-center py-10 bg-muted/10 rounded-lg">
              <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No hay tareas pendientes</h3>
              <p className="text-muted-foreground mt-1">Crea una nueva tarea para empezar a organizar el trabajo</p>
              <Button onClick={handleAddTask} variant="outline" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir Tarea
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <ClientTaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => removeTask(task.id)}
                  onStatusUpdate={(status) => updateTask(task.id, { status })}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="ml-2 text-muted-foreground">Cargando tareas...</span>
            </div>
          ) : completedTasks.length === 0 ? (
            <div className="text-center py-10 bg-muted/10 rounded-lg">
              <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No hay tareas completadas</h3>
              <p className="text-muted-foreground mt-1">Las tareas completadas aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTasks.map(task => (
                <ClientTaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => removeTask(task.id)}
                  onStatusUpdate={(status) => updateTask(task.id, { status })}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ClientTaskFormDialog
        open={isTaskFormOpen}
        task={taskToEdit}
        onClose={handleTaskFormClose}
        onSubmit={handleTaskFormSubmit}
      />
    </div>
  );
};

export default ClientTasks;
