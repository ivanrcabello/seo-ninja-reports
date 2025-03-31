
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, UserCheck, UserX, Trash2, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useClientPortal from '@/hooks/useClientPortal';

interface ClientPortalTabProps {
  clientId: string;
  clientName: string;
}

interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const ClientPortalTab: React.FC<ClientPortalTabProps> = ({ clientId, clientName }) => {
  const { 
    accounts, 
    isLoading, 
    activity, 
    isLoadingActivity,
    selectedAccountId,
    createAccount, 
    activateAccount, 
    deactivateAccount, 
    deleteAccount,
    selectAccount,
    refreshAccounts
  } = useClientPortal(clientId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('accounts');

  const form = useForm<AccountFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleCreateAccount = async (data: AccountFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { 
        type: 'validate', 
        message: 'Las contraseñas no coinciden' 
      });
      return;
    }

    try {
      await createAccount(data.email, data.password);
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleViewActivity = (accountId: string) => {
    selectAccount(accountId);
    setActiveTab('activity');
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'logout':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'session_validation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{clientName}: Portal de Cliente</h2>
          <p className="text-muted-foreground">
            Gestiona las cuentas de acceso al portal del cliente
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nueva Cuenta</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva cuenta de portal</DialogTitle>
              <DialogDescription>
                Crea una cuenta para que el cliente pueda acceder a su portal privado.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateAccount)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="cliente@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{ 
                    required: "Debes confirmar la contraseña"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Crear Cuenta</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="accounts">Cuentas</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : accounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
                <p className="text-muted-foreground text-center mb-4">
                  No hay cuentas de portal creadas para este cliente
                </p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear primera cuenta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {accounts.map(account => (
                <Card key={account.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">{account.email}</CardTitle>
                        <CardDescription>
                          Creada: {formatDateTime(account.created_at)}
                        </CardDescription>
                      </div>
                      <Badge variant={account.is_active ? "success" : "destructive"}>
                        {account.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      Último acceso: {formatDateTime(account.last_login)}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewActivity(account.id)}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Ver actividad
                    </Button>
                    <div className="flex gap-2">
                      {account.is_active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateAccount(account.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Desactivar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => activateAccount(account.id)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activar
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. La cuenta será eliminada permanentemente
                              y el cliente perderá acceso al portal.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAccount(account.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="activity">
          {!selectedAccountId ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground text-center mb-2">
                  Selecciona una cuenta para ver su actividad
                </p>
                <Button variant="outline" onClick={() => setActiveTab('accounts')}>
                  Ver cuentas
                </Button>
              </CardContent>
            </Card>
          ) : isLoadingActivity ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : activity.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground text-center">
                  No hay actividad registrada para esta cuenta
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Actividad de {accounts.find(a => a.id === selectedAccountId)?.email}
                </h3>
                <Button variant="outline" size="sm" onClick={() => selectAccount(null)}>
                  Volver a cuentas
                </Button>
              </div>
              <div className="border rounded-md divide-y">
                {activity.map(entry => (
                  <div key={entry.id} className="p-3 flex justify-between items-center">
                    <div>
                      <Badge className={getActionColor(entry.action)}>
                        {entry.action === 'login' ? 'Inicio de sesión' :
                         entry.action === 'logout' ? 'Cierre de sesión' :
                         entry.action === 'session_validation' ? 'Verificación de sesión' :
                         entry.action}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDateTime(entry.created_at)}
                      </p>
                    </div>
                    <div className="text-sm">
                      {entry.details && Object.keys(entry.details).map(key => (
                        <div key={key} className="text-muted-foreground">
                          {key}: {entry.details[key].toString()}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortalTab;
