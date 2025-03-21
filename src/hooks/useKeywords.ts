
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Keyword } from '@/types/report.types';
import { toast } from 'sonner';

export const useKeywords = (reportId: string) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchKeywords = async () => {
    if (!reportId) return;
    
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
      
      // Transform to Keyword objects
      const fetchedKeywords: Keyword[] = data.map((item: any) => ({
        id: item.id,
        reportId: item.report_id,
        keyword: item.keyword,
        searchVolume: item.search_volume,
        difficulty: item.difficulty,
        createdAt: item.created_at
      }));
      
      setKeywords(fetchedKeywords);
    } catch (error: any) {
      console.error('Error fetching keywords:', error);
      toast.error('Error al cargar palabras clave');
    } finally {
      setLoading(false);
    }
  };

  // Fetch keywords when reportId changes
  useEffect(() => {
    if (reportId) {
      fetchKeywords();
    }
  }, [reportId]);

  const addKeyword = async (newKeyword: string, searchVolume: string, difficulty: string) => {
    if (!reportId || !newKeyword.trim()) {
      toast.error('Debes ingresar una palabra clave y seleccionar un informe');
      return null;
    }
    
    try {
      setIsSaving(true);
      
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
      
      // Create the new keyword object
      const newKeywordObject: Keyword = {
        id: data.id,
        reportId: data.report_id,
        keyword: data.keyword,
        searchVolume: data.search_volume,
        difficulty: data.difficulty,
        createdAt: data.created_at
      };
      
      // Update local state
      setKeywords(prevKeywords => [newKeywordObject, ...prevKeywords]);
      
      await updateReportKeywords(reportId);
      
      return newKeywordObject;
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      if (error.code === '23505') {
        toast.error('Esta palabra clave ya existe para este informe');
      } else {
        toast.error('Error al añadir la palabra clave');
      }
      return null;
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
      
      // Update local state
      setKeywords(prevKeywords => prevKeywords.filter(k => k.id !== id));
      
      // Update the report content in the database
      await updateReportKeywords(reportId);
      
      return true;
    } catch (error: any) {
      console.error('Error removing keyword:', error);
      toast.error('Error al eliminar la palabra clave');
      return false;
    }
  };
  
  // Update the keywords in the report content
  const updateReportKeywords = async (reportId: string) => {
    try {
      // Fetch all keywords for this report
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });
        
      if (keywordsError) {
        throw keywordsError;
      }
      
      // Transform to Keyword objects
      const keywords: Keyword[] = keywordsData.map((item: any) => ({
        id: item.id,
        reportId: item.report_id,
        keyword: item.keyword,
        searchVolume: item.search_volume,
        difficulty: item.difficulty,
        createdAt: item.created_at
      }));
      
      // Format keywords for the report content
      const keywordsContent = keywords
        .map(k => {
          let keywordText = `- ${k.keyword}`;
          if (k.searchVolume) keywordText += ` (Volumen: ${k.searchVolume})`;
          if (k.difficulty) keywordText += ` (Dificultad: ${k.difficulty}/100)`;
          return keywordText;
        })
        .join('\n');
      
      // Get current report content
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('content')
        .eq('id', reportId)
        .single();
        
      if (reportError) {
        throw reportError;
      }
      
      // Make sure reportData.content is an object before spreading it
      const content = reportData.content && typeof reportData.content === 'object' 
        ? reportData.content 
        : {};
        
      const updatedContent = {
        ...content,
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

  return {
    keywords,
    loading,
    isSaving,
    fetchKeywords,
    addKeyword,
    removeKeyword,
  };
};
