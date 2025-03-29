
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientInfoCard from './account/ClientInfoCard';
import AccountInfoCard from './account/AccountInfoCard';
import PasswordChangeCard from './account/PasswordChangeCard';
import { useClientAccount } from './account/useClientAccount';

interface ClientPortalAccountProps {
  clientId: string;
  accountId: string;
}

const ClientPortalAccount: React.FC<ClientPortalAccountProps> = ({ clientId, accountId }) => {
  const { client, account, loading, error } = useClientAccount(clientId, accountId);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tu Cuenta</h2>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tu Cuenta</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tu Cuenta</h2>
      <p className="text-muted-foreground">
        Gestiona la información de tu cuenta.
      </p>
      
      {/* Client Information Card */}
      <ClientInfoCard client={client} isLoading={loading} />
      
      {/* Account Information Card */}
      <AccountInfoCard account={account} isLoading={loading} />
      
      {/* Change Password Card */}
      <PasswordChangeCard accountId={accountId} />
    </div>
  );
};

export default ClientPortalAccount;
