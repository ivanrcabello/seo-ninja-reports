
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CrawlIssue } from '@/services/seo-crawler/types';
import { AlertTriangle, Check } from 'lucide-react';
import SeverityBadge from '@/components/clients/seo-crawler/detail/SeverityBadge';
import { groupIssuesBySeverity } from '../utils/crawlerReportUtils';

interface IssuesTabProps {
  issues: CrawlIssue[];
}

const IssuesTab: React.FC<IssuesTabProps> = ({ issues = [] }) => {
  const issuesBySeverity = groupIssuesBySeverity(issues);
  
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Check className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium">No se encontraron problemas</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          No se encontraron problemas en el análisis. El sitio web parece estar bien optimizado.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Problemas por severidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(issuesBySeverity).map(([severity, issuesList]) => (
              <div 
                key={severity}
                className="border rounded-lg p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <SeverityBadge severity={severity} />
                  <Badge variant="outline">{issuesList.length}</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  {issuesList.slice(0, 3).map(issue => (
                    <li key={issue.id} className="truncate">
                      <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500" />
                      {issue.description}
                    </li>
                  ))}
                  {issuesList.length > 3 && (
                    <li className="text-muted-foreground">
                      + {issuesList.length - 3} más...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos los problemas</CardTitle>
          <CardDescription>Total: {issues.length} problemas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problema</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{issue.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={issue.severity || 'info'} />
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {issue.page_url}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssuesTab;
