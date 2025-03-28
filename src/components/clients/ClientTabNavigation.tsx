
import React from 'react';
import { 
  File, 
  FileText, 
  ClipboardList, 
  CreditCard, 
  LayoutDashboard, 
  CalendarClock 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientTabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientTabNavigation: React.FC<ClientTabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: 'reports', label: 'Informes', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'proposals', label: 'Propuestas', icon: <File className="h-4 w-4 mr-2" /> },
    { id: 'contracts', label: 'Contratos', icon: <ClipboardList className="h-4 w-4 mr-2" /> },
    { id: 'invoices', label: 'Facturas', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { id: 'tasks', label: 'Cronograma', icon: <CalendarClock className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hide">
      <div className="flex space-x-1 border-b w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-all",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientTabNavigation;
