
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, FileText, PlusCircle, Users } from 'lucide-react';
import DashboardMetricCard from '../DashboardMetricCard';

const OverviewTab = () => {
  const quickLinks = [
    { 
      title: 'Nuevo cliente', 
      description: 'Añadir un nuevo cliente a la plataforma', 
      icon: <Users className="h-5 w-5" />, 
      href: '/dashboard?action=new-client'
    },
    { 
      title: 'Nuevo informe', 
      description: 'Crear un nuevo informe SEO', 
      icon: <FileText className="h-5 w-5" />, 
      href: '/reports/new'
    },
    { 
      title: 'Actividad reciente', 
      description: 'Ver la actividad reciente en la plataforma', 
      icon: <Clock className="h-5 w-5" />, 
      href: '/activity'
    },
    { 
      title: 'Añadir tarea', 
      description: 'Crear una nueva tarea para un cliente', 
      icon: <PlusCircle className="h-5 w-5" />, 
      href: '/dashboard?action=new-task'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard 
          title="Clientes activos" 
          value="12" 
          change="+2"
          trend="up"
          href="/dashboard#clients"
        />
        <DashboardMetricCard 
          title="Informes generados" 
          value="48" 
          change="+8" 
          trend="up"
          href="/reports"
        />
        <DashboardMetricCard 
          title="Propuestas pendientes" 
          value="3" 
          change="0" 
          trend="neutral"
          href="/dashboard?tab=proposals"
        />
        <DashboardMetricCard 
          title="Facturas por cobrar" 
          value="5" 
          change="-2" 
          trend="down"
          href="/dashboard?tab=invoices"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Enlaces rápidos</CardTitle>
          <CardDescription>
            Acciones comunes para gestionar su negocio
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="group rounded-lg border border-border p-4 transition-all hover:bg-accent"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-lg bg-muted p-2">{link.icon}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-medium">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Informe SEO generado para Clínica Dental Sonrisas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hace 2 horas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nuevo cliente añadido: Restaurante El Rincón
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hace 5 horas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Tarea completada: Optimización GBP para Fontanería Rápida
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hace 1 día
                  </p>
                </div>
              </div>
            </div>
            <Button variant="link" size="sm" className="mt-4 w-full" asChild>
              <Link to="/activity">Ver toda la actividad</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximas tareas</CardTitle>
            <CardDescription>
              Tareas pendientes para esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-primary text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Actualizar contenido web para Abogados Unidos SL
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vence: Mañana
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-primary text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Enviar propuesta a Fisioterapia Bienestar
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vence: En 2 días
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                <input type="checkbox" className="h-4 w-4 rounded border-primary text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Revisar posiciones de keywords para Electricistas 24h
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vence: En 3 días
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
