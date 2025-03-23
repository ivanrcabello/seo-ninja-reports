import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientList from '@/components/dashboard/ClientList';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2, Search, Filter, PieChart, BarChart3, ArrowUpRight, Users, FileText, Clock, Receipt } from 'lucide-react';
import usePersistentState from '@/hooks/usePersistentState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InvoicesTab from '@/components/dashboard/InvoicesTab';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { reports, isLoading: reportsLoading } = useReports();
  const [lastVisitedSection, setLastVisitedSection] = usePersistentState<string>('dashboard-section', '');
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || clientsLoading || reportsLoading;
  
  // Get reports created in the last 7 days
  const recentReportsCount = reports.filter(
    r => new Date(r.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  ).length;

  // Get unique industries for filter
  const industries = ['all', ...new Set(clients.map(client => client.industry || 'Sin categoría'))];

  // Filter clients based on search and industry
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Get counts by industry for charts
  const industryCount = clients.reduce((acc, client) => {
    const industry = client.industry || 'Sin categoría';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  // Track section visibility
  const trackSectionVisibility = (sectionId: string) => {
    setLastVisitedSection(sectionId);
  };

  // Get activity data - most recent reports
  const recentActivity = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes, informes SEO y facturas
            </p>
          </AnimatedContainer>
          
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
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <AnimatedContainer animation="fade" delay={200} className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <DashboardMetricCard
                        title="Total Clientes"
                        value={clients.length}
                        description="Clientes activos en tu cuenta"
                        icon={Users}
                        trend={clients.length > 0 ? "+10%" : "0%"}
                        trendDirection="up"
                        linkText="Ver todos los clientes"
                        linkUrl="#clients"
                        onClick={() => {
                          setActiveTab("clients");
                          trackSectionVisibility('clients');
                        }}
                      />
                      <DashboardMetricCard
                        title="Total Informes"
                        value={reports.length}
                        description="Informes SEO generados"
                        icon={FileText}
                        trend={reports.length > 0 ? "+15%" : "0%"}
                        trendDirection="up"
                        linkText="Ver todos los informes"
                        linkUrl="/all-reports"
                      />
                      <DashboardMetricCard
                        title="Actividad Reciente"
                        value={recentReportsCount}
                        description="Informes creados en los últimos 7 días"
                        icon={Clock}
                        trend={recentReportsCount > 0 ? "+5%" : "0%"}
                        trendDirection="up"
                        linkUrl="/activity"
                        linkText="Ver actividad reciente"
                      />
                    </div>
                  </AnimatedContainer>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Distribución por Industria</CardTitle>
                          <PieChart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <CardDescription>
                          Distribución de clientes por sector
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(industryCount).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(industryCount).map(([industry, count]) => (
                              <div key={industry} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{industry}</span>
                                  <span className="text-sm text-muted-foreground">{count} clientes</span>
                                </div>
                                <Progress 
                                  value={(count / clients.length) * 100} 
                                  indicatorClassName={
                                    industry === 'E-commerce' ? 'bg-blue-500' :
                                    industry === 'Educación' ? 'bg-green-500' :
                                    industry === 'Salud' ? 'bg-purple-500' :
                                    industry === 'Tecnología' ? 'bg-amber-500' :
                                    undefined
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40">
                            <p className="text-muted-foreground">No hay datos disponibles</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Actividad Reciente</CardTitle>
                          <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <CardDescription>
                          Últimos informes creados
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentActivity.length > 0 ? (
                          <div className="space-y-4">
                            {recentActivity.map((report) => {
                              const client = clients.find(c => c.id === report.clientId);
                              return (
                                <div key={report.id} className="flex items-center justify-between pb-4 border-b">
                                  <div>
                                    <p className="font-medium">{report.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {client?.name || 'Cliente desconocido'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm">
                                      {format(new Date(report.date), 'dd MMM yyyy', { locale: es })}
                                    </p>
                                    <Link to={`/reports/${report.id}`} className="text-sm text-primary flex items-center">
                                      Ver <ArrowUpRight className="h-3 w-3 ml-1" />
                                    </Link>
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
                        <Link to="/activity" className="text-primary text-sm hover:underline">
                          Ver todo el historial de actividad
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="clients">
                  <AnimatedContainer animation="slide-up" delay={400} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex-1 flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Buscar clientes..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Select value={industryFilter} onValueChange={setIndustryFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por industria" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry === 'all' ? 'Todas las industrias' : industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={view === 'cards' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setView('cards')}
                          className="w-10 p-0"
                        >
                          <div className="grid grid-cols-2 gap-1">
                            <div className="w-3 h-3 rounded bg-current"></div>
                            <div className="w-3 h-3 rounded bg-current"></div>
                            <div className="w-3 h-3 rounded bg-current"></div>
                            <div className="w-3 h-3 rounded bg-current"></div>
                          </div>
                          <span className="sr-only">Vista en tarjetas</span>
                        </Button>
                        <Button 
                          variant={view === 'table' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setView('table')}
                          className="w-10 p-0"
                        >
                          <div className="flex flex-col w-full items-center gap-1">
                            <div className="w-4 h-1 rounded bg-current"></div>
                            <div className="w-4 h-1 rounded bg-current"></div>
                            <div className="w-4 h-1 rounded bg-current"></div>
                          </div>
                          <span className="sr-only">Vista en tabla</span>
                        </Button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">
                        {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'} {searchTerm && `que coinciden con "${searchTerm}"`} {industryFilter !== 'all' && `en la industria "${industryFilter}"`}
                      </p>
                    </div>
                  </AnimatedContainer>
                  
                  <AnimatedContainer animation="fade" delay={600}>
                    <div id="clients">
                      <ClientList 
                        clients={filteredClients} 
                        view={view}
                        reportsMap={reports.reduce((acc, report) => {
                          acc[report.clientId] = (acc[report.clientId] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)}
                      />
                    </div>
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="reports">
                  <AnimatedContainer animation="fade" delay={400} className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumen de Informes</CardTitle>
                        <CardDescription>
                          Resumen de todos los informes SEO generados
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                              <span className="text-sm text-muted-foreground mb-2">Total de informes</span>
                              <span className="text-3xl font-bold">{reports.length}</span>
                            </div>
                            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                              <span className="text-sm text-muted-foreground mb-2">Informes este mes</span>
                              <span className="text-3xl font-bold">
                                {reports.filter(r => {
                                  const date = new Date(r.date);
                                  const now = new Date();
                                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                }).length}
                              </span>
                            </div>
                            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                              <span className="text-sm text-muted-foreground mb-2">Última actualización</span>
                              <span className="text-xl font-bold">
                                {reports.length > 0 
                                  ? format(new Date(reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date), 'dd/MM/yyyy')
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Informes por estado</h3>
                            <div className="space-y-4">
                              {(['completed', 'processing', 'failed'] as const).map(status => {
                                const count = reports.filter(r => r.status === status).length;
                                const percentage = reports.length > 0 ? (count / reports.length) * 100 : 0;
                                
                                return (
                                  <div key={status} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium capitalize">{
                                        status === 'completed' ? 'Completado' : 
                                        status === 'processing' ? 'En proceso' : 
                                        'Fallido'
                                      }</span>
                                      <span className="text-sm text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <Progress 
                                      value={percentage} 
                                      indicatorClassName={
                                        status === 'completed' ? 'bg-green-500' :
                                        status === 'processing' ? 'bg-blue-500' :
                                        'bg-red-500'
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link to="/all-reports">Ver todos los informes</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="invoices">
                  <AnimatedContainer animation="fade" delay={400}>
                    <InvoicesTab />
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="activity">
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

interface DashboardMetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  linkText: string;
  linkUrl: string;
  onClick?: () => void;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  trendDirection,
  linkText, 
  linkUrl, 
  onClick 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{value}</span>
            <span className={`text-xs ml-2 ${
              trendDirection === 'up' ? 'text-green-600' :
              trendDirection === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {trend}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="link" className="p-0 h-auto text-primary" asChild onClick={onClick}>
          <Link to={linkUrl}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;
