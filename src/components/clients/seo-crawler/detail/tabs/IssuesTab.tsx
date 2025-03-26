
import React, { useEffect, useState } from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import IssuesTabContent from './IssuesTabContent';
import { Badge } from '@/components/ui/badge';
import SeverityBadge from '../SeverityBadge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';

interface IssuesTabProps {
  issuesByType: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const IssuesTab: React.FC<IssuesTabProps> = ({ 
  issuesByType, 
  pageIssues,
  selectedPage,
  isLoading = false 
}) => {
  // Log to help debug issues
  console.log("IssuesTab - issuesByType keys:", Object.keys(issuesByType));
  console.log("IssuesTab - total issues in issuesByType:", Object.values(issuesByType).flat().length);
  console.log("IssuesTab - pageIssues length:", pageIssues.length);
  console.log("IssuesTab - selectedPage:", selectedPage?.id, selectedPage?.url);
  
  const [groupedIssues, setGroupedIssues] = useState<Record<string, CrawlIssue[]>>(issuesByType || {});
  const [allIssues, setAllIssues] = useState<CrawlIssue[]>([]);
  
  useEffect(() => {
    // Ensure we have the latest issues data
    setGroupedIssues(issuesByType || {});
    // Flatten all issues for display
    setAllIssues(Object.values(issuesByType || {}).flat());
    
    console.log("IssuesTab - Updated groupedIssues:", Object.keys(issuesByType || {}));
    console.log("IssuesTab - Updated allIssues:", Object.values(issuesByType || {}).flat().length);
  }, [issuesByType]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If no issues are found but we have a selected page, show only that page's issues
  if (Object.keys(groupedIssues).length === 0 && allIssues.length === 0) {
    if (selectedPage && pageIssues.length > 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Problemas en la página seleccionada</h3>
            <Badge variant="outline">{pageIssues.length} problemas</Badge>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problema</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageIssues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      {issue.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={issue.severity || 'medium'} />
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {issue.page_url}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    
    // If no issues at all
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium">No se encontraron problemas</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          No se encontraron problemas en el análisis. Esto puede significar que el sitio web está bien optimizado
          o que el análisis no pudo detectar problemas específicos.
        </p>
      </div>
    );
  }

  return (
    <IssuesTabContent 
      issuesByType={issuesByType} 
      pageIssues={pageIssues} 
      selectedPage={selectedPage}
    />
  );
};

export default IssuesTab;
