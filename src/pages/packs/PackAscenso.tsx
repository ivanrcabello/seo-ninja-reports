
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Search, BarChart, FileText, Layers } from 'lucide-react';

const PackAscenso = () => {
  const features = [
    "Auditoría SEO completa y profunda",
    "Estudio de palabras clave avanzado (15 kw)",
    "Optimización avanzada de Google Business Profile",
    "Optimización SEO On-Page completa",
    "Creación y optimización de contenidos (2 artículos mensuales)",
    "Optimización de metadatos y estructura web",
    "Link building local básico",
    "Gestión de directorios locales",
    "Informes semanales de posicionamiento",
    "Incremento del 50% en el posicionamiento promedio",
    "Aumento significativo del tráfico orgánico",
    "4 publicaciones mensuales para Google Business Profile",
    "2 sesiones de consultoría mensuales",
    "Soporte por email y teléfono"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack SEO Ascenso" 
          subtitle="Solución completa para negocios que buscan un posicionamiento sólido a nivel local"
          price="399€"
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
                        El Pack SEO Ascenso está diseñado para negocios que ya tienen cierta presencia online y buscan consolidar su posicionamiento en búsquedas locales, superando a la competencia directa.
                      </p>
                      <p>
                        Este paquete es perfecto para:
                      </p>
                      <ul className="mt-4 space-y-3">
                        <li className="flex items-start">
                          <Target className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios en zonas con competencia moderada</span>
                        </li>
                        <li className="flex items-start">
                          <Search className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Empresas que quieren ampliar su alcance geográfico</span>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios que necesitan mejorar su estrategia de contenidos</span>
                        </li>
                        <li className="flex items-start">
                          <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Empresas con múltiples servicios o productos que necesitan posicionar</span>
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
                          Con nuestro Pack SEO Ascenso, obtendrás resultados notables en un periodo de 2-3 meses:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Posicionamiento en el top 10 para palabras clave principales</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Incremento sustancial de tráfico orgánico cualificado</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Mejor posicionamiento que tus competidores directos</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Aumento de conversiones y consultas a través de Google Maps</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Mejora de la presencia digital general con contenido optimizado</span>
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
                    title="Potencia tu negocio local" 
                    description="Lleva tu estrategia SEO local al siguiente nivel y destaca entre tu competencia con nuestro Pack SEO Ascenso."
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

export default PackAscenso;
