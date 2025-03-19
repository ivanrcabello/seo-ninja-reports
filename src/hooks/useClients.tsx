
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useAuth from './useAuth';

export interface Client {
  id: string;
  name: string;
  website: string;
  industry: string;
  createdAt: string;
  reportsCount: number;
}

interface ClientsContextType {
  clients: Client[];
  isLoading: boolean;
  getClient: (id: string) => Client | undefined;
  addClient: (data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'reportsCount'>>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
}

// Create context
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load clients when user changes
  useEffect(() => {
    const loadClients = async () => {
      if (!user) {
        setClients([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get clients from Supabase
        const { data: clientsData, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }

        // Get reports count for each client using count aggregate
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('client_id, count')
          .count()
          .group('client_id');

        if (reportsError) {
          console.error('Error cargando conteo de informes:', reportsError);
        }

        // Create a mapping of client_id to report count
        const reportCountMap: Record<string, number> = {};
        if (reportsData) {
          reportsData.forEach((item: any) => {
            reportCountMap[item.client_id] = Number(item.count);
          });
        }

        // Format clients data
        const formattedClients = clientsData.map((client: any) => ({
          id: client.id,
          name: client.name,
          website: client.website,
          industry: client.industry || '',
          createdAt: client.created_at,
          reportsCount: reportCountMap[client.id] || 0
        }));
        
        setClients(formattedClients);
      } catch (error: any) {
        console.error('Error loading clients:', error);
        toast.error(error.message || 'Error al cargar clientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [user]);

  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const addClient = async (data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>) => {
    try {
      const { name, website, industry } = data;
      
      // Añadir el user_id al insertar cliente
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert({
          name,
          website,
          industry,
          user_id: user?.id // Añadir el ID del usuario actual
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const formattedClient: Client = {
        id: newClient.id,
        name: newClient.name,
        website: newClient.website,
        industry: newClient.industry || '',
        createdAt: newClient.created_at,
        reportsCount: 0
      };
      
      setClients(prevClients => [formattedClient, ...prevClients]);
      toast.success('Cliente añadido exitosamente');
      
      return formattedClient;
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error(error.message || 'Error al añadir cliente');
      throw error;
    }
  };

  const updateClient = async (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'reportsCount'>>) => {
    try {
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const clientToUpdate = clients.find(client => client.id === id);
      if (!clientToUpdate) {
        throw new Error('Cliente no encontrado');
      }
      
      const formattedClient: Client = {
        id: updatedClient.id,
        name: updatedClient.name,
        website: updatedClient.website,
        industry: updatedClient.industry || '',
        createdAt: updatedClient.created_at,
        reportsCount: clientToUpdate.reportsCount
      };
      
      setClients(prevClients => 
        prevClients.map(client => client.id === id ? formattedClient : client)
      );
      
      toast.success('Cliente actualizado exitosamente');
      return formattedClient;
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(error.message || 'Error al actualizar cliente');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      toast.success('Cliente eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(error.message || 'Error al eliminar cliente');
      throw error;
    }
  };

  const value = {
    clients,
    isLoading,
    getClient,
    addClient,
    updateClient,
    deleteClient
  };

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
};

const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

export default useClients;
