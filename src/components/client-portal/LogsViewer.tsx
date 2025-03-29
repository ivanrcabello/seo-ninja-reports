
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clientPortalLogger, LogEntry } from '@/services/clientPortalLoggingService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';

const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  // Cargar logs cuando se monta el componente
  useEffect(() => {
    const loadLogs = () => {
      const allLogs = clientPortalLogger.getLogs();
      setLogs(allLogs);
    };

    loadLogs();
    
    // Actualizar logs cada 3 segundos
    const interval = setInterval(loadLogs, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Filtrar logs por nivel
  const filteredLogs = activeTab === 'all' 
    ? logs
    : logs.filter(log => log.level === activeTab);

  // Limpiar todos los logs
  const handleClearLogs = () => {
    clientPortalLogger.clearLogs();
    setLogs([]);
  };

  // Renderizar icono según el nivel del log
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Renderizar badge según el nivel del log
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">Info</Badge>;
      case 'warn':
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">Advertencia</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">Error</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Logs del Portal</CardTitle>
        <Button variant="destructive" size="sm" onClick={handleClearLogs}>
          <Trash2 className="h-4 w-4 mr-1" /> Limpiar logs
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="warn">Advertencias</TabsTrigger>
            <TabsTrigger value="error">Errores</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="max-h-96 overflow-y-auto border rounded-md">
              {filteredLogs.length > 0 ? (
                <div className="divide-y">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        {getLogIcon(log.level)}
                        <span className="font-medium">{log.component || 'ClientPortal'}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss') : ''}
                        </span>
                        {getLevelBadge(log.level)}
                      </div>
                      <p className="text-sm ml-6">{log.message}</p>
                      {log.details && (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 ml-6 overflow-x-auto">
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details, null, 2) 
                            : String(log.details)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No hay logs para mostrar.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LogsViewer;
