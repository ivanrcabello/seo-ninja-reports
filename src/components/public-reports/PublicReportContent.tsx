
import React from 'react';
import { PublicReport } from './useReportData';
import { PublicReportHeader } from './PublicReportHeader';
import { ReportTabs } from './ReportTabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface PublicReportContentProps {
  report: PublicReport;
  passwordRequired: boolean;
  onPasswordRequested: () => void;
  errorMessage: string;
  passwordInputOpen: boolean;
  onPasswordSubmit: (password: string) => void;
  onPasswordCancel: () => void;
}

export const PublicReportContent: React.FC<PublicReportContentProps> = ({
  report,
  passwordRequired,
  onPasswordRequested,
  errorMessage,
  passwordInputOpen,
  onPasswordSubmit,
  onPasswordCancel
}) => {
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      {/* Password protection dialog */}
      <Dialog open={passwordInputOpen} onOpenChange={(open) => {
        if (!open) onPasswordCancel();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informe protegido con contraseña</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Este informe está protegido. Para verlo, introduce la contraseña proporcionada.
              </p>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full"
                autoFocus
              />
              {errorMessage && (
                <div className="flex items-center text-xs text-destructive mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errorMessage}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onPasswordCancel}>
                Cancelar
              </Button>
              <Button type="submit">Acceder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report content */}
      <div className="bg-background/80 border border-primary/10 rounded-lg shadow-lg overflow-hidden">
        <PublicReportHeader report={report} />
        <ReportTabs report={report} />
      </div>
    </div>
  );
};
