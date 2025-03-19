
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackDetailHeader from '@/components/packs/PackDetailHeader';
import PackFeatureList from '@/components/packs/PackFeatureList';
import PackCTA from '@/components/packs/PackCTA';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Search, BarChart, FileText, Layers, Globe, Shield } from 'lucide-react';

const PackMaster = () => {
  const features = [
    "Auditoría SEO premium y exhaustiva",
    "Estudio de palabras clave avanzado (30+ kw)",
    "Optimización élite de Google Business Profile",
    "Optimización SEO On-Page completa y avanzada",
    "Creación y optimización de contenidos (4 artículos mensuales)",
    "Estrategia de link building local avanzada",
    "Optimización técnica SEO completa",
    "Análisis de competidores detallado",
    "Gestión completa de directorios y citas locales",
    "Optimización de la experiencia de usuario (UX)",
    "Optimización SEO para voz",
    "Informes personalizados semanales y mensuales",
    "Incremento del 80%+ en el posicionamiento promedio",
    "Análisis de conversiones y optimización",
    "8 publicaciones mensuales para Google Business Profile",
    "4 sesiones de consultoría mensuales",
    "Soporte prioritario 24/7",
    "Estrategia de marca local integrada"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PackDetailHeader 
          title="Pack SEO Master" 
          subtitle="Solución premium para dominar completamente el mercado local"
          price="799€"
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
                        El Pack SEO Master es nuestra solución más completa, diseñada para negocios que quieren dominar absolutamente su mercado local y posicionarse como líderes indiscutibles en su sector.
                      </p>
                      <p>
                        Este paquete es perfecto para:
                      </p>
                      <ul className="mt-4 space-y-3">
                        <li className="flex items-start">
                          <Target className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios en mercados altamente competitivos</span>
                        </li>
                        <li className="flex items-start">
                          <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Empresas que operan en múltiples ubicaciones</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios que quieren blindar su posición contra competidores</span>
                        </li>
                        <li className="flex items-start">
                          <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Empresas con amplio catálogo de servicios o productos</span>
                        </li>
                        <li className="flex items-start">
                          <BarChart className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span>Negocios que buscan una conversión máxima de su tráfico web</span>
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
                          Con nuestro Pack SEO Master, obtendrás resultados excepcionales en tiempo récord:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Posicionamiento en el top 3 para palabras clave principales</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Dominio completo en Google Maps (Pack Local)</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Aumento masivo del tráfico orgánico cualificado</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Incremento significativo de conversiones y ventas</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Posicionamiento en múltiples ubicaciones geográficas</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                            <span>Estrategia de marca local completamente desarrollada</span>
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
                    title="Domina tu mercado local" 
                    description="Obtén una presencia digital imbatible y conviértete en el líder indiscutible de tu sector con nuestro Pack SEO Master."
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

export default PackMaster;
