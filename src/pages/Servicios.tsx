
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Code, BarChart3, FileText, Share2, MapPin } from 'lucide-react';

const Servicios = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background opacity-50 -z-10" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedContainer animation="fade" className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  Servicios Profesionales
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Servicios de <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    SEO Local
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ofrecemos servicios completos de SEO local para ayudar a tu negocio a destacar en búsquedas locales y aumentar tu visibilidad en tu área.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nuestros Servicios</h2>
              <p className="text-lg text-muted-foreground">
                Soluciones personalizadas para impulsar tu presencia local en los motores de búsqueda.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ServiceCard 
                icon={<MapPin className="h-10 w-10 text-primary" />}
                title="SEO Local" 
                description="Optimizamos tu presencia en búsquedas locales para que los clientes de tu zona te encuentren fácilmente. Incluye optimización de Google Business Profile, citas locales y estrategias específicas para tu área geográfica."
              />
              
              <ServiceCard 
                icon={<Code className="h-10 w-10 text-primary" />}
                title="SEO Técnico" 
                description="Mejoramos los aspectos técnicos de tu sitio web para ofrecer una mejor experiencia a los usuarios y facilitar la indexación por parte de los motores de búsqueda."
              />
              
              <ServiceCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Contenido SEO" 
                description="Creamos contenido optimizado para SEO que conecta con tu audiencia local y responde a las búsquedas relevantes para tu negocio."
              />
              
              <ServiceCard 
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Análisis y Reporting" 
                description="Proporcionamos informes detallados y análisis periódicos para que puedas ver el progreso de tu estrategia SEO local."
              />
              
              <ServiceCard 
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Auditoría SEO" 
                description="Realizamos un análisis completo de tu sitio web para identificar problemas y oportunidades de mejora en tu estrategia SEO."
              />
              
              <ServiceCard 
                icon={<Share2 className="h-10 w-10 text-primary" />}
                title="Link Building Local" 
                description="Desarrollamos estrategias de construcción de enlaces relevantes para tu negocio local, mejorando tu autoridad y relevancia."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlurredCard className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8 p-4 sm:p-6 md:p-8">
                <div className="flex-1">
                  <AnimatedContainer animation="slide-up">
                    <h2 className="text-3xl font-bold mb-4">¿Listo para mejorar tu SEO local?</h2>
                    <p className="text-muted-foreground mb-6">
                      Contacta con nosotros hoy mismo para una consulta gratuita y descubre cómo podemos ayudarte a aumentar tu visibilidad local.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/auth">
                        <Button size="lg" className="group">
                          Contactar
                        </Button>
                      </Link>
                      <Link to="/paquetes">
                        <Button variant="outline" size="lg">
                          Ver Paquetes
                        </Button>
                      </Link>
                    </div>
                  </AnimatedContainer>
                </div>
              </div>
            </BlurredCard>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <AnimatedContainer animation="slide-up">
      <BlurredCard className="h-full">
        <div className="flex flex-col h-full p-6">
          <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
            {icon}
          </div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default Servicios;
