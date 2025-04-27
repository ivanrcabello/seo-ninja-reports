import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useClients from '@/hooks/useClients';
import { ArrowLeft } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Client } from '@/types/client.types';
import Layout from '@/components/layout/Layout';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  website: z.string().url({
    message: 'Por favor, introduce una URL válida.',
  }),
  industry: z.string().min(1, {
    message: 'Por favor, ingresa la industria del cliente.',
  }),
  phone_number: z.string().optional(),
  active: z.boolean().default(true),
  wp_credentials: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    url: z.string().optional(),
  }).optional().nullable(),
  hosting_credentials: z.object({
    provider: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    url: z.string().optional(),
  }).optional().nullable(),
  company_name: z.string().optional(),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  email: z.string().email({ message: "Introduce un correo electrónico válido" }).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: 'https://',
      industry: '',
      phone_number: '',
      active: true,
      wp_credentials: null,
      hosting_credentials: null,
      company_name: '',
      address: '',
      tax_id: '',
      email: '',
      notes: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let wpCredentials = null;
      if (data.wp_credentials && data.wp_credentials.username && data.wp_credentials.password) {
        wpCredentials = {
          username: data.wp_credentials.username,
          password: data.wp_credentials.password,
          url: data.wp_credentials.url || ''
        };
      }

      let hostingCredentials = null;
      if (data.hosting_credentials && data.hosting_credentials.username && data.hosting_credentials.password) {
        hostingCredentials = {
          provider: data.hosting_credentials.provider || '',
          username: data.hosting_credentials.username,
          password: data.hosting_credentials.password,
          url: data.hosting_credentials.url || ''
        };
      }

      const clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
        name: data.name,
        website: data.website,
        industry: data.industry,
        phone_number: data.phone_number,
        active: data.active,
        wp_credentials: wpCredentials,
        hosting_credentials: hostingCredentials,
        company_name: data.company_name,
        address: data.address,
        tax_id: data.tax_id,
        email: data.email,
        notes: data.notes,
      };

      const newClient = await addClient(clientData);
      
      toast.success('Cliente creado correctamente');
      
      navigate(`/clients/${newClient.id}`);
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.message || 'Error al crear el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Información Básica</TabsTrigger>
                <TabsTrigger value="additional">Información Adicional</TabsTrigger>
                <TabsTrigger value="credentials">Credenciales</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del cliente" {...field} />
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
                              <Input placeholder="https://ejemplo.com" {...field} />
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
                              <Input placeholder="Industria o sector" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="Teléfono de contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Cliente activo
                            </FormLabel>
                            <FormDescription>
                              Desmarca esta opción si el cliente está inactivo o ha sido archivado.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="additional" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de la empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tax_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NIF/CIF</FormLabel>
                            <FormControl>
                              <Input placeholder="Número de identificación fiscal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Dirección completa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="Correo de contacto" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Información adicional o notas sobre el cliente" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="credentials" className="space-y-4">
                    <div className="space-y-4 border rounded-md p-4">
                      <h3 className="font-medium">Credenciales de WordPress</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="wp_credentials.username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuario WordPress</FormLabel>
                              <FormControl>
                                <Input placeholder="Usuario de WordPress" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="wp_credentials.password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña WordPress</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Contraseña de WordPress" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="wp_credentials.url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Admin WordPress</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://ejemplo.com/wp-admin" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 border rounded-md p-4">
                      <h3 className="font-medium">Credenciales de Hosting</h3>
                      
                      <FormField
                        control={form.control}
                        name="hosting_credentials.provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proveedor de Hosting</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: SiteGround, Hostinger, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="hosting_credentials.username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuario de Hosting</FormLabel>
                              <FormControl>
                                <Input placeholder="Usuario del panel de hosting" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hosting_credentials.password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña de Hosting</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Contraseña del panel de hosting" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="hosting_credentials.url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL del Panel de Hosting</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://cpanel.ejemplo.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creando...' : 'Crear Cliente'}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewClientPage;
