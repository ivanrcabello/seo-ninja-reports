
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError } from "./baseService";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image_url?: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  date?: string; // For backwards compatibility with UI
}

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format posts for UI compatibility
    return data.map(post => ({
      ...post,
      date: new Date(post.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }));
  } catch (error) {
    return handleServiceError(error, 'Error al cargar los artículos del blog');
  }
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      date: new Date(data.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  } catch (error) {
    return handleServiceError(error, 'Error al crear el artículo del blog');
  }
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...post,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      date: new Date(data.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  } catch (error) {
    return handleServiceError(error, 'Error al actualizar el artículo del blog');
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    return handleServiceError(error, 'Error al eliminar el artículo del blog');
  }
};

export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[áéíóúü]/g, match => {
      const chars: Record<string, string> = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n'
      };
      return chars[match] || match;
    })
    .replace(/-+/g, '-')
    .trim();
};
