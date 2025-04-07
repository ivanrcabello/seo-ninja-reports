
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface DashboardHeaderProps {
  currentDate: Date;
  nextEvents: any[];
  upcomingDeadlines: any[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  currentDate, 
  nextEvents, 
  upcomingDeadlines 
}) => {
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
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <AnimatedContainer animation="slide-up" className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Control</h1>
        <p className="text-muted-foreground">
          Gestiona tus clientes, informes SEO y facturas
        </p>
      </AnimatedContainer>
      
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
            <CardTitle className="text-sm font-medium">Total Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Este mes:</span>
                <span className="text-lg font-bold text-primary">3,950€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pendiente:</span>
                <span className="text-sm font-medium text-yellow-500">1,200€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recurrente:</span>
                <span className="text-sm font-medium">3,750€/mes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardHeader;
