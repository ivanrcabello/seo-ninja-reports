
import { useState, useEffect } from 'react';
import { 
  getClientPortalAccounts, 
  createClientPortalAccount,
  updateClientPortalAccount,
  deactivateClientPortalAccount,
  activateClientPortalAccount,
  deleteClientPortalAccount,
  getClientPortalActivity
} from '@/services/clientPortalService';

interface ClientPortalAccount {
  id: string;
  client_id: string;
  email: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientPortalActivity {
  id: string;
  client_portal_account_id: string;
  action: string;
  details: any;
  created_at: string;
}

export default function useClientPortal(clientId: string) {
  const [accounts, setAccounts] = useState<ClientPortalAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<ClientPortalActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      loadAccounts();
    }
  }, [clientId]);

  useEffect(() => {
    if (selectedAccountId) {
      loadActivity(selectedAccountId);
    } else {
      setActivity([]);
    }
  }, [selectedAccountId]);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getClientPortalAccounts(clientId);
      setAccounts(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivity = async (accountId: string) => {
    setIsLoadingActivity(true);
    try {
      const data = await getClientPortalActivity(accountId);
      setActivity(data);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const createAccount = async (email: string, password: string) => {
    const accountId = await createClientPortalAccount(clientId, email, password);
    await loadAccounts();
    return accountId;
  };

  const updateAccount = async (accountId: string, updates: Partial<ClientPortalAccount>) => {
    await updateClientPortalAccount(accountId, updates);
    await loadAccounts();
  };

  const activateAccount = async (accountId: string) => {
    await activateClientPortalAccount(accountId);
    await loadAccounts();
  };

  const deactivateAccount = async (accountId: string) => {
    await deactivateClientPortalAccount(accountId);
    await loadAccounts();
  };

  const deleteAccount = async (accountId: string) => {
    await deleteClientPortalAccount(accountId);
    await loadAccounts();
    if (selectedAccountId === accountId) {
      setSelectedAccountId(null);
    }
  };

  const selectAccount = (accountId: string | null) => {
    setSelectedAccountId(accountId);
  };

  return {
    accounts,
    isLoading,
    activity,
    isLoadingActivity,
    selectedAccountId,
    createAccount,
    updateAccount,
    activateAccount,
    deactivateAccount,
    deleteAccount,
    selectAccount,
    refreshAccounts: loadAccounts
  };
}
