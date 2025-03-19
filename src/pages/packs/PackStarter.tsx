
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Search, BarChart } from 'lucide-react';

const PackStarter = () => {
  const features = [
    "Auditoría SEO inicial",
    "Estudio de palabras clave primarias (5 kw)",
    "Optimización de perfiles Google Business Profile",
    "Optimización SEO On-Page básica",
    "Informes mensuales de posicionamiento",
    "Subida del 30% en el posicionamiento promedio",
    "Aumento del tráfico orgánico local",
    "1 publicación mensual para Google Business Profile",
    "1 sesión de consultoría mensual",
    "Soporte por email"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack SEO Starter" 
          subtitle="Solución básica para negocios locales que quieren empezar a posicionarse"
          price="199€"
        />
        
        <section className="py-12">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                <AnimatedContainer animation="slide-up" delay={800}>
                  <BlurredCard>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-4">¿Para quién es ideal?</h2>
                      <p className="mb-4">
                        El Pack SEO Starter es perfecto para pequeños negocios locales que están dando sus primeros pasos en el posicionamiento SEO y buscan una solución económica pero efectiva para aumentar su visibilidad en búsquedas locales.
                      </p>
                      <p>
                        Este paquete está especialmente diseñado para:
                      </p>
                      <ul className="mt-4 space-y-3">
                        <li className="flex items-start">
                          <Target className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios que operan en zonas de baja competencia</span>
                        </li>
                        <li className="flex items-start">
                          <Search className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Empresas que quieren mejorar su presencia en Google Maps y búsquedas locales</span>
                        </li>
                        <li className="flex items-start">
                          <BarChart className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Comercios que necesitan un impulso inicial en su estrategia digital</span>
                        </li>
                      </ul>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
                
                <div className="mt-8">
                  <AnimatedContainer animation="slide-up" delay={1000}>
                    <BlurredCard>
                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">¿Qué resultados puedes esperar?</h2>
                        <p className="mb-4">
                          Con nuestro Pack SEO Starter, podrás ver resultados significativos en un periodo de 3-4 meses:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Mejora en el posicionamiento de tus palabras clave principales</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Aumento del tráfico orgánico local</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Mayor visibilidad en Google Maps</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Optimización de tu ficha de Google Business Profile</span>
                          </li>
                        </ul>
                      </div>
                    </BlurredCard>
                  </AnimatedContainer>
                </div>
              </div>
              
              <div>
                <PackFeatureList features={features} delay={800} />
                
                <div className="mt-8">
                  <PackCTA 
                    title="Empieza hoy mismo" 
                    description="Da el primer paso para mejorar la visibilidad de tu negocio en búsquedas locales con nuestro Pack SEO Starter."
                    delay={1000}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PackStarter;
