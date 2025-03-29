
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

interface ClientAccount {
  id: string;
  email: string;
  client_id: string;
  last_login?: string;
}

interface AccountInfoCardProps {
  account: ClientAccount | null;
  isLoading: boolean;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, isLoading }) => {
  React.useEffect(() => {
    if (account) {
      clientPortalLogger.info('AccountInfoCard loaded with account data', { accountId: account.id }, 'AccountInfoCard');
    }
  }, [account]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" /> Información de la Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" /> Información de la Cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {account && (
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {account.email}
            </div>
            {account.last_login && (
              <p className="text-sm text-muted-foreground">
                Último acceso: {new Date(account.last_login).toLocaleDateString()} {new Date(account.last_login).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
