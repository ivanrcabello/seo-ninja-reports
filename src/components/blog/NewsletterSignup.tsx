
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';

const NewsletterSignup: React.FC = () => {
  return (
    <BlurredCard className="max-w-3xl mx-auto">
      <div className="p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Suscríbete a nuestro newsletter</h2>
        <p className="text-muted-foreground mb-6">
          Recibe los últimos artículos, consejos y noticias sobre SEO local directamente en tu bandeja de entrada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Tu email" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button className="sm:w-auto">Suscribirse</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </BlurredCard>
  );
};

export default NewsletterSignup;
