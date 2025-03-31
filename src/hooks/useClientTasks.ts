
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ClientTask, ClientTaskInput } from '@/types/client.types';
import { 
  fetchClientTasks, 
  addClientTask, 
  updateClientTask, 
  deleteClientTask 
} from '@/services/clientTasksService';

export default function useClientTasks(clientId: string | undefined) {
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      if (!clientId) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const tasksData = await fetchClientTasks(clientId);
        setTasks(tasksData);
      } catch (error: any) {
        console.error('Error loading tasks:', error);
        toast.error('Error al cargar tareas');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [clientId]);

  const createTask = async (taskData: ClientTaskInput) => {
    if (!clientId) return null;
    
    try {
      const newTask = await addClientTask(clientId, taskData);
      setTasks(prev => [newTask, ...prev].sort((a, b) => 
        new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime()
      ));
      toast.success('Tarea creada exitosamente');
      return newTask;
    } catch (error: any) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<ClientTaskInput>) => {
    try {
      const updatedTask = await updateClientTask(taskId, taskData);
      setTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
          .sort((a, b) => 
            new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime()
          )
      );
      toast.success('Tarea actualizada exitosamente');
      return updatedTask;
    } catch (error: any) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await deleteClientTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Tarea eliminada exitosamente');
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const getPendingTasks = () => {
    return tasks.filter(task => task.status === 'pending' || task.status === 'in_progress' || task.status === 'delayed')
      .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime());
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.status === 'completed' || task.status === 'cancelled');
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      (task.status === 'pending' || task.status === 'in_progress') && 
      task.due_date && new Date(task.due_date) < now
    );
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    removeTask,
    getPendingTasks,
    getCompletedTasks,
    getOverdueTasks
  };
}
