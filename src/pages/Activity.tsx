
import React from 'react';
import { Navigate } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User, Loader2 } from 'lucide-react';

const Activity = () => {
  const { user, loading: authLoading } = useAuth();
  const { reports, isLoading: reportsLoading } = useReports();
  const { clients, isLoading: clientsLoading } = useClients();

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || reportsLoading || clientsLoading;

  // Get recent activities (last 7 days)
  const sevenDaysAgo = subDays(new Date(), 7);
  
  // Filter recent reports
  const recentReports = reports
    .filter(report => new Date(report.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter recent clients
  const recentClients = clients
    .filter(client => {
      try {
        return new Date(client.created_at) >= sevenDaysAgo;
      } catch (error) {
        console.error("Invalid date in client:", client.id, client.created_at);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (error) {
        console.error("Error sorting clients by date:", error);
        return 0;
      }
    });
  
  // Combine and sort all activities
  const activities = [
    ...recentReports.map(report => ({
      type: 'report',
      date: new Date(report.date),
      data: report
    })),
    ...recentClients.map(client => {
      try {
        return {
          type: 'client',
          date: new Date(client.created_at),
          data: client
        };
      } catch (error) {
        console.error("Error creating activity for client:", client.id, error);
        return null;
      }
    }).filter(Boolean)
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Actividad Reciente</h1>
            <p className="text-muted-foreground">
              Resumen de la actividad de los últimos 7 días
            </p>
          </AnimatedContainer>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatedContainer animation="fade" delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle>Actividad de la última semana</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No hay actividad reciente</h3>
                      <p className="text-muted-foreground">
                        No se ha registrado actividad en los últimos 7 días.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'report' ? 'bg-primary/10' : 'bg-green-500/10'
                          }`}>
                            {activity.type === 'report' ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : (
                              <User className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {format(activity.date, 'dd MMM yyyy, HH:mm')}
                              </span>
                            </div>
                            {activity.type === 'report' ? (
                              <Link to={`/reports/${(activity.data as Report).id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nuevo informe: {(activity.data as Report).title}
                              </Link>
                            ) : (
                              <Link to={`/clients/${(activity.data as Client).id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nuevo cliente: {(activity.data as Client).name}
                              </Link>
                            )}
                            {activity.type === 'report' && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Cliente: {getClientName((activity.data as Report).clientId)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activity;
