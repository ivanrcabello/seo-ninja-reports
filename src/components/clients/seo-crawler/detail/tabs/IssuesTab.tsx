
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
  issuesBySeverity?: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const IssuesTab: React.FC<IssuesTabProps> = ({ 
  issuesByType, 
  issuesBySeverity = {},
  pageIssues,
  selectedPage,
  isLoading = false 
}) => {
  // Log to help debug issues
  console.log("IssuesTab - issuesByType keys:", Object.keys(issuesByType));
  console.log("IssuesTab - issuesBySeverity keys:", Object.keys(issuesBySeverity));
  console.log("IssuesTab - total issues in issuesByType:", Object.values(issuesByType).flat().length);
  console.log("IssuesTab - pageIssues length:", pageIssues.length);
  console.log("IssuesTab - selectedPage:", selectedPage?.id, selectedPage?.url);
  
  const [groupedIssues, setGroupedIssues] = useState<Record<string, CrawlIssue[]>>(issuesByType || {});
  const [groupedBySeverity, setGroupedBySeverity] = useState<Record<string, CrawlIssue[]>>(issuesBySeverity || {});
  const [allIssues, setAllIssues] = useState<CrawlIssue[]>([]);
  
  useEffect(() => {
    // Ensure we have the latest issues data
    setGroupedIssues(issuesByType || {});
    setGroupedBySeverity(issuesBySeverity || {});
    
    // Flatten all issues for display
    setAllIssues(Object.values(issuesByType || {}).flat());
    
    console.log("IssuesTab - Updated groupedIssues:", Object.keys(issuesByType || {}));
    console.log("IssuesTab - Updated allIssues count:", Object.values(issuesByType || {}).flat().length);
  }, [issuesByType, issuesBySeverity]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If no issues are found but we have a selected page, show only that page's issues
  if ((Object.keys(groupedIssues).length === 0 && allIssues.length === 0) || 
      (allIssues.length === 0 && pageIssues.length === 0)) {
      
    // Generate default issues for common problems
    const defaultIssues = [
      {
        id: 'missing-h1',
        issue_type: 'missing_h1',
        description: 'Falta encabezado H1 en algunas páginas',
        severity: 'medium',
        page_url: selectedPage?.url || ''
      },
      {
        id: 'missing-meta',
        issue_type: 'missing_meta_description',
        description: 'Falta descripción meta en algunas páginas',
        severity: 'medium',
        page_url: selectedPage?.url || ''
      },
      {
        id: 'title-too-long',
        issue_type: 'title_length',
        description: 'Títulos demasiado largos en algunas páginas',
        severity: 'low',
        page_url: selectedPage?.url || ''
      }
    ] as CrawlIssue[];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Posibles problemas que revisar</h3>
          <Badge variant="outline">{defaultIssues.length} problemas sugeridos</Badge>
        </div>
        
        <div className="flex items-center p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 mb-4">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>No se encontraron problemas en el análisis automático. Verifica estos aspectos comunes manualmente.</p>
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
            {defaultIssues.map((issue) => (
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
                  {issue.page_url || 'Múltiples páginas'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // If we have issues data to display
  return (
    <IssuesTabContent 
      issuesByType={groupedIssues} 
      issuesBySeverity={groupedBySeverity}
      pageIssues={pageIssues} 
      selectedPage={selectedPage}
    />
  );
};

export default IssuesTab;
