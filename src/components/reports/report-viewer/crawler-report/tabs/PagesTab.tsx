
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CrawlPage } from '@/services/seo-crawler/types';
import { ExternalLink } from 'lucide-react';

interface PagesTabProps {
  pages: CrawlPage[];
}

const PagesTab: React.FC<PagesTabProps> = ({ pages = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Páginas analizadas</CardTitle>
        <CardDescription>Total: {pages.length} páginas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Problemas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map(page => (
              <TableRow key={page.id}>
                <TableCell className="font-medium truncate max-w-[200px]">
                  <a 
                    href={page.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {page.url}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </TableCell>
                <TableCell className="truncate max-w-[200px]">{page.title || 'Sin título'}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      page.status_code >= 200 && page.status_code < 300
                        ? 'bg-green-100 text-green-800'
                        : page.status_code >= 300 && page.status_code < 400
                        ? 'bg-yellow-100 text-yellow-800'
                        : page.status_code >= 400
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {page.status_code}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={page.issues_count && page.issues_count > 0 ? 'destructive' : 'secondary'}>
                    {page.issues_count || 0}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PagesTab;
