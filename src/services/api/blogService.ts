
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

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!data) return null;
    
    return {
      ...data,
      date: new Date(data.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  } catch (error) {
    return handleServiceError(error, `Error al cargar el artículo con slug: ${slug}`);
  }
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>, image?: File): Promise<BlogPost> => {
  try {
    let imageUrl = post.image_url;
    
    // Upload image if provided
    if (image) {
      const { data: imageData, error: imageError } = await uploadBlogImage(image);
      if (imageError) throw imageError;
      imageUrl = imageData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ ...post, image_url: imageUrl }])
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

export const updateBlogPost = async (id: string, post: Partial<BlogPost>, image?: File): Promise<BlogPost> => {
  try {
    let imageUrl = post.image_url;
    
    // Upload image if provided
    if (image) {
      const { data: imageData, error: imageError } = await uploadBlogImage(image);
      if (imageError) throw imageError;
      imageUrl = imageData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...post,
        image_url: imageUrl,
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

export const uploadBlogImage = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('blog_images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('blog_images')
      .getPublicUrl(filePath);
      
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading image: ', error);
    return { data: null, error };
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
