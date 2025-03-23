
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, BarChart3, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard } from '../DashboardMetricCard';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

interface OverviewTabProps {
  clients: Client[];
  reports: Report[];
  trackSectionVisibility: (sectionId: string) => void;
  setActiveTab: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  clients, 
  reports, 
  trackSectionVisibility,
  setActiveTab 
}) => {
  // Get reports created in the last 7 days
  const recentReportsCount = reports.filter(
    r => new Date(r.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  ).length;

  // Get counts by industry for charts
  const industryCount = clients.reduce((acc, client) => {
    const industry = client.industry || 'Sin categoría';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get activity data - most recent reports
  const recentActivity = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <>
      <AnimatedContainer animation="fade" delay={200} className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardMetricCard
            title="Total Clientes"
            value={clients.length}
            description="Clientes activos en tu cuenta"
            icon={clients.length > 0 ? "+10%" : "0%"}
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
            icon={reports.length > 0 ? "+15%" : "0%"}
            trend={reports.length > 0 ? "+15%" : "0%"}
            trendDirection="up"
            linkText="Ver todos los informes"
            linkUrl="/all-reports"
          />
          <DashboardMetricCard
            title="Actividad Reciente"
            value={recentReportsCount}
            description="Informes creados en los últimos 7 días"
            icon={recentReportsCount > 0 ? "+5%" : "0%"}
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
    </>
  );
}

export default OverviewTab;
