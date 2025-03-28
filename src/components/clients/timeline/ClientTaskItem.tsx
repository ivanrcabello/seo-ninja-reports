
import React from 'react';
import { format, formatDistance, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  PlayCircle, 
  CheckSquare 
} from 'lucide-react';
import { ClientTask } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ClientTaskItemProps {
  task: ClientTask;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (status: ClientTask['status']) => void;
}

const ClientTaskItem: React.FC<ClientTaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusUpdate
}) => {
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && 
    (task.status === 'pending' || task.status === 'in_progress');
  
  const priorityMap = {
    low: { label: 'Baja', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-300' },
    medium: { label: 'Media', className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-300' },
    high: { label: 'Alta', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-300' },
    urgent: { label: 'Urgente', className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-300' },
  };
  
  const statusMap = {
    pending: { label: 'Pendiente', icon: <Clock className="h-4 w-4" />, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800/20 dark:text-gray-300' },
    in_progress: { label: 'En progreso', icon: <PlayCircle className="h-4 w-4" />, className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-300' },
    completed: { label: 'Completada', icon: <CheckCircle className="h-4 w-4" />, className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-300' },
    delayed: { label: 'Retrasada', icon: <AlertTriangle className="h-4 w-4" />, className: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-300' },
    cancelled: { label: 'Cancelada', icon: <XCircle className="h-4 w-4" />, className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-300' },
  };
  
  const priority = priorityMap[task.priority];
  const status = statusMap[task.status];
  
  return (
    <Card className={`${isOverdue ? 'border-destructive/30 bg-destructive/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.description && (
                <p className="text-muted-foreground text-sm">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priority.className}>
                {priority.label}
              </Badge>
              <Badge variant="outline" className={status.className}>
                <span className="flex items-center gap-1">
                  {status.icon}
                  {status.label}
                </span>
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {task.due_date && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(parseISO(task.due_date), 'PPP', { locale: es })}</span>
                
                {isOverdue && (
                  <Badge variant="destructive" className="ml-2">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Atrasada {formatDistance(parseISO(task.due_date), new Date(), { addSuffix: true, locale: es })}
                    </span>
                  </Badge>
                )}
              </div>
            )}
            
            {task.assigned_to && (
              <div className="flex items-center text-muted-foreground">
                <span className="flex items-center gap-1">
                  Asignada a: {task.assigned_to}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        <span className="text-xs text-muted-foreground">
          Creada: {format(parseISO(task.created_at), 'PP', { locale: es })}
        </span>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actualizar estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== 'pending' && (
                <DropdownMenuItem onClick={() => onStatusUpdate('pending')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Pendiente
                </DropdownMenuItem>
              )}
              {task.status !== 'in_progress' && (
                <DropdownMenuItem onClick={() => onStatusUpdate('in_progress')}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  En progreso
                </DropdownMenuItem>
              )}
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusUpdate('completed')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completada
                </DropdownMenuItem>
              )}
              {task.status !== 'delayed' && (
                <DropdownMenuItem onClick={() => onStatusUpdate('delayed')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Retrasada
                </DropdownMenuItem>
              )}
              {task.status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => onStatusUpdate('cancelled')}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelada
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientTaskItem;
