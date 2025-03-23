
import { ClientContract } from '@/types/client.types';

export interface PublicContract extends Omit<ClientContract, 'client_id'> {
  client_name?: string;
  client_website?: string;
}
