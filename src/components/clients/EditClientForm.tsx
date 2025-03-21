
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useClients from '@/hooks/useClients';
import { Client } from '@/types/client.types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  active: z.boolean().default(true),
  wpUsername: z.string().optional(),
  wpPassword: z.string().optional(),
  wpUrl: z.string().optional(),
  hostingProvider: z.string().optional(),
  hostingUsername: z.string().optional(),
  hostingPassword: z.string().optional(),
  hostingUrl: z.string().optional(),
});

interface EditClientFormProps {
  client: Client;
  onSuccess: () => void;
}

const EditClientForm: React.FC<EditClientFormProps> = ({ client, onSuccess }) => {
  const { updateClient } = useClients();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.name,
      website: client.website,
      industry: client.industry,
      phoneNumber: client.phoneNumber || '',
      active: client.active,
      wpUsername: client.wpCredentials?.username || '',
      wpPassword: client.wpCredentials?.password || '',
      wpUrl: client.wpCredentials?.url || '',
      hostingProvider: client.hostingCredentials?.provider || '',
      hostingUsername: client.hostingCredentials?.username || '',
      hostingPassword: client.hostingCredentials?.password || '',
      hostingUrl: client.hostingCredentials?.url || '',
    }
  });

  const activeValue = watch('active');
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const updateData = {
        name: data.name,
        website: data.website,
        industry: data.industry,
        phoneNumber: data.phoneNumber,
        active: data.active,
        wpCredentials: data.wpUsername ? {
          username: data.wpUsername,
          password: data.wpPassword,
          url: data.wpUrl
        } : null,
        hostingCredentials: data.hostingProvider && data.hostingUsername ? {
          provider: data.hostingProvider,
          username: data.hostingUsername,
          password: data.hostingPassword,
          url: data.hostingUrl
        } : null
      };
      
      await updateClient(client.id, updateData);
      onSuccess();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre del Cliente</Label>
        <Input
          id="name"
          className="glass-input mt-1"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="website">Sitio Web</Label>
        <Input
          id="website"
          className="glass-input mt-1"
          {...register('website')}
        />
        {errors.website && (
          <p className="text-destructive text-sm mt-1">{errors.website.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="phoneNumber">Teléfono</Label>
        <Input
          id="phoneNumber"
          className="glass-input mt-1"
          {...register('phoneNumber')}
        />
      </div>
      
      <div>
        <Label htmlFor="industry">Industria</Label>
        <Select
          value={watch('industry')}
          onValueChange={(value) => setValue('industry', value)}
        >
          <SelectTrigger className="glass-input mt-1">
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
        {errors.industry && (
          <p className="text-destructive text-sm mt-1">{errors.industry.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="client-active" 
          checked={activeValue}
          onCheckedChange={(checked) => setValue('active', checked)}
        />
        <Label htmlFor="client-active" className={activeValue ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
          {activeValue ? "Cliente Activo" : "Cliente Inactivo"}
        </Label>
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
                  className="glass-input mt-1"
                  {...register('wpUsername')}
                />
              </div>
              <div>
                <Label htmlFor="wpPassword">Contraseña</Label>
                <Input
                  id="wpPassword"
                  type="password"
                  className="glass-input mt-1"
                  {...register('wpPassword')}
                />
              </div>
              <div>
                <Label htmlFor="wpUrl">URL de Admin</Label>
                <Input
                  id="wpUrl"
                  className="glass-input mt-1"
                  {...register('wpUrl')}
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
                  className="glass-input mt-1"
                  {...register('hostingProvider')}
                />
              </div>
              <div>
                <Label htmlFor="hostingUsername">Nombre de Usuario</Label>
                <Input
                  id="hostingUsername"
                  className="glass-input mt-1"
                  {...register('hostingUsername')}
                />
              </div>
              <div>
                <Label htmlFor="hostingPassword">Contraseña</Label>
                <Input
                  id="hostingPassword"
                  type="password"
                  className="glass-input mt-1"
                  {...register('hostingPassword')}
                />
              </div>
              <div>
                <Label htmlFor="hostingUrl">URL del Panel</Label>
                <Input
                  id="hostingUrl"
                  className="glass-input mt-1"
                  {...register('hostingUrl')}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditClientForm;
