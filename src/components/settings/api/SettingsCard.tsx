
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  title, 
  description, 
  isSaving, 
  onSave, 
  children 
}) => {
  return (
    <BlurredCard animation="scale" className="w-full max-w-3xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          {children}
        </CardContent>
        
        <CardFooter className="flex justify-end pt-4">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </BlurredCard>
  );
};

export default SettingsCard;
