
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Overview } from '@/components/dashboard/Overview';
import { RecentSales } from '@/components/dashboard/recent-sales';
import StatsCards from '@/components/dashboard/StatsCards';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { CalendarDateRangePicker } from '../DateRangePicker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart } from 'lucide-react';
import ReportsSummaryCard from '../ReportsSummaryCard';
import ClientsSummaryCard from '../ClientsSummaryCard';
import OverviewCardSkeleton from '@/components/ui/skeletons/OverviewCardSkeleton';
import DashboardMetricsChart from '@/components/dashboard/charts/DashboardMetricsChart';
import useEvents from '@/hooks/useEvents';
import { startOfMonth, endOfMonth } from 'date-fns';
import { formatShortDate } from '@/lib/utils';
import QuickLinksCard from '../QuickLinksCard';

const OverviewTab = () => {
  const { reports, isLoading: reportsLoading } = useReports();
  const { clients, isLoading: clientsLoading } = useClients();
  const { events, isLoading: eventsLoading } = useEvents();
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  
  const [chartView, setChartView] = useState<'line' | 'bar'>('line');
  
  const isLoading = reportsLoading || clientsLoading || eventsLoading;

  // Count stats
  const totalReports = reports.length;
  const completedReports = reports.filter(report => report.status === 'completed').length;
  const completionRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;
  
  const activeClients = clients.filter(client => client.active).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker 
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>
      
      <StatsCards
        reports={reports}
        clients={clients}
        dateRange={dateRange}
        isLoading={isLoading}
      />
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Actividad</CardTitle>
              <CardDescription>
                {formatShortDate(dateRange.from)} - {formatShortDate(dateRange.to)}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Tabs defaultValue={chartView} onValueChange={(v) => setChartView(v as 'line' | 'bar')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="line">
                    <LineChart className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="bar">
                    <BarChart className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <DashboardMetricsChart 
                  dateRange={dateRange}
                  reports={reports}
                  clients={clients}
                  events={events}
                  chartType={chartView}
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4 lg:col-span-2">
          <QuickLinksCard />
          
          {isLoading ? (
            <OverviewCardSkeleton />
          ) : (
            <ReportsSummaryCard reports={reports} />
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recientes</CardTitle>
            <CardDescription>
              Últimos clientes actualizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="skeleton h-12 w-12 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-[200px]"></div>
                      <div className="skeleton h-4 w-[150px]"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RecentSales clients={clients.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
        
        {isLoading ? (
          <OverviewCardSkeleton className="md:col-span-1 lg:col-span-4" />
        ) : (
          <ClientsSummaryCard 
            clients={clients} 
            className="md:col-span-1 lg:col-span-4" 
          />
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
