import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
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

const ClientList = () => {
  const { clients, isLoading, addClient } = useClients();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.length === 0 && !isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No hay clientes.</p>
        </div>
      ) : (
        clients.map((client, index) => (
          <ClientCard key={client.id} client={client} index={index} />
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
