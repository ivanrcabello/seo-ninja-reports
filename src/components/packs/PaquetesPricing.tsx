
import React from 'react';
import { Button } from '@/components/ui/button';
import PackCard from './PackCard';

const PaquetesPricing = () => {
  const starterFeatures = [
    "Auditoría SEO básica",
    "Optimización Google Business Profile",
    "5 palabras clave locales",
    "Informe mensual",
    "Soporte por email"
  ];

  const ascensoFeatures = [
    "Auditoría SEO completa",
    "Optimización GBP avanzada",
    "15 palabras clave locales",
    "Contenido SEO mensual (2 artículos)",
    "Informes semanales",
    "Soporte por email y teléfono"
  ];

  const masterFeatures = [
    "Auditoría SEO premium",
    "Estrategia SEO local completa",
    "30+ palabras clave locales",
    "Contenido SEO semanal (4 artículos)",
    "Link building local",
    "Informes personalizados",
    "Soporte prioritario 24/7"
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackCard 
            title="Starter"
            description="Ideal para pequeños negocios locales"
            price="199€"
            features={starterFeatures}
            link="/paquetes/starter"
            delay={0}
          />
          
          <PackCard 
            title="Ascenso"
            description="Para empresas que buscan crecer localmente"
            price="399€"
            features={ascensoFeatures}
            link="/paquetes/ascenso"
            isPrimary={true}
            delay={200}
          />
          
          <PackCard 
            title="Master"
            description="Estrategia completa para dominar tu mercado local"
            price="799€"
            features={masterFeatures}
            link="/paquetes/master"
            delay={400}
          />
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            ¿Necesitas una solución personalizada? Ofrecemos planes a medida para adaptarnos a tus necesidades específicas.
          </p>
          <Button variant="outline" size="lg">Contactar para plan personalizado</Button>
        </div>
      </div>
    </section>
  );
};

export default PaquetesPricing;
