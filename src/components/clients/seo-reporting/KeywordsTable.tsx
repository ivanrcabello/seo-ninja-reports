
import React from 'react';
import { SeoKeyword } from '@/types/seo-reporting.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KeywordsTableProps {
  keywords: SeoKeyword[];
}

const KeywordsTable: React.FC<KeywordsTableProps> = ({ keywords }) => {
  const getPositionColor = (position: number | undefined) => {
    if (!position) return 'bg-gray-500';
    if (position <= 3) return 'bg-green-500';
    if (position <= 10) return 'bg-emerald-500';
    if (position <= 20) return 'bg-blue-500';
    if (position <= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Add explanation tooltip for the position color coding
  const positionLegend = [
    { range: '1-3', color: 'bg-green-500' },
    { range: '4-10', color: 'bg-emerald-500' },
    { range: '11-20', color: 'bg-blue-500' },
    { range: '21-50', color: 'bg-yellow-500' },
    { range: '50+', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Palabras Clave Principales</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground cursor-help">
                <Info className="h-4 w-4 mr-1" />
                <span>Posiciones</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-2">
              <div className="space-y-1">
                <p className="text-xs font-medium mb-1">Leyenda de posiciones:</p>
                {positionLegend.map((item) => (
                  <div key={item.range} className="flex items-center">
                    <Badge className={`${item.color} mr-2`}>
                      {item.range}
                    </Badge>
                    <span className="text-xs">
                      {item.range === '1-3' ? 'Excelente' : 
                       item.range === '4-10' ? 'Muy bueno' : 
                       item.range === '11-20' ? 'Bueno' : 
                       item.range === '21-50' ? 'Regular' : 'Necesita mejora'}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Palabra Clave</TableHead>
              <TableHead className="text-center">Posición</TableHead>
              <TableHead className="text-right">Volumen</TableHead>
              <TableHead className="text-right">% Tráfico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords && keywords.length > 0 ? (
              keywords.map((keyword) => (
                <TableRow key={keyword.id || keyword.keyword}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getPositionColor(keyword.position)}`}>
                      {keyword.position || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{keyword.volume?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell className="text-right">{keyword.trafficPercent ? `${keyword.trafficPercent}%` : 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No hay palabras clave disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {keywords && keywords.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Mostrando {keywords.length} palabra{keywords.length !== 1 ? 's' : ''} clave
        </p>
      )}
    </div>
  );
};

export default KeywordsTable;
