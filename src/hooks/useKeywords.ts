
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Keyword } from '@/types/report.types';
import { toast } from 'sonner';

export const useKeywords = (reportId: string) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      
      // Transform database fields to match our Keyword interface
      const formattedKeywords = data.map((item: any) => ({
        id: item.id,
        reportId: item.report_id,
        keyword: item.keyword,
        searchVolume: item.search_volume,
        difficulty: item.difficulty,
        createdAt: item.created_at
      }));
      
      setKeywords(formattedKeywords);
      return formattedKeywords;
    } catch (error: any) {
      console.error('Error fetching keywords:', error);
      toast.error('Error al cargar las palabras clave');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async (newKeyword: string, searchVolume: string, difficulty: string) => {
    if (!newKeyword.trim()) {
      toast.error('Debes ingresar una palabra clave');
      return null;
    }
    
    try {
      setIsSaving(true);
      
      // Check if keyword already exists for this report
      const exists = keywords.some(k => k.keyword.toLowerCase() === newKeyword.toLowerCase());
      if (exists) {
        toast.error('Esta palabra clave ya existe para este informe');
        return null;
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
      
      const updatedKeywords = [newKeywordObject, ...keywords];
      setKeywords(updatedKeywords);
      
      toast.success('Palabra clave añadida');
      
      // Update the report content in the database to include keywords
      await updateReportKeywords(updatedKeywords);
      
      return newKeywordObject;
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      toast.error('Error al añadir la palabra clave');
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
      
      // Remove keyword from the list
      const updatedKeywords = keywords.filter(k => k.id !== id);
      setKeywords(updatedKeywords);
      
      // Update the report content in the database
      await updateReportKeywords(updatedKeywords);
      
      toast.success('Palabra clave eliminada');
      return true;
    } catch (error: any) {
      console.error('Error removing keyword:', error);
      toast.error('Error al eliminar la palabra clave');
      return false;
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
