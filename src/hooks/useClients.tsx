
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

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
  updateClient: (id: string, data: Partial<Client>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
}

// Create context
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Mock data - replace with actual Supabase
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    website: 'https://acme.example.com',
    industry: 'Technology',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    reportsCount: 3
  },
  {
    id: '2',
    name: 'Globex Inc',
    website: 'https://globex.example.com',
    industry: 'E-commerce',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    reportsCount: 1
  },
  {
    id: '3',
    name: 'Soylent Corp',
    website: 'https://soylent.example.com',
    industry: 'Food & Beverage',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    reportsCount: 2
  }
];

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load clients on mount (mock)
  useEffect(() => {
    const loadClients = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check local storage first
        const storedClients = localStorage.getItem('seo-ninja-clients');
        if (storedClients) {
          setClients(JSON.parse(storedClients));
        } else {
          // Use mock data as fallback
          setClients(MOCK_CLIENTS);
          localStorage.setItem('seo-ninja-clients', JSON.stringify(MOCK_CLIENTS));
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const addClient = async (data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newClient: Client = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        reportsCount: 0
      };
      
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      localStorage.setItem('seo-ninja-clients', JSON.stringify(updatedClients));
      
      toast.success('Client added successfully');
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      throw error;
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const clientIndex = clients.findIndex(client => client.id === id);
      
      if (clientIndex === -1) {
        throw new Error('Client not found');
      }
      
      const updatedClient = {
        ...clients[clientIndex],
        ...data
      };
      
      const updatedClients = [...clients];
      updatedClients[clientIndex] = updatedClient;
      
      setClients(updatedClients);
      localStorage.setItem('seo-ninja-clients', JSON.stringify(updatedClients));
      
      toast.success('Client updated successfully');
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedClients = clients.filter(client => client.id !== id);
      setClients(updatedClients);
      localStorage.setItem('seo-ninja-clients', JSON.stringify(updatedClients));
      
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
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
