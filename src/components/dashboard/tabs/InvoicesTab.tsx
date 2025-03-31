
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const InvoicesTab: React.FC = () => {
  return (
    <AnimatedContainer animation="fade" delay={400} className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Facturas</CardTitle>
          <CardDescription>
            Gestiona tus facturas de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Gestión de facturas</h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              Crea y gestiona facturas para tus clientes desde una ubicación centralizada.
              Revisa pagos pendientes y facturas vencidas.
            </p>
            <Button asChild>
              <Link to="/invoices">Ver todas las facturas</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" asChild>
            <Link to="/invoices/new">Crear nueva factura</Link>
          </Button>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
};

export default InvoicesTab;
