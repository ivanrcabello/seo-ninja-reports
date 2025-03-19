
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
        const formattedClients = clientsData.map((client: any) => ({
          id: client.id,
          name: client.name,
          website: client.website,
          industry: client.industry || '',
          createdAt: client.created_at,
          reportsCount: reportCountMap[client.id] || 0,
          phoneNumber: client.phone_number,
          wpCredentials: client.wp_credentials ? client.wp_credentials : null,
          hostingCredentials: client.hosting_credentials ? client.hosting_credentials : null
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
      const newClient = await addClientToDb(data, user?.id);
      
      const formattedClient: Client = {
        id: newClient.id,
        name: newClient.name,
        website: newClient.website,
        industry: newClient.industry || '',
        createdAt: newClient.created_at,
        reportsCount: 0,
        phoneNumber: newClient.phone_number,
        wpCredentials: newClient.wp_credentials || null,
        hostingCredentials: newClient.hosting_credentials || null
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
      
      const formattedClient: Client = {
        id: updatedClient.id,
        name: updatedClient.name,
        website: updatedClient.website,
        industry: updatedClient.industry || '',
        createdAt: updatedClient.created_at,
        reportsCount: clientToUpdate.reportsCount,
        phoneNumber: updatedClient.phone_number,
        wpCredentials: updatedClient.wp_credentials || null,
        hostingCredentials: updatedClient.hosting_credentials || null
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
