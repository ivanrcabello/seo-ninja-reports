
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import useAuth from './useAuth';
import { Client, ClientsContextType } from '@/types/client.types';
import { 
  fetchClients, 
  addClientToDb, 
  updateClientInDb, 
  deleteClientFromDb 
} from '@/services/clientService';
import { Json } from '@/integrations/supabase/types';

// Type guard to check if a value is a valid credential object
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
        
        const { clients: clientsData, reportCountMap } = await fetchClients(user.id);

        // Format clients data
        const formattedClients = clientsData.map((client: any) => {
          const wpCreds = client.wp_credentials;
          const hostingCreds = client.hosting_credentials;
          
          return {
            id: client.id,
            name: client.name,
            website: client.website,
            industry: client.industry || '',
            createdAt: client.created_at,
            reportsCount: reportCountMap[client.id] || 0,
            phoneNumber: client.phone_number,
            wpCredentials: isWpCredentials(wpCreds) ? wpCreds : null,
            hostingCredentials: isHostingCredentials(hostingCreds) ? hostingCreds : null
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

  const addClient = async (data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>) => {
    try {
      const newClient = await addClientToDb(data, user?.id);
      
      // Apply the same type safety for the new client
      const wpCreds = newClient.wp_credentials;
      const hostingCreds = newClient.hosting_credentials;
      
      const formattedClient: Client = {
        id: newClient.id,
        name: newClient.name,
        website: newClient.website,
        industry: newClient.industry || '',
        createdAt: newClient.created_at,
        reportsCount: 0,
        phoneNumber: newClient.phone_number,
        wpCredentials: isWpCredentials(wpCreds) ? wpCreds : null,
        hostingCredentials: isHostingCredentials(hostingCreds) ? hostingCreds : null
      };
      
      setClients(prevClients => [formattedClient, ...prevClients]);
      toast.success('Cliente añadido exitosamente');
      
      return formattedClient;
    } catch (error: any) {
      throw error;
    }
  };

  const updateClient = async (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'reportsCount'>>) => {
    try {
      const updatedClient = await updateClientInDb(id, data);
      
      const clientToUpdate = clients.find(client => client.id === id);
      if (!clientToUpdate) {
        throw new Error('Cliente no encontrado');
      }
      
      // Apply the same type safety for the updated client
      const wpCreds = updatedClient.wp_credentials;
      const hostingCreds = updatedClient.hosting_credentials;
      
      const formattedClient: Client = {
        id: updatedClient.id,
        name: updatedClient.name,
        website: updatedClient.website,
        industry: updatedClient.industry || '',
        createdAt: updatedClient.created_at,
        reportsCount: clientToUpdate.reportsCount,
        phoneNumber: updatedClient.phone_number,
        wpCredentials: isWpCredentials(wpCreds) ? wpCreds : null,
        hostingCredentials: isHostingCredentials(hostingCreds) ? hostingCreds : null
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
      await deleteClientFromDb(id);
      
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      toast.success('Cliente eliminado exitosamente');
    } catch (error: any) {
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

// Fix: Use 'export type' for re-exporting types when 'isolatedModules' is enabled
export type { Client };
export default useClients;
