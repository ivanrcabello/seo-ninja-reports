
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleServiceError } from './baseService';

/**
 * Uploads files to Supabase storage for a specific report
 */
export const uploadReportFiles = async (
  clientId: string,
  reportId: string,
  files: File[]
): Promise<string[]> => {
  if (!files.length) {
    return [];
  }

  try {
    const uploadedFilePaths: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}/${reportId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('seo-files')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error(`Error uploading file: ${file.name}`);
      } else {
        uploadedFilePaths.push(fileName);
      }
    }
    
    return uploadedFilePaths;
  } catch (error) {
    return handleServiceError(error, 'Error uploading files');
  }
};

/**
 * Gets the public URL for a file in Supabase storage
 */
export const getFilePublicUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('seo-files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Deletes files from Supabase storage
 */
export const deleteReportFiles = async (filePaths: string[]): Promise<void> => {
  if (!filePaths.length) {
    return;
  }

  try {
    const { error } = await supabase.storage
      .from('seo-files')
      .remove(filePaths);
      
    if (error) {
      console.error('Error deleting files:', error);
      toast.error('Error deleting files');
    }
  } catch (error) {
    handleServiceError(error, 'Error deleting files');
  }
};
