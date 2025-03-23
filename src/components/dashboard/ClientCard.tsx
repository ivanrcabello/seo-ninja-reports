
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Activity, File, Calendar, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import { format } from 'date-fns';
import { Client } from '@/types/client.types';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClientCardProps {
  client: Client;
  index: number;
  reportsCount?: number;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, index, reportsCount = 0 }) => {
  const { id, name, website, industry, created_at, active } = client;
  
  // Safely format the creation date
  const formattedDate = () => {
    try {
      if (!created_at) return "Fecha desconocida";
      return format(new Date(created_at), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e, created_at);
      return "Fecha inválida";
    }
  };

  // Get domain from website for display
  const displayWebsite = () => {
    try {
      if (!website) return "";
      const url = new URL(website);
      return url.hostname;
    } catch (e) {
      return website.replace(/^https?:\/\//, '');
    }
  };
  
  // Get badge color based on industry
  const getBadgeColor = () => {
    const industryLower = (industry || "").toLowerCase();
    if (industryLower.includes("ecommerce") || industryLower.includes("e-commerce")) {
      return "bg-blue-100 text-blue-800";
    } else if (industryLower.includes("educacion") || industryLower.includes("educación")) {
      return "bg-green-100 text-green-800";
    } else if (industryLower.includes("salud")) {
      return "bg-purple-100 text-purple-800";
    } else if (industryLower.includes("tecnologia") || industryLower.includes("tecnología")) {
      return "bg-orange-100 text-orange-800";
    }
    return "bg-gray-100 text-gray-800";
  };
  
  return (
    <BlurredCard
      delay={index * 100}
      className={`transition-all duration-300 hover:translate-y-[-2px] ${!active ? 'opacity-75' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              variant="outline" 
              className={`${getBadgeColor()} mb-2 font-medium border-0`}
            >
              {industry || "Sin categoría"}
            </Badge>
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{name}</h3>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center line-clamp-1"
            >
              {displayWebsite()}
              <ExternalLink className="h-3 w-3 ml-1 inline-flex" />
            </a>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {active ? (
                  <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center text-muted-foreground text-xs">
                    <XCircle className="h-4 w-4 mr-1" />
                    Inactivo
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {active ? "Cliente activo" : "Cliente inactivo"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg transition-all hover:bg-primary/10">
            <File className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-semibold">{reportsCount}</span>
            <span className="text-xs text-muted-foreground">Informes</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg transition-all hover:bg-primary/10">
            <Calendar className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">
              {formattedDate()}
            </span>
            <span className="text-xs text-muted-foreground">Añadido</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <Link to={`/clients/${id}`}>
            <Button className="w-full justify-between group hover:bg-primary" variant="outline">
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
