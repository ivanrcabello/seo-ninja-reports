
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2, Calendar, Clock } from 'lucide-react';
import usePersistentState from '@/hooks/usePersistentState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Import refactored tab components
import OverviewTab from '@/components/dashboard/tabs/OverviewTab';
import ClientsTab from '@/components/dashboard/tabs/ClientsTab';
import ReportsTab from '@/components/dashboard/tabs/ReportsTab';
import InvoicesTab from '@/components/dashboard/InvoicesTab';
import ActivityTab from '@/components/dashboard/tabs/ActivityTab';
import CalendarTab from '@/components/dashboard/tabs/CalendarTab';
import TasksTab from '@/components/dashboard/tabs/TasksTab';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { reports, isLoading: reportsLoading } = useReports();
  const [lastVisitedSection, setLastVisitedSection] = usePersistentState<string>('dashboard-section', '');
  const [activeTab, setActiveTab] = useState('overview');
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || clientsLoading || reportsLoading;
  
  // Store page visibility state
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible again, we ensure we're at the last viewed section
      if (document.visibilityState === 'visible' && lastVisitedSection) {
        const element = document.getElementById(lastVisitedSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastVisitedSection]);

  // Calculate business metrics and upcoming deadlines
  useEffect(() => {
    if (!isLoading) {
      // Mock upcoming events - en una aplicación real, estos datos vendrían de la base de datos
      setNextEvents([
        {
          title: 'Reunión mensual de estrategia',
          date: new Date(new Date().setDate(new Date().getDate() + 3)),
          type: 'meeting'
        },
        {
          title: 'Entrega informe SEO Técnico',
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          type: 'deadline',
          clientId: clients.length > 0 ? clients[0].id : null
        },
        {
          title: 'Revisión de keywords',
          date: new Date(new Date().setDate(new Date().getDate() + 10)),
          type: 'task'
        }
      ]);

      // Calculate upcoming deadlines from reports/invoices
      const today = new Date();
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      // Here we would normally query real deadlines from the database
      // This is just a placeholder
      setUpcomingDeadlines([
        {
          title: 'Renovación contrato mensual',
          client: clients.length > 0 ? clients[0].name : 'Cliente',
          dueDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 15),
          type: 'contract'
        },
        {
          title: 'Factura mensual pendiente',
          client: clients.length > 1 ? clients[1].name : 'Cliente',
          dueDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 10),
          type: 'invoice'
        }
      ]);
    }
  }, [isLoading, clients]);

  // Track section visibility
  const trackSectionVisibility = (sectionId: string) => {
    setLastVisitedSection(sectionId);
  };

  const currentDate = new Date();
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const daysInMonth = differenceInDays(endMonth, startMonth) + 1;
  const dayOfMonth = currentDate.getDate();
  const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Panel de Control' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes, informes SEO y facturas
            </p>
          </AnimatedContainer>
          
          {/* Dashboard Header Cards - Month progress, upcoming tasks, etc. */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Progreso del mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </span>
                  </div>
                  
                  <div className="mt-3 h-2 bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${monthProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Día {dayOfMonth}</span>
                    <span>{monthProgress}%</span>
                    <span>{daysInMonth} días</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Próximos eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nextEvents.slice(0, 2).map((event, i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-primary" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(event.date, 'dd MMM', { locale: es })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Próximos vencimientos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.slice(0, 2).map((deadline, i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-red-500" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium line-clamp-1">{deadline.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(deadline.dueDate, 'dd MMM', { locale: es })} - {deadline.client}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Enlaces rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/activity" 
                      className="text-sm px-3 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-center"
                    >
                      Actividad
                    </Link>
                    <Link 
                      to="/settings" 
                      className="text-sm px-3 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-center"
                    >
                      Configuración
                    </Link>
                    <Link 
                      to="/all-reports" 
                      className="text-sm px-3 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-center"
                    >
                      Informes
                    </Link>
                    <Link 
                      to="/clients" 
                      className="text-sm px-3 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-center"
                    >
                      Clientes
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Vista general</TabsTrigger>
                  <TabsTrigger value="clients">Clientes</TabsTrigger>
                  <TabsTrigger value="reports">Informes</TabsTrigger>
                  <TabsTrigger value="invoices">Facturas</TabsTrigger>
                  <TabsTrigger value="calendar">Calendario</TabsTrigger>
                  <TabsTrigger value="tasks">Tareas</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab 
                    clients={clients} 
                    reports={reports} 
                    trackSectionVisibility={trackSectionVisibility}
                    setActiveTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="clients">
                  <ClientsTab clients={clients} reports={reports} />
                </TabsContent>

                <TabsContent value="reports">
                  <ReportsTab reports={reports} />
                </TabsContent>

                <TabsContent value="invoices">
                  <AnimatedContainer animation="fade" delay={400}>
                    <InvoicesTab />
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="calendar">
                  <AnimatedContainer animation="fade" delay={400}>
                    <CalendarTab />
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="tasks">
                  <AnimatedContainer animation="fade" delay={400}>
                    <TasksTab />
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="activity">
                  <ActivityTab clients={clients} reports={reports} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
