
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Report, Keyword } from '@/types/report.types';
import { toast } from 'sonner';
import { Loader2, Plus, Upload, Download } from 'lucide-react';
import KeywordForm from '@/components/reports/keywords/KeywordForm';
import KeywordsList from './KeywordsList';
import KeywordImport from './KeywordImport';
import KeywordExport from './KeywordExport';
import { getClientKeywords, importKeywords } from '@/services/clientKeywordsService';
import { supabase } from '@/integrations/supabase/client';

interface ClientKeywordsProps {
  clientId: string;
  reports?: Report[];
}

const ClientKeywords: React.FC<ClientKeywordsProps> = ({ clientId, reports = [] }) => {
  const [keywordTab, setKeywordTab] = useState<'list' | 'import' | 'export'>('list');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch keywords when the client changes
  useEffect(() => {
    const fetchKeywords = async () => {
      if (clientId) {
        setIsLoading(true);
        try {
          const fetchedKeywords = await getClientKeywords(clientId);
          setKeywords(fetchedKeywords);
        } catch (error) {
          console.error('Error fetching keywords:', error);
          toast.error('Error al cargar palabras clave');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchKeywords();
  }, [clientId]);
  
  const handleAddKeyword = async (keyword: string, searchVolume: string, difficulty: string) => {
    if (!clientId) {
      toast.error('No se puede identificar el cliente');
      return false;
    }
    
    try {
      setIsSaving(true);
      
      // Get latest report ID for this client
      const { data: latestReports, error: reportError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);
        
      if (reportError) {
        throw reportError;
      }
      
      if (!latestReports || latestReports.length === 0) {
        toast.error('Este cliente no tiene informes. Crea un informe primero.');
        return false;
      }
      
      const reportId = latestReports[0].id;
      
      // Insert the keyword
      const { data, error } = await supabase
        .from('keywords')
        .insert({
          report_id: reportId,
          keyword: keyword.trim(),
          search_volume: searchVolume ? parseInt(searchVolume) : null,
          difficulty: difficulty ? parseInt(difficulty) : null
        })
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') {
          toast.error('Esta palabra clave ya existe para este cliente');
        } else {
          throw error;
        }
        return false;
      }
      
      // Create the new keyword object
      const newKeyword: Keyword = {
        id: data.id,
        reportId: data.report_id,
        keyword: data.keyword,
        searchVolume: data.search_volume,
        difficulty: data.difficulty,
        createdAt: data.created_at
      };
      
      // Update local state
      setKeywords(prevKeywords => [newKeyword, ...prevKeywords]);
      
      toast.success('Palabra clave añadida con éxito');
      return true;
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Error al añadir palabra clave');
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRemoveKeyword = async (keywordId: string) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', keywordId);
        
      if (error) {
        throw error;
      }
      
      // Remove keyword from local state
      setKeywords(prevKeywords => prevKeywords.filter(k => k.id !== keywordId));
      toast.success('Palabra clave eliminada');
      return true;
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast.error('Error al eliminar palabra clave');
      return false;
    }
  };
  
  const handleImportKeywords = async (keywordsToImport: Omit<Keyword, 'id' | 'reportId' | 'createdAt'>[]) => {
    if (!clientId) {
      toast.error('No se puede identificar el cliente');
      return false;
    }
    
    try {
      setIsSaving(true);
      
      // Get latest report ID for this client
      const { data: latestReports, error: reportError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);
        
      if (reportError) {
        throw reportError;
      }
      
      if (!latestReports || latestReports.length === 0) {
        toast.error('Este cliente no tiene informes. Crea un informe primero.');
        return false;
      }
      
      const reportId = latestReports[0].id;
      
      // Import keywords using the service
      const successCount = await importKeywords(reportId, keywordsToImport);
      
      // Refresh keywords list
      const updatedKeywords = await getClientKeywords(clientId);
      setKeywords(updatedKeywords);
      
      toast.success(`Importadas ${successCount} de ${keywordsToImport.length} palabras clave`);
      return true;
    } catch (error) {
      console.error('Error importing keywords:', error);
      toast.error('Error al importar palabras clave');
      return false;
    } finally {
      setIsSaving(false);
    }
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
              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4">
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
              
              {isLoading ? (
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
