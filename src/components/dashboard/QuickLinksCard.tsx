
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Plus, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Library, 
  Briefcase, 
  Code, 
  FileText,
  Calendar,
  Mail,
  Video,
  Chart
} from 'lucide-react';
import { toast } from 'sonner';
import { QuickLink } from '@/types/quick-links';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface QuickLinksCardProps {}

const QuickLinksCard: React.FC<QuickLinksCardProps> = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [newLink, setNewLink] = useState<Partial<QuickLink>>({ title: '', url: '' });
  const [isAddingLink, setIsAddingLink] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching quick links:', err);
      toast.error('Error al cargar los enlaces rápidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error('Por favor introduce título y URL');
      return;
    }
    
    try {
      // Ensure URL has protocol
      if (!/^https?:\/\//i.test(newLink.url)) {
        newLink.url = 'https://' + newLink.url;
      }
      
      const { data, error } = await supabase
        .from('quick_links')
        .insert({
          title: newLink.title,
          url: newLink.url,
          icon: newLink.icon || null
        })
        .select();
      
      if (error) throw error;
      
      setLinks(prev => [...prev, data![0]]);
      setNewLink({ title: '', url: '' });
      setIsAddingLink(false);
      toast.success('Enlace añadido correctamente');
    } catch (err: any) {
      console.error('Error adding quick link:', err);
      toast.error('Error al añadir el enlace');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;
    if (!editingLink.title || !editingLink.url) {
      toast.error('Por favor introduce título y URL');
      return;
    }
    
    try {
      // Ensure URL has protocol
      let url = editingLink.url;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      const { error } = await supabase
        .from('quick_links')
        .update({
          title: editingLink.title,
          url: url,
          icon: editingLink.icon
        })
        .eq('id', editingLink.id);
      
      if (error) throw error;
      
      setLinks(prev => prev.map(link => 
        link.id === editingLink.id 
          ? { ...editingLink, url } 
          : link
      ));
      setEditingLink(null);
      toast.success('Enlace actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating quick link:', err);
      toast.error('Error al actualizar el enlace');
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== id));
      toast.success('Enlace eliminado correctamente');
    } catch (err: any) {
      console.error('Error deleting quick link:', err);
      toast.error('Error al eliminar el enlace');
    }
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="h-4 w-4" />;
      case 'Code': return <Code className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'Calendar': return <Calendar className="h-4 w-4" />;
      case 'Mail': return <Mail className="h-4 w-4" />;
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Chart': return <Chart className="h-4 w-4" />;
      default: return <Library className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enlaces Rápidos</CardTitle>
            <CardDescription>Acceso directo a tus sitios frecuentes</CardDescription>
          </div>
          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" variant="outline">
                <Plus className="h-4 w-4" /> Añadir
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Añadir Enlace Rápido</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Título</label>
                  <Input
                    id="title"
                    placeholder="Google"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="url" className="text-sm font-medium">URL</label>
                  <Input
                    id="url"
                    placeholder="https://google.com"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAddLink}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No hay enlaces guardados</p>
            <p className="text-sm mt-1">Añade tus sitios web frecuentes para acceder rápidamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {links.map((link) => (
              <div key={link.id} className="relative group">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded">
                    {getIconComponent(link.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
                </a>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1 bg-background/90 p-1 rounded">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingLink(link);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteLink(link.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Eliminar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Enlace</DialogTitle>
            </DialogHeader>
            {editingLink && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">Título</label>
                  <Input
                    id="edit-title"
                    value={editingLink.title}
                    onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-url" className="text-sm font-medium">URL</label>
                  <Input
                    id="edit-url"
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingLink(null)}>Cancelar</Button>
              <Button onClick={handleUpdateLink}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
