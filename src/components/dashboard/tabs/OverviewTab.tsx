
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
import { BarChart3, Users, FileText, Activity, Calendar, Clock } from 'lucide-react';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { Client as ClientType } from '@/types/client.types';

// Define interfaces for the component props
export interface OverviewTabProps {
  trackSectionVisibility?: (sectionId: string) => void;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  clients?: ClientType[];
  reports?: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ trackSectionVisibility, setActiveTab, clients: propClients, reports: propReports }) => {
  const { clients: hookClients } = useClients();
  const { reports: hookReports } = useReports();
  
  // Use props if provided, otherwise use hook data
  const clients = propClients || hookClients || [];
  const reports = propReports || hookReports || [];

  // Calculate metrics
  const totalClients = clients.length;
  // Filter by active flag instead of status
  const activeClients = clients.filter(client => client.active).length;
  const totalReports = reports.length;

  // Function to navigate to a specific tab
  const navigateToTab = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard 
          title="Total Clientes" 
          value={totalClients} 
          icon={<Users size={20} />} 
        />
        <DashboardMetricCard 
          title="Clientes Activos" 
          value={activeClients} 
          icon={<Activity size={20} />} 
        />
        <DashboardMetricCard 
          title="Informes Creados" 
          value={totalReports} 
          icon={<FileText size={20} />} 
        />
        <DashboardMetricCard 
          title="Posiciones Mejoradas" 
          value="68%" 
          trend={{ value: 12, isPositive: true }}
          icon={<BarChart3 size={20} />} 
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            asChild
          >
            <Link to="/clients">
              <Users className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Clientes</div>
                <div className="text-xs text-muted-foreground">Gestionar todos los clientes</div>
              </div>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            asChild
          >
            <Link to="/all-reports">
              <FileText className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Informes</div>
                <div className="text-xs text-muted-foreground">Ver todos los informes</div>
              </div>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            asChild
          >
            <Link to="/activity">
              <Activity className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Actividad</div>
                <div className="text-xs text-muted-foreground">Ver actividad reciente</div>
              </div>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => navigateToTab('calendar')}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Calendario</div>
                <div className="text-xs text-muted-foreground">Gestionar eventos</div>
              </div>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;
