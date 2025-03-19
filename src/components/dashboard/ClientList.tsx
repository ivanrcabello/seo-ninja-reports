import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import ClientCard from './ClientCard';
import useClients from '@/hooks/useClients';
import AnimatedContainer from '../ui/AnimatedContainer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ClientList: React.FC = () => {
  const { clients, isLoading, addClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    industry: '',
    phoneNumber: '',
    wpCredentials: {
      username: '',
      password: '',
      url: ''
    },
    hostingCredentials: {
      provider: '',
      username: '',
      password: '',
      url: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.website.toLowerCase().includes(query) ||
      client.industry.toLowerCase().includes(query)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setNewClient(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setNewClient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleIndustryChange = (value: string) => {
    setNewClient(prev => ({ ...prev, industry: value }));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.website || !newClient.industry) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Clean up credentials objects if they're empty
      const clientToAdd = { ...newClient };
      
      // Only include WordPress credentials if at least username is provided
      if (!clientToAdd.wpCredentials.username) {
        delete clientToAdd.wpCredentials;
      }
      
      // Only include hosting credentials if at least provider and username are provided
      if (!clientToAdd.hostingCredentials.provider || !clientToAdd.hostingCredentials.username) {
        delete clientToAdd.hostingCredentials;
      }
      
      await addClient(clientToAdd);
      
      // Reset form
      setNewClient({
        name: '',
        website: '',
        industry: '',
        phoneNumber: '',
        wpCredentials: {
          username: '',
          password: '',
          url: ''
        },
        hostingCredentials: {
          provider: '',
          username: '',
          password: '',
          url: ''
        }
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error al añadir cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 glass-input w-full sm:w-[300px]"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Añadir Cliente</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] glass">
            <form onSubmit={handleAddClient}>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Completa el formulario para añadir un nuevo cliente a tu panel.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del Cliente</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    placeholder="Acme Corporation"
                    className="glass-input"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    name="website"
                    value={newClient.website}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com"
                    className="glass-input"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Teléfono</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newClient.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+34 600 000 000"
                    className="glass-input"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industria</Label>
                  <Select
                    value={newClient.industry}
                    onValueChange={handleIndustryChange}
                    required
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Seleccionar industria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Salud">Salud</SelectItem>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Viajes">Viajes</SelectItem>
                      <SelectItem value="Alimentación">Alimentación</SelectItem>
                      <SelectItem value="Inmobiliaria">Inmobiliaria</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="wordpress">
                    <AccordionTrigger className="py-2">
                      Credenciales de WordPress
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 mt-2">
                        <div>
                          <Label htmlFor="wpUsername">Nombre de Usuario</Label>
                          <Input
                            id="wpUsername"
                            name="wpCredentials.username"
                            value={newClient.wpCredentials.username}
                            onChange={handleInputChange}
                            placeholder="admin"
                            className="glass-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wpPassword">Contraseña</Label>
                          <Input
                            id="wpPassword"
                            name="wpCredentials.password"
                            type="password"
                            value={newClient.wpCredentials.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="glass-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wpUrl">URL de Admin</Label>
                          <Input
                            id="wpUrl"
                            name="wpCredentials.url"
                            value={newClient.wpCredentials.url}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/wp-admin"
                            className="glass-input mt-1"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="hosting">
                    <AccordionTrigger className="py-2">
                      Credenciales de Hosting
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 mt-2">
                        <div>
                          <Label htmlFor="hostingProvider">Proveedor</Label>
                          <Input
                            id="hostingProvider"
                            name="hostingCredentials.provider"
                            value={newClient.hostingCredentials.provider}
                            onChange={handleInputChange}
                            placeholder="cPanel, Plesk, etc."
                            className="glass-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hostingUsername">Nombre de Usuario</Label>
                          <Input
                            id="hostingUsername"
                            name="hostingCredentials.username"
                            value={newClient.hostingCredentials.username}
                            onChange={handleInputChange}
                            placeholder="usuario"
                            className="glass-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hostingPassword">Contraseña</Label>
                          <Input
                            id="hostingPassword"
                            name="hostingCredentials.password"
                            type="password"
                            value={newClient.hostingCredentials.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="glass-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hostingUrl">URL del Panel</Label>
                          <Input
                            id="hostingUrl"
                            name="hostingCredentials.url"
                            value={newClient.hostingCredentials.url}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com:2083"
                            className="glass-input mt-1"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Añadiendo...
                    </>
                  ) : (
                    'Añadir Cliente'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredClients.length === 0 ? (
        <AnimatedContainer animation="fade" className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground">No se encontraron clientes</h3>
          <p className="text-muted-foreground mt-2">Prueba con otra búsqueda o añade un nuevo cliente.</p>
        </AnimatedContainer>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;
