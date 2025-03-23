
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ClientList from '@/components/dashboard/ClientList';
import { Client } from '@/types/client.types';

interface ClientsTabProps {
  clients: Client[];
  reports: any[];
}

const ClientsTab: React.FC<ClientsTabProps> = ({ clients, reports }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');

  // Get unique industries for filter
  const industries = ['all', ...new Set(clients.map(client => client.industry || 'Sin categoría'))];

  // Filter clients based on search and industry
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        client.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <>
      <AnimatedContainer animation="slide-up" delay={400} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por industria" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry === 'all' ? 'Todas las industrias' : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('cards')}
              className="w-10 p-0"
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="w-3 h-3 rounded bg-current"></div>
                <div className="w-3 h-3 rounded bg-current"></div>
                <div className="w-3 h-3 rounded bg-current"></div>
                <div className="w-3 h-3 rounded bg-current"></div>
              </div>
              <span className="sr-only">Vista en tarjetas</span>
            </Button>
            <Button 
              variant={view === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('table')}
              className="w-10 p-0"
            >
              <div className="flex flex-col w-full items-center gap-1">
                <div className="w-4 h-1 rounded bg-current"></div>
                <div className="w-4 h-1 rounded bg-current"></div>
                <div className="w-4 h-1 rounded bg-current"></div>
              </div>
              <span className="sr-only">Vista en tabla</span>
            </Button>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-sm text-muted-foreground">
            {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'} {searchTerm && `que coinciden con "${searchTerm}"`} {industryFilter !== 'all' && `en la industria "${industryFilter}"`}
          </p>
        </div>
      </AnimatedContainer>
      
      <AnimatedContainer animation="fade" delay={600}>
        <div id="clients">
          <ClientList 
            clients={filteredClients} 
            view={view}
            reportsMap={reports.reduce((acc, report) => {
              acc[report.clientId] = (acc[report.clientId] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)}
          />
        </div>
      </AnimatedContainer>
    </>
  );
}

export default ClientsTab;
