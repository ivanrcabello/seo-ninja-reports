
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Award } from 'lucide-react';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';

const PackAscenso = () => {
  const features = [
    "Auditoría SEO completa",
    "Optimización GBP avanzada",
    "15 palabras clave locales",
    "Contenido SEO mensual (2 artículos)",
    "Informes semanales",
    "Soporte por email y teléfono"
  ];
  
  const includes = [
    {
      title: "Optimización GBP avanzada",
      description: "Gestión completa de su perfil de Google Business con publicaciones semanales, respuesta a reseñas y optimización continua."
    },
    {
      title: "Auditoría SEO completa",
      description: "Análisis exhaustivo de todos los factores SEO on-page y off-page que afectan a su posicionamiento."
    },
    {
      title: "Seguimiento de 15 palabras clave",
      description: "Monitorización y estrategia para 15 keywords relevantes para su negocio."
    },
    {
      title: "Creación de contenido SEO",
      description: "2 artículos mensuales optimizados para SEO y enfocados a la conversión."
    },
    {
      title: "Optimización técnica",
      description: "Mejoras de velocidad, estructura y otros factores técnicos que influyen en el posicionamiento."
    },
    {
      title: "Link Building local",
      description: "Estrategia básica de creación de enlaces desde sitios locales relevantes."
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack Ascenso"
          description="Para empresas que buscan crecer y consolidar su posicionamiento local"
          price="399€"
          period="mes"
          isPrimary={true}
        />
        
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3">
                <AnimatedContainer animation="slide-up">
                  <h2 className="text-3xl font-bold mb-6">¿Qué incluye Pack Ascenso?</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Nuestro paquete más popular, diseñado para empresas que quieren consolidar y mejorar significativamente su presencia online local. Este plan ofrece una estrategia SEO completa para generar resultados visibles y sostenibles.
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
                <AnimatedContainer animation="slide-up" delay={300} className="bg-white dark:bg-slate-900 rounded-lg border border-primary p-6 sticky top-24 relative">
                  <div className="absolute -top-4 left-4 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                    Recomendado
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Pack Ascenso</h3>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold">399€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                    <p className="text-muted-foreground text-sm">Contrato mínimo de 3 meses</p>
                  </div>
                  
                  <PackFeatureList features={features} />
                  
                  <div className="mt-8 space-y-4">
                    <Button asChild size="lg" className="w-full">
                      <Link to="/contacto?plan=ascenso">Contratar ahora</Link>
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
        
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/20">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">¿Para quién es ideal este paquete?</h2>
              <p className="text-lg text-muted-foreground">
                El Pack Ascenso está diseñado especialmente para estos tipos de negocios y situaciones
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedContainer animation="slide-up" delay={0} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Negocios establecidos</h3>
                <p className="text-muted-foreground">
                  Empresas con cierta trayectoria que buscan incrementar significativamente su visibilidad local.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Competencia moderada</h3>
                <p className="text-muted-foreground">
                  Negocios que operan en mercados con competencia media y necesitan destacar.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Objetivos de crecimiento</h3>
                <p className="text-muted-foreground">
                  Empresas con planes de expansión que necesitan aumentar su base de clientes local.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        <PackCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default PackAscenso;
