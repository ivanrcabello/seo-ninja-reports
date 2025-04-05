
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart } from 'lucide-react';
import QuickLinksCard from '../QuickLinksCard';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatShortDate } from '@/lib/utils';

const OverviewTab = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  
  const [chartView, setChartView] = useState<'line' | 'bar'>('line');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          {/* Date range selector placeholder */}
          <Button variant="outline" size="sm">
            {format(dateRange.from, 'dd MMM', { locale: es })} - {format(dateRange.to, 'dd MMM', { locale: es })}
          </Button>
        </div>
      </div>
      
      {/* Stats cards placeholder */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ratio Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      
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
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Gráfico de actividad
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4 lg:col-span-2">
          <QuickLinksCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Informes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                <p>No hay informes recientes</p>
              </div>
            </CardContent>
          </Card>
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
            <div className="text-center py-4 text-muted-foreground">
              <p>No hay clientes recientes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Resumen de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p>No hay datos de clientes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
