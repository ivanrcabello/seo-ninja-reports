
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const wpCredentialsSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().url({ message: 'Debe ser una URL válida' }).optional().or(z.literal(''))
}).optional();

const hostingCredentialsSchema = z.object({
  provider: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().url({ message: 'Debe ser una URL válida' }).optional().or(z.literal(''))
}).optional();

const clientSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  website: z.string().url({ message: 'Debe ser una URL válida' }),
  industry: z.string().min(1, { message: 'Seleccione una industria' }),
  phoneNumber: z.string().optional(),
  wpCredentials: wpCredentialsSchema,
  hostingCredentials: hostingCredentialsSchema
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface EditClientFormProps {
  client: Client;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const EditClientForm: React.FC<EditClientFormProps> = ({ client, onSubmit, isSubmitting }) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client.name,
      website: client.website,
      industry: client.industry || '',
      phoneNumber: client.phoneNumber || '',
      wpCredentials: client.wpCredentials || {
        username: '',
        password: '',
        url: ''
      },
      hostingCredentials: client.hostingCredentials || {
        provider: '',
        username: '',
        password: '',
        url: ''
      }
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corporation" {...field} className="glass-input" />
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
                <Input placeholder="https://ejemplo.com" {...field} className="glass-input" />
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
                <Input placeholder="+34 600 000 000" {...field} className="glass-input" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Seleccionar industria" />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="wordpress">
            <AccordionTrigger>Credenciales de WordPress</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 mt-2">
                <FormField
                  control={form.control}
                  name="wpCredentials.username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wpCredentials.password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wpCredentials.url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Admin</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ejemplo.com/wp-admin" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="hosting">
            <AccordionTrigger>Credenciales de Hosting</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 mt-2">
                <FormField
                  control={form.control}
                  name="hostingCredentials.provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <FormControl>
                        <Input placeholder="cPanel, Plesk, etc." {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hostingCredentials.username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hostingCredentials.password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hostingCredentials.url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Panel</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ejemplo.com:2083" {...field} className="glass-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditClientForm;
