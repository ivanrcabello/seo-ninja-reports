
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Keyword } from '@/types/report.types';

interface KeywordsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

const KeywordsDialog: React.FC<KeywordsDialogProps> = ({
  open,
  onOpenChange,
  reportId
}) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [searchVolume, setSearchVolume] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch keywords when dialog opens
  useEffect(() => {
    if (open && reportId) {
      fetchKeywords();
    }
  }, [open, reportId]);
  
  const fetchKeywords = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Transform database fields to match our KeywordModel interface
      const formattedKeywords = data.map((item: any) => ({
        id: item.id,
        reportId: item.report_id,
        keyword: item.keyword,
        searchVolume: item.search_volume,
        difficulty: item.difficulty,
        createdAt: item.created_at
      }));
      
      setKeywords(formattedKeywords);
    } catch (error: any) {
      console.error('Error fetching keywords:', error);
      toast.error('Error al cargar las palabras clave');
    } finally {
      setLoading(false);
    }
  };
  
  const addKeyword = async () => {
    if (!newKeyword.trim()) {
      toast.error('Debes ingresar una palabra clave');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Check if keyword already exists for this report
      const exists = keywords.some(k => k.keyword.toLowerCase() === newKeyword.toLowerCase());
      if (exists) {
        toast.error('Esta palabra clave ya existe para este informe');
        return;
      }
      
      const { data, error } = await supabase
        .from('keywords')
        .insert({
          report_id: reportId,
          keyword: newKeyword.trim(),
          search_volume: searchVolume ? parseInt(searchVolume) : null,
          difficulty: difficulty ? parseInt(difficulty) : null
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add new keyword to the list
      const newKeywordObject: Keyword = {
        id: data.id,
        reportId: data.report_id,
        keyword: data.keyword,
        searchVolume: data.search_volume,
        difficulty: data.difficulty,
        createdAt: data.created_at
      };
      
      setKeywords([newKeywordObject, ...keywords]);
      setNewKeyword('');
      setSearchVolume('');
      setDifficulty('');
      
      toast.success('Palabra clave añadida');
      
      // Update the report content in the database to include keywords
      await updateReportKeywords([...keywords, newKeywordObject]);
      
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      toast.error('Error al añadir la palabra clave');
    } finally {
      setIsSaving(false);
    }
  };
  
  const removeKeyword = async (id: string) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove keyword from the list
      const updatedKeywords = keywords.filter(k => k.id !== id);
      setKeywords(updatedKeywords);
      
      // Update the report content in the database
      await updateReportKeywords(updatedKeywords);
      
      toast.success('Palabra clave eliminada');
    } catch (error: any) {
      console.error('Error removing keyword:', error);
      toast.error('Error al eliminar la palabra clave');
    }
  };
  
  // Update the keywords in the report content
  const updateReportKeywords = async (keywordsList: Keyword[]) => {
    try {
      // Format keywords for the report content
      const keywordsContent = keywordsList
        .map(k => {
          let keywordText = `- ${k.keyword}`;
          if (k.searchVolume) keywordText += ` (Volumen: ${k.searchVolume})`;
          if (k.difficulty) keywordText += ` (Dificultad: ${k.difficulty}/100)`;
          return keywordText;
        })
        .join('\\n');
      
      // Get current report content
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('content')
        .eq('id', reportId)
        .single();
        
      if (reportError) {
        throw reportError;
      }
      
      // Update content with keywords
      const updatedContent = {
        ...reportData.content,
        keywords: keywordsContent
      };
      
      // Save updated content
      const { error: updateError } = await supabase
        .from('reports')
        .update({ content: updatedContent })
        .eq('id', reportId);
        
      if (updateError) {
        throw updateError;
      }
      
    } catch (error: any) {
      console.error('Error updating report keywords content:', error);
      // Don't show toast here as it's a background operation
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle>Palabras Clave</DialogTitle>
          <DialogDescription>
            Gestiona las palabras clave relacionadas con este informe. Se mostrarán en el informe y se utilizarán para mejorar los análisis futuros.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Label htmlFor="keyword">Palabra Clave</Label>
                <Input
                  id="keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Ej: marketing digital"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="volume">Volumen</Label>
                <Input
                  id="volume"
                  type="number"
                  value={searchVolume}
                  onChange={(e) => setSearchVolume(e.target.value)}
                  placeholder="Ej: 1000"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="difficulty">Dificultad (1-100)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max="100"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  placeholder="Ej: 65"
                />
              </div>
            </div>
            
            <Button 
              onClick={addKeyword} 
              className="w-full" 
              disabled={isSaving || !newKeyword.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Palabra Clave
                </>
              )}
            </Button>
            
            <div className="space-y-2 mt-4">
              <Label>Palabras Clave Añadidas</Label>
              {keywords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay palabras clave añadidas.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <div 
                      key={keyword.id} 
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <span>{keyword.keyword}</span>
                      {keyword.searchVolume && (
                        <span className="text-xs">({keyword.searchVolume})</span>
                      )}
                      {keyword.difficulty && (
                        <span className="text-xs">{keyword.difficulty}/100</span>
                      )}
                      <button 
                        onClick={() => removeKeyword(keyword.id)}
                        className="ml-1 text-primary/70 hover:text-primary transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordsDialog;
