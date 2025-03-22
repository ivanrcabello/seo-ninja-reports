
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeoReport } from '@/types/seo-reporting.types';
import { Globe, TrendingUp, Key, Link2 } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardCardsProps {
  report: SeoReport;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ report }) => {
  // Ensure we have values even if they are 0
  const traffic = report.traffic !== null && report.traffic !== undefined ? report.traffic : 0;
  const keywords = report.keywords !== null && report.keywords !== undefined ? report.keywords : 0;
  const backlinks = report.backlinks !== null && report.backlinks !== undefined ? report.backlinks : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Dominio</CardDescription>
          <CardTitle className="text-lg flex items-center">
            <Globe className="mr-2 h-4 w-4 text-primary" />
            {report.domain}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Última actualización: {format(new Date(report.updatedAt), 'dd/MM/yyyy')}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Tráfico Estimado</CardDescription>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
            {traffic.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Visitas mensuales estimadas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Palabras Clave</CardDescription>
          <CardTitle className="text-lg flex items-center">
            <Key className="mr-2 h-4 w-4 text-yellow-500" />
            {keywords.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Total de palabras clave en el top 100
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Backlinks</CardDescription>
          <CardTitle className="text-lg flex items-center">
            <Link2 className="mr-2 h-4 w-4 text-green-500" />
            {backlinks.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Enlaces externos apuntando al dominio
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
