
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { useAuth } from '@/context/AuthContext';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';

const AllReports = () => {
  const { user, loading: authLoading } = useAuth();
  const { reports, isLoading: reportsLoading } = useReports();
  const { getClient } = useClients();

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || reportsLoading;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-down" className="mb-6">
            <h1 className="text-3xl font-bold text-primary">Todos los Informes SEO</h1>
            <p className="text-muted-foreground mt-2">
              Visualiza y gestiona todos tus informes SEO en un solo lugar
            </p>
          </AnimatedContainer>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
                <TabsTrigger value="all" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="recent" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Recientes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.length > 0 ? (
                    reports.map((report, index) => {
                      const client = getClient(report.clientId);
                      return (
                        <AnimatedContainer
                          key={report.id}
                          animation="fade"
                          delay={index * 100}
                        >
                          <BlurredCard className="h-full flex flex-col hover:ring-1 hover:ring-primary/20 transition-all group">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                                <Link to={`/reports/${report.id}`}>
                                  {report.title}
                                </Link>
                              </CardTitle>
                              <CardDescription>
                                {format(new Date(report.date), 'dd/MM/yyyy')}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                              {client && (
                                <Link to={`/clients/${client.id}`}>
                                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3 hover:bg-primary/20 transition-colors">
                                    {client.name}
                                  </div>
                                </Link>
                              )}
                              {report.status === 'completed' ? (
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                  {report.summary || 'No hay resumen disponible para este informe.'}
                                </p>
                              ) : (
                                <div className="flex items-center justify-center py-4 mb-4">
                                  <div className="flex flex-col items-center text-center">
                                    <Loader2 className="h-5 w-5 text-primary animate-spin mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      {report.status === 'processing' ? 'Procesando informe...' : 'Error al generar informe'}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  <span>Informe SEO</span>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="gap-1 text-xs h-7">
                                  <Link to={`/reports/${report.id}`}>
                                    Ver Detalles
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </BlurredCard>
                        </AnimatedContainer>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No hay informes disponibles</h3>
                      <p className="text-muted-foreground mb-6">
                        No se encontraron informes SEO. Comienza generando uno nuevo.
                      </p>
                      <Button asChild>
                        <Link to="/dashboard">Ir al Dashboard</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.length > 0 ? (
                    reports
                      .slice(0, 6) // Only show the 6 most recent reports
                      .map((report, index) => {
                        const client = getClient(report.clientId);
                        return (
                          <AnimatedContainer
                            key={report.id}
                            animation="fade"
                            delay={index * 100}
                          >
                            <BlurredCard className="h-full flex flex-col hover:ring-1 hover:ring-primary/20 transition-all group">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                                  <Link to={`/reports/${report.id}`}>
                                    {report.title}
                                  </Link>
                                </CardTitle>
                                <CardDescription>
                                  {format(new Date(report.date), 'dd/MM/yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1 flex flex-col">
                                {client && (
                                  <Link to={`/clients/${client.id}`}>
                                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3 hover:bg-primary/20 transition-colors">
                                      {client.name}
                                    </div>
                                  </Link>
                                )}
                                {report.status === 'completed' ? (
                                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {report.summary || 'No hay resumen disponible para este informe.'}
                                  </p>
                                ) : (
                                  <div className="flex items-center justify-center py-4 mb-4">
                                    <div className="flex flex-col items-center text-center">
                                      <Loader2 className="h-5 w-5 text-primary animate-spin mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        {report.status === 'processing' ? 'Procesando informe...' : 'Error al generar informe'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <FileText className="h-3.5 w-3.5 mr-1" />
                                    <span>Informe SEO</span>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild className="gap-1 text-xs h-7">
                                    <Link to={`/reports/${report.id}`}>
                                      Ver Detalles
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </BlurredCard>
                          </AnimatedContainer>
                        );
                      })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No hay informes disponibles</h3>
                      <p className="text-muted-foreground mb-6">
                        No se encontraron informes SEO. Comienza generando uno nuevo.
                      </p>
                      <Button asChild>
                        <Link to="/dashboard">Ir al Dashboard</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllReports;
