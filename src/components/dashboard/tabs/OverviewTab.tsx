
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Activity, 
  Calendar, 
  Clock, 
  Settings, 
  DollarSign,
  ExternalLink,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { Client as ClientType } from '@/types/client.types';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define quick link type
interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  created_at?: string;
}

// Define interfaces for the component props
export interface OverviewTabProps {
  trackSectionVisibility?: (sectionId: string) => void;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  clients?: ClientType[];
  reports?: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ trackSectionVisibility, setActiveTab, clients: propClients, reports: propReports }) => {
  const { clients: hookClients } = useClients();
  const { reports: hookReports } = useReports();
  
  // Quick links state
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Use props if provided, otherwise use hook data
  const clients = propClients || hookClients || [];
  const reports = propReports || hookReports || [];

  // Calculate metrics
  const totalClients = clients.length;
  // Filter by active flag instead of status
  const activeClients = clients.filter(client => client.active).length;
  const totalReports = reports.length;
  
  // Mock monthly revenue - in a real app this would come from an API or calculation of actual invoice data
  const monthlyRevenue = 3950;

  // Function to navigate to a specific tab
  const navigateToTab = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };
  
  // Fetch quick links
  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        setIsLoadingLinks(true);
        const { data, error } = await supabase
          .from('quick_links')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setQuickLinks(data || []);
      } catch (err: any) {
        console.error('Error fetching quick links:', err);
        toast.error('Error al cargar enlaces rápidos');
      } finally {
        setIsLoadingLinks(false);
      }
    };
    
    fetchQuickLinks();
  }, []);
  
  // Add new quick link
  const handleAddQuickLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error('Por favor, introduce un título y una URL válida');
      return;
    }
    
    // Ensure URL has http:// or https:// prefix
    let url = newLinkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .insert([
          { title: newLinkTitle.trim(), url }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      setQuickLinks(prev => [data, ...prev]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAddDialogOpen(false);
      toast.success('Enlace añadido correctamente');
    } catch (err: any) {
      console.error('Error adding quick link:', err);
      toast.error('Error al añadir enlace rápido');
    }
  };
  
  // Update quick link
  const handleUpdateQuickLink = async () => {
    if (!editingLink) return;
    
    if (!editingLink.title.trim() || !editingLink.url.trim()) {
      toast.error('Por favor, introduce un título y una URL válida');
      return;
    }
    
    // Ensure URL has http:// or https:// prefix
    let url = editingLink.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .update({ title: editingLink.title.trim(), url })
        .eq('id', editingLink.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setQuickLinks(prev => prev.map(link => link.id === editingLink.id ? data : link));
      setEditingLink(null);
      setIsEditDialogOpen(false);
      toast.success('Enlace actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating quick link:', err);
      toast.error('Error al actualizar enlace rápido');
    }
  };
  
  // Delete quick link
  const handleDeleteQuickLink = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setQuickLinks(prev => prev.filter(link => link.id !== id));
      toast.success('Enlace eliminado correctamente');
    } catch (err: any) {
      console.error('Error deleting quick link:', err);
      toast.error('Error al eliminar enlace rápido');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard 
          title="Total Clientes" 
          value={totalClients} 
          icon={<Users size={20} />} 
        />
        <DashboardMetricCard 
          title="Clientes Activos" 
          value={activeClients} 
          icon={<Activity size={20} />} 
        />
        <DashboardMetricCard 
          title="Informes Creados" 
          value={totalReports} 
          icon={<FileText size={20} />} 
        />
        <DashboardMetricCard 
          title="Facturación Mensual" 
          value={`${monthlyRevenue}€`} 
          trend={{ value: 8, isPositive: true }}
          icon={<DollarSign size={20} />} 
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            asChild
          >
            <Link to="/dashboard">
              <Users className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Clientes</div>
                <div className="text-xs text-muted-foreground">Gestionar todos los clientes</div>
              </div>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => navigateToTab('reports')}
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Informes</div>
                <div className="text-xs text-muted-foreground">Ver todos los informes</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => navigateToTab('activity')}
          >
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Actividad</div>
                <div className="text-xs text-muted-foreground">Ver actividad reciente</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 justify-start"
            onClick={() => navigateToTab('calendar')}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Calendario</div>
                <div className="text-xs text-muted-foreground">Gestionar eventos</div>
              </div>
            </div>
          </Button>
        </div>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enlaces Rápidos Personalizados</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Añadir Enlace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Enlace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Google Search Console"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://search.google.com/search-console"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAddQuickLink}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingLinks ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : quickLinks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay enlaces rápidos guardados</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Añadir Enlace
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <div 
                  key={link.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => {
                        setEditingLink(link);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive" 
                      onClick={() => handleDeleteQuickLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-center"
                  >
                    <div className="flex flex-col items-center mb-2">
                      <ExternalLink className="h-10 w-10 mb-2 text-primary" />
                      <h4 className="font-medium">{link.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-full">{link.url}</p>
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {/* Edit link dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Enlace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    placeholder="Google Search Console"
                    value={editingLink?.title || ''}
                    onChange={(e) => setEditingLink(prev => prev ? {...prev, title: e.target.value} : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-url">URL</Label>
                  <Input
                    id="edit-url"
                    placeholder="https://search.google.com/search-console"
                    value={editingLink?.url || ''}
                    onChange={(e) => setEditingLink(prev => prev ? {...prev, url: e.target.value} : null)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleUpdateQuickLink}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
