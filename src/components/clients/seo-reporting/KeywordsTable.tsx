
import React from 'react';
import { SeoKeyword } from '@/types/seo-reporting.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  return (
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
          {keywords.length > 0 ? (
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
  );
};

export default KeywordsTable;
