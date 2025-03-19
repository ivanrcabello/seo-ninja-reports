
export interface Client {
  id: string;
  name: string;
  website: string;
  industry: string;
  createdAt: string;
  reportsCount: number;
}

export interface ClientsContextType {
  clients: Client[];
  isLoading: boolean;
  getClient: (id: string) => Client | undefined;
  addClient: (data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'reportsCount'>>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
}
