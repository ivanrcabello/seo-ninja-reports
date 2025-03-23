
import React, { useState } from 'react';
import { PlusCircle, Loader2, ExternalLink, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ClientCard from './ClientCard';
import useClients from '@/hooks/useClients';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Client } from '@/types/client.types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  website: z.string().url({
    message: 'Por favor, introduce una URL válida.',
  }),
  industry: z.string().min(1, {
    message: 'Por favor, selecciona una industria.',
  }),
  phoneNumber: z.string().optional(),
  wpUsername: z.string().optional(),
  wpPassword: z.string().optional(),
  wpUrl: z.string().optional(),
});

interface ClientListProps {
  clients?: Client[];
  view?: 'cards' | 'table';
  reportsMap?: Record<string, number>;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients: providedClients, 
  view = 'cards',
  reportsMap = {}
}) => {
  const { clients: allClients, isLoading, addClient } = useClients();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  // Use provided clients or fall back to all clients from the hook
  const clients = providedClients || allClients;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: '',
      industry: 'Otro',
      phoneNumber: '',
      wpUsername: '',
      wpPassword: '',
      wpUrl: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsCreating(true);
    try {
      const clientData = {
        name: data.name,
        website: data.website,
        industry: data.industry,
        phone_number: data.phoneNumber,
        active: true,
        wp_credentials: data.wpUsername ? {
          username: data.wpUsername,
          password: data.wpPassword,
          url: data.wpUrl
        } : null,
        hosting_credentials: null
      };
      
      await addClient(clientData);
      toast({
        title: 'Cliente creado',
        description: 'El cliente se ha creado correctamente.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error al crear el cliente',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }

  if (view === 'table') {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Industria</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sitio Web</TableHead>
                  <TableHead>Informes</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No hay clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5">
                          {client.industry || "Sin categoría"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {client.active ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm">Activo</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-muted-foreground">Inactivo</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={client.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary flex items-center hover:underline"
                        >
                          {client.website.replace(/^https?:\/\//, '').substring(0, 20)}
                          {client.website.replace(/^https?:\/\//, '').length > 20 ? '...' : ''}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-primary mr-1" />
                          <span>{reportsMap[client.id] || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.created_at ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{format(new Date(client.created_at), 'dd/MM/yyyy')}</span>
                          </div>
                        ) : (
                          "Fecha desconocida"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/clients/${client.id}`}>
                            Ver cliente
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-medium mb-4">Añadir Cliente</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del cliente" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industria</FormLabel>
                      <FormControl>
                        <Input placeholder="Industria del cliente" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Teléfono del cliente" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Cliente
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.length === 0 && !isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No hay clientes.</p>
        </div>
      ) : (
        clients.map((client, index) => (
          <ClientCard 
            key={client.id} 
            client={client} 
            index={index} 
            reportsCount={reportsMap[client.id] || 0}
          />
        ))
      )}

      <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
        <h3 className="text-lg font-medium mb-4">Añadir Cliente</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industria</FormLabel>
                  <FormControl>
                    <Input placeholder="Industria del cliente" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono del cliente" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ClientList;
