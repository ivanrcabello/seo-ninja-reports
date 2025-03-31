
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

interface PageSeo {
  id?: string;
  slug: string;
  title: string;
  description: string;
  keywords: string;
  page_name: string;
}

const fetchPages = async (): Promise<PageSeo[]> => {
  // Use the 'from' method with type casting to handle the missing type
  const { data, error } = await supabase
    .from('page_seo_settings' as any)
    .select('*')
    .order('page_name');
  
  if (error) throw error;
  return (data || []) as unknown as PageSeo[];
};

const SeoSettings = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<PageSeo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ['seo-pages'],
    queryFn: fetchPages,
  });
  
  const updatePage = useMutation({
    mutationFn: async (page: PageSeo) => {
      if (page.id) {
        // Update existing page
        const { data, error } = await supabase
          .from('page_seo_settings' as any)
          .update({
            title: page.title,
            description: page.description,
            keywords: page.keywords,
            slug: page.slug
          })
          .eq('id', page.id);
          
        if (error) throw error;
        return data;
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('page_seo_settings' as any)
          .insert({
            page_name: page.page_name,
            title: page.title,
            description: page.description,
            keywords: page.keywords,
            slug: page.slug
          });
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      toast.success('Configuración SEO guardada correctamente');
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error saving SEO settings:', error);
      toast.error('Error al guardar la configuración SEO');
    }
  });
  
  const handlePageSelect = (pageName: string) => {
    const selectedPage = pages?.find(p => p.page_name === pageName) || null;
    setCurrentPage(selectedPage || {
      page_name: pageName,
      title: '',
      description: '',
      keywords: '',
      slug: pageName.toLowerCase().replace(/\s+/g, '-')
    });
    setIsEditing(false);
  };
  
  const handleSave = () => {
    if (currentPage) {
      updatePage.mutate(currentPage);
    }
  };
  
  const pageOptions = [
    { name: 'Inicio', value: 'inicio' },
    { name: 'Servicios', value: 'servicios' },
    { name: 'Paquetes', value: 'paquetes' },
    { name: 'Blog', value: 'blog' },
    { name: 'Contacto', value: 'contacto' },
    { name: 'Política de Privacidad', value: 'privacidad' },
    { name: 'Cookies', value: 'cookies' },
    { name: 'Términos de Uso', value: 'terminos' },
    // Add missing pages
    { name: 'Precios', value: 'precios' },
    { name: 'Características', value: 'caracteristicas' },
    { name: 'Guías', value: 'guias' },
    { name: 'Documentación', value: 'documentacion' },
    { name: 'Recursos', value: 'recursos' },
    // Add service pages
    { name: 'SEO Local', value: 'seo-local' },
    { name: 'SEO Técnico', value: 'seo-tecnico' },
    { name: 'SEO IA', value: 'seo-ia' },
    { name: 'Contenido SEO', value: 'contenido-seo' },
    { name: 'SEO Competencia', value: 'seo-competencia' },
    { name: 'Google Business', value: 'google-business' },
    { name: 'Reseñas', value: 'resenas' },
    // Add package pages
    { name: 'Paquete Starter', value: 'pack-starter' },
    { name: 'Paquete Ascenso', value: 'pack-ascenso' },
    { name: 'Paquete Master', value: 'pack-master' }
  ];
  
  // Filter page options based on search query
  const filteredPageOptions = pageOptions.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.value.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuración SEO de páginas</CardTitle>
        <CardDescription>
          Administra los metadatos SEO para las páginas del sitio web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="page-search">Buscar página</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="page-search"
              type="text"
              placeholder="Buscar por nombre de página..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="page-select">Selecciona una página</Label>
          <Select onValueChange={handlePageSelect}>
            <SelectTrigger id="page-select">
              <SelectValue placeholder="Seleccionar página" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {filteredPageOptions.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {currentPage && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="page-title">Título de la página</Label>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                )}
              </div>
              <Input 
                id="page-title"
                value={currentPage.title}
                onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
                disabled={!isEditing}
                placeholder="Título SEO de la página"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-slug">URL Slug</Label>
              <Input 
                id="page-slug"
                value={currentPage.slug}
                onChange={(e) => setCurrentPage({...currentPage, slug: e.target.value})}
                disabled={!isEditing}
                placeholder="url-amigable"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-description">Meta Descripción</Label>
              <Textarea 
                id="page-description"
                value={currentPage.description}
                onChange={(e) => setCurrentPage({...currentPage, description: e.target.value})}
                disabled={!isEditing}
                placeholder="Descripción breve para los buscadores"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-keywords">Palabras clave</Label>
              <Input 
                id="page-keywords"
                value={currentPage.keywords}
                onChange={(e) => setCurrentPage({...currentPage, keywords: e.target.value})}
                disabled={!isEditing}
                placeholder="palabra1, palabra2, palabra3"
              />
            </div>
          </div>
        )}
      </CardContent>
      {currentPage && isEditing && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updatePage.isPending}>
            {updatePage.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SeoSettings;
