
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Report, Keyword } from '@/types/report.types';
import { useKeywords } from '@/hooks/useKeywords';
import { toast } from 'sonner';
import { Loader2, Plus, Upload, Download } from 'lucide-react';
import KeywordForm from '@/components/reports/keywords/KeywordForm';
import KeywordsList from './KeywordsList';
import KeywordImport from './KeywordImport';
import KeywordExport from './KeywordExport';

interface ClientKeywordsProps {
  clientId: string;
  reports: Report[];
}

const ClientKeywords: React.FC<ClientKeywordsProps> = ({ clientId, reports }) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [keywordTab, setKeywordTab] = useState<'list' | 'import' | 'export'>('list');
  
  // If there are reports, use the most recent one
  useEffect(() => {
    if (reports && reports.length > 0) {
      const mostRecentReport = reports.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      setSelectedReportId(mostRecentReport.id);
    }
  }, [reports]);
  
  const { 
    keywords, 
    loading, 
    isSaving, 
    fetchKeywords, 
    addKeyword, 
    removeKeyword 
  } = useKeywords(selectedReportId || '');
  
  useEffect(() => {
    if (selectedReportId) {
      fetchKeywords();
    }
  }, [selectedReportId, fetchKeywords]);
  
  const handleReportChange = (reportId: string) => {
    setSelectedReportId(reportId);
  };
  
  const handleAddKeyword = async (keyword: string, searchVolume: string, difficulty: string) => {
    if (!selectedReportId) {
      toast.error('Debe seleccionar un informe primero');
      return false;
    }
    
    try {
      await addKeyword(keyword, searchVolume, difficulty);
      toast.success('Palabra clave añadida con éxito');
      return true;
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Error al añadir palabra clave');
      return false;
    }
  };
  
  const handleRemoveKeyword = async (keywordId: string) => {
    try {
      const success = await removeKeyword(keywordId);
      if (success) {
        toast.success('Palabra clave eliminada');
      }
      return success;
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast.error('Error al eliminar palabra clave');
      return false;
    }
  };
  
  const handleImportKeywords = async (keywords: Omit<Keyword, 'id' | 'reportId' | 'createdAt'>[]) => {
    if (!selectedReportId) {
      toast.error('Debe seleccionar un informe primero');
      return false;
    }
    
    let successful = 0;
    
    for (const kw of keywords) {
      try {
        const success = await addKeyword(
          kw.keyword, 
          kw.searchVolume ? kw.searchVolume.toString() : '', 
          kw.difficulty ? kw.difficulty.toString() : ''
        );
        if (success) successful++;
      } catch (error) {
        console.error(`Error importing keyword ${kw.keyword}:`, error);
      }
    }
    
    toast.success(`Importadas ${successful} de ${keywords.length} palabras clave`);
    return true;
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Gestión de Palabras Clave</CardTitle>
          <CardDescription>
            Administra las palabras clave para este cliente. Puedes añadirlas manualmente, importarlas o exportarlas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">
                Este cliente aún no tiene informes. Las palabras clave se asocian a informes específicos.
              </p>
              <Button onClick={() => window.location.hash = '#new-report'}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primer informe
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Seleccionar informe
                  </label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedReportId || ''}
                    onChange={(e) => handleReportChange(e.target.value)}
                  >
                    {reports.map(report => (
                      <option key={report.id} value={report.id}>
                        {report.title} ({new Date(report.date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={keywordTab === 'list' ? "default" : "outline"}
                    onClick={() => setKeywordTab('list')}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Gestionar
                  </Button>
                  <Button 
                    variant={keywordTab === 'import' ? "default" : "outline"}
                    onClick={() => setKeywordTab('import')}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Importar
                  </Button>
                  <Button 
                    variant={keywordTab === 'export' ? "default" : "outline"}
                    onClick={() => setKeywordTab('export')}
                    size="sm"
                    disabled={keywords.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div>
                  {keywordTab === 'list' && (
                    <div className="space-y-6">
                      <KeywordForm 
                        onAdd={handleAddKeyword}
                        isSaving={isSaving}
                        formId={`client-${clientId}`} 
                      />
                      <KeywordsList 
                        keywords={keywords} 
                        onRemove={handleRemoveKeyword} 
                      />
                    </div>
                  )}
                  
                  {keywordTab === 'import' && (
                    <KeywordImport onImport={handleImportKeywords} />
                  )}
                  
                  {keywordTab === 'export' && (
                    <KeywordExport keywords={keywords} clientName={reports[0]?.clientId || 'cliente'} />
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientKeywords;
