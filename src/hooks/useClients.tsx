
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Client } from '@/types/client.types';
import { 
  fetchClients, 
  addClientToDb, 
  updateClientInDb, 
  deleteClientFromDb 
} from '@/services/clientService';
import { Json } from '@/integrations/supabase/types';

interface ClientsContextType {
  clients: Client[];
  isLoading: boolean;
  getClient: (id: string) => Client | undefined;
  addClient: (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
}

function isWpCredentials(value: Json | null): value is { username: string; password: string; url?: string } {
  return value !== null && 
         typeof value === 'object' && 
         'username' in value && 
         'password' in value;
}

function isHostingCredentials(value: Json | null): value is { provider: string; username: string; password: string; url?: string } {
  return value !== null && 
         typeof value === 'object' && 
         'provider' in value && 
         'username' in value && 
         'password' in value;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadClients = async () => {
      if (!user) {
        setClients([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { clients: clientsData, reportCountMap } = await fetchClients(user.id);

        const formattedClients = clientsData.map((client: any) => {
          return {
            id: client.id,
            name: client.name,
            website: client.website,
            industry: client.industry || '',
            created_at: client.created_at,
            updated_at: client.updated_at,
            user_id: client.user_id,
            phone_number: client.phone_number,
            active: client.active,
            wp_credentials: isWpCredentials(client.wp_credentials) ? client.wp_credentials : null,
            hosting_credentials: isHostingCredentials(client.hosting_credentials) ? client.hosting_credentials : null
          };
        });
        
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

  const addClient = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const newClient = await addClientToDb(data, user?.id);
      
      const formattedClient: Client = {
        id: newClient.id,
        name: newClient.name,
        website: newClient.website,
        industry: newClient.industry || '',
        created_at: newClient.created_at,
        updated_at: newClient.updated_at,
        user_id: newClient.user_id,
        phone_number: newClient.phone_number,
        active: newClient.active,
        wp_credentials: isWpCredentials(newClient.wp_credentials) ? newClient.wp_credentials : null,
        hosting_credentials: isHostingCredentials(newClient.hosting_credentials) ? newClient.hosting_credentials : null
      };
      
      setClients(prevClients => [formattedClient, ...prevClients]);
      toast.success('Cliente añadido exitosamente');
      
      return formattedClient;
    } catch (error: any) {
      throw error;
    }
  };

  const updateClient = async (id: string, data: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => {
    try {
      const updatedClient = await updateClientInDb(id, data);
      
      const clientToUpdate = clients.find(client => client.id === id);
      if (!clientToUpdate) {
        throw new Error('Cliente no encontrado');
      }
      
      const formattedClient: Client = {
        id: updatedClient.id,
        name: updatedClient.name,
        website: updatedClient.website,
        industry: updatedClient.industry || '',
        created_at: updatedClient.created_at,
        updated_at: updatedClient.updated_at,
        user_id: updatedClient.user_id,
        phone_number: updatedClient.phone_number,
        active: updatedClient.active,
        wp_credentials: isWpCredentials(updatedClient.wp_credentials) ? updatedClient.wp_credentials : null,
        hosting_credentials: isHostingCredentials(updatedClient.hosting_credentials) ? updatedClient.hosting_credentials : null
      };
      
      setClients(prevClients => 
        prevClients.map(client => client.id === id ? formattedClient : client)
      );
      
      toast.success('Cliente actualizado exitosamente');
      return formattedClient;
    } catch (error: any) {
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      console.log('Starting client deletion in useClients for ID:', id);
      
      // First delete the client from database
      await deleteClientFromDb(id);
      
      // Then remove from state
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      console.log('Client removed from state successfully');
    } catch (error: any) {
      console.error('Error in deleteClient hook:', error);
      throw error; // Re-throw to be handled by the calling component
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
