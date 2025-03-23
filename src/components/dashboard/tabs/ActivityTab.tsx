
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, ArrowUpRight } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

interface ActivityTabProps {
  clients: Client[];
  reports: Report[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ clients, reports }) => {
  // Get activity data - most recent reports
  const recentActivity = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <AnimatedContainer animation="fade" delay={400} className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Seguimiento de las últimas actividades en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-6">
              {recentActivity.map((report) => {
                const client = clients.find(c => c.id === report.clientId);
                return (
                  <div key={report.id} className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Cliente: {client?.name || 'Cliente desconocido'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estado: <span className={
                              report.status === 'completed' ? 'text-green-600' : 
                              report.status === 'processing' ? 'text-blue-600' : 
                              'text-red-600'
                            }>
                              {
                                report.status === 'completed' ? 'Completado' : 
                                report.status === 'processing' ? 'En proceso' : 
                                'Fallido'
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right flex flex-col items-end">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(report.date), 'dd MMMM yyyy, HH:mm', { locale: es })}
                      </p>
                      <Button asChild variant="link" className="h-auto p-0 mt-1">
                        <Link to={`/reports/${report.id}`}>
                          Ver informe <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No hay actividad reciente</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/activity">Ver todo el historial de actividad</Link>
          </Button>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
}

export default ActivityTab;
