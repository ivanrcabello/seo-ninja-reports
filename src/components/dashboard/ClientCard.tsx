
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Activity, File, Calendar, CheckCircle, XCircle } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import { formatDistanceToNow } from 'date-fns';
import { Client } from '@/hooks/useClients';
import { es } from 'date-fns/locale';

interface ClientCardProps {
  client: Client;
  index: number;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, index }) => {
  const { id, name, website, industry, createdAt, reportsCount, active } = client;
  
  return (
    <BlurredCard
      delay={index * 100}
      className={`transition-all duration-300 hover:translate-y-[-2px] ${!active ? 'opacity-75' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
              {industry}
            </span>
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{name}</h3>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {website.replace(/^https?:\/\//, '')}
            </a>
          </div>
          {active ? (
            <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Activo
            </span>
          ) : (
            <span className="inline-flex items-center text-muted-foreground text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              Inactivo
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <File className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-semibold">{reportsCount}</span>
            <span className="text-xs text-muted-foreground">Informes</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
            <Calendar className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es })}
            </span>
            <span className="text-xs text-muted-foreground">Añadido</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <Link to={`/clients/${id}`}>
            <Button className="w-full justify-between group" variant="outline">
              <span>Ver Cliente</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </BlurredCard>
  );
};

export default ClientCard;
