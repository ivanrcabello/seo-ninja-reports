import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Crown } from 'lucide-react';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';

const PackMaster = () => {
  const features = [
    "Auditoría SEO premium",
    "Estrategia SEO local completa",
    "30+ palabras clave locales",
    "Contenido SEO semanal (4 artículos)",
    "Link building local",
    "Informes personalizados",
    "Soporte prioritario 24/7"
  ];
  
  const includes = [
    {
      title: "Estrategia SEO local completa",
      description: "Plan integral de SEO local adaptado específicamente a sus objetivos de negocio y mercado."
    },
    {
      title: "Auditoría SEO premium",
      description: "Análisis exhaustivo de más de 200 factores que afectan al posicionamiento, con plan de acción detallado."
    },
    {
      title: "Seguimiento de 30+ palabras clave",
      description: "Monitorización y optimización continua para más de 30 palabras clave estratégicas."
    },
    {
      title: "Contenido SEO semanal",
      description: "4 artículos mensuales optimizados para SEO y conversión, enfocados a diferentes etapas del embudo de ventas."
    },
    {
      title: "Link building avanzado",
      description: "Estrategia completa de creación de enlaces de calidad desde sitios relevantes y de autoridad."
    },
    {
      title: "Optimización técnica avanzada",
      description: "Implementación de mejoras técnicas avanzadas para obtener ventaja competitiva."
    },
    {
      title: "Gestión de reputación online",
      description: "Sistema completo para gestionar su reputación, aumentar reseñas positivas y gestionar feedback negativo."
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack Master"
          description="La solución definitiva para dominar las búsquedas locales en su sector"
          price="799€"
          period="/mes"
        />
        
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3">
                <AnimatedContainer animation="slide-up">
                  <h2 className="text-3xl font-bold mb-6">¿Qué incluye Pack Master?</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Nuestra solución más completa, diseñada para empresas que buscan dominar su mercado local. Este paquete premium ofrece una estrategia integral y agresiva para superar a la competencia y maximizar su presencia en búsquedas locales.
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
                    <Crown className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Pack Master</h3>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold">799€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                    <p className="text-muted-foreground text-sm">Contrato mínimo de 3 meses</p>
                  </div>
                  
                  <PackFeatureList features={features} />
                  
                  <div className="mt-8 space-y-4">
                    <Button asChild size="lg" className="w-full">
                      <Link to="/contacto?plan=master">Contratar ahora</Link>
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
                El Pack Master está diseñado especialmente para estos tipos de negocios y situaciones
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedContainer animation="slide-up" delay={0} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Mercados competitivos</h3>
                <p className="text-muted-foreground">
                  Empresas que operan en sectores con alta competencia SEO y necesitan una estrategia agresiva.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Empresas consolidadas</h3>
                <p className="text-muted-foreground">
                  Negocios establecidos que buscan maximizar su dominio del mercado local.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Objetivos ambiciosos</h3>
                <p className="text-muted-foreground">
                  Compañías con metas de crecimiento agresivas que buscan resultados rápidos y contundentes.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        <PackCTA 
          title="Domina tu mercado con la estrategia SEO más completa"
          description="Nuestro Pack Master está diseñado para empresas que quieren liderar su sector y maximizar su presencia online."
          buttonText="Contratar Pack Master"
          buttonLink="/contacto?plan=master"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default PackMaster;
