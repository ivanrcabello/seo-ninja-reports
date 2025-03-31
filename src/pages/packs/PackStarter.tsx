
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Star } from 'lucide-react';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';

const PackStarter = () => {
  const features = [
    "Auditoría SEO básica",
    "Optimización Google Business Profile",
    "5 palabras clave locales",
    "Informe mensual",
    "Soporte por email"
  ];
  
  const includes = [
    {
      title: "Optimización Google Business Profile",
      description: "Configuración profesional de su ficha de Google para atraer clientes locales."
    },
    {
      title: "Análisis SEO básico",
      description: "Evaluación de los principales factores que afectan a su posicionamiento."
    },
    {
      title: "Seguimiento de 5 palabras clave",
      description: "Monitorización de su posicionamiento para 5 keywords relevantes."
    },
    {
      title: "Informe mensual de rendimiento",
      description: "Reporte detallado con evolución y recomendaciones."
    },
    {
      title: "Optimización de título y meta descripciones",
      description: "Para las principales páginas de su sitio web."
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack Starter"
          description="Ideal para pequeñas empresas que quieren iniciar su presencia online"
          price="199€"
          period="/mes"
        />
        
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3">
                <AnimatedContainer animation="slide-up">
                  <h2 className="text-3xl font-bold mb-6">¿Qué incluye Pack Starter?</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Este paquete es perfecto para pequeños negocios locales que quieren empezar a mejorar su presencia en búsquedas locales con un presupuesto ajustado. Incluye los elementos básicos para comenzar a mejorar su visibilidad online.
                  </p>
                  
                  <div className="space-y-8">
                    {includes.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="p-1 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedContainer>
              </div>
              
              <div className="lg:col-span-2">
                <AnimatedContainer animation="slide-up" delay={300} className="bg-white dark:bg-slate-900 rounded-lg border border-border p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-primary" fill="currentColor" />
                    <h3 className="text-xl font-bold">Pack Starter</h3>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold">199€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                    <p className="text-muted-foreground text-sm">Contrato mínimo de 3 meses</p>
                  </div>
                  
                  <PackFeatureList features={features} />
                  
                  <div className="mt-8 space-y-4">
                    <Button asChild size="lg" className="w-full">
                      <Link to="/contacto?plan=starter">Contratar ahora</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link to="/contacto">Consultar dudas</Link>
                    </Button>
                  </div>
                </AnimatedContainer>
              </div>
            </div>
          </div>
        </section>
        
        <PackCTA 
          title="¿Preparado para empezar a mejorar tu SEO?"
          description="Nuestro Pack Starter es la manera perfecta de comenzar a mejorar tu visibilidad online sin un gran presupuesto."
          buttonText="Contratar Pack Starter"
          buttonLink="/contacto?plan=starter"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default PackStarter;
