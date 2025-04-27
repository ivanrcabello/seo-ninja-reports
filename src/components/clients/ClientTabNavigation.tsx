
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, FileContract, Receipt, Calendar, Globe } from 'lucide-react';

interface ClientTabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientTabNavigation: React.FC<ClientTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL with hash for direct navigation
    if (value === 'overview') {
      navigate(`/clients/${clientId}`);
    } else {
      navigate(`/clients/${clientId}#${value}`);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-2 sm:gap-0 bg-transparent">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md"
        >
          General
        </TabsTrigger>
        <TabsTrigger 
          value="documents" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden xs:inline">Documentos</span>
        </TabsTrigger>
        <TabsTrigger 
          value="proposals" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden xs:inline">Propuestas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="contracts" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <FileContract className="h-4 w-4" />
          <span className="hidden xs:inline">Contratos</span>
        </TabsTrigger>
        <TabsTrigger 
          value="invoices" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Receipt className="h-4 w-4" />
          <span className="hidden xs:inline">Facturas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="tasks" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden xs:inline">Tareas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="portal" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden xs:inline">Portal</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ClientTabNavigation;
