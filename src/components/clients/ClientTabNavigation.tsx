
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientTabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientTabNavigation: React.FC<ClientTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="w-full mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="text-sm">Resumen</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Informes</TabsTrigger>
          <TabsTrigger value="proposals" className="text-sm">Propuestas</TabsTrigger>
          <TabsTrigger value="contracts" className="text-sm">Contratos</TabsTrigger>
          <TabsTrigger value="invoices" className="text-sm">Facturas</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ClientTabNavigation;
