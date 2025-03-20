
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Code, BarChart3, FileText, Share2, MapPin, Bot, Laptop, CheckCircle } from 'lucide-react';

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
                  Servicios y Software
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Soluciones <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    SEO Automatizadas
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ofrecemos dos modalidades: servicios gestionados de SEO local para empresas de servicios y acceso a nuestra plataforma de automatización SEO para agencias.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Business Models */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nuestras Soluciones</h2>
              <p className="text-lg text-muted-foreground">
                Elije la solución que mejor se adapte a las necesidades de tu negocio
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <AnimatedContainer animation="slide-up" delay={0}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Servicios SEO Gestionados</h3>
                    <p className="text-muted-foreground mb-6">
                      Ideal para empresas de servicios que quieren mejorar su posicionamiento local sin preocuparse por los aspectos técnicos.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Optimización SEO local completa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Gestión de Google Business Profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Informes mensuales de rendimiento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Optimización continua con IA</span>
                      </li>
                    </ul>
                    <div className="mt-auto">
                      <Link to="/paquetes">
                        <Button className="w-full">Ver paquetes de servicios</Button>
                      </Link>
                    </div>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <Laptop className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Plataforma SEO SaaS</h3>
                    <p className="text-muted-foreground mb-6">
                      Ideal para agencias y consultores SEO que quieren ofrecer informes profesionales y automatización a sus clientes.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Acceso completo a la plataforma de IA</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Informes con marca blanca</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Dashboard para múltiples clientes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Automatización de optimizaciones SEO</span>
                      </li>
                    </ul>
                    <div className="mt-auto">
                      <Link to="/precios">
                        <Button className="w-full">Ver planes de suscripción</Button>
                      </Link>
                    </div>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/20">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Servicios de Automatización SEO</h2>
              <p className="text-lg text-muted-foreground">
                Nuestra tecnología de IA automatiza y optimiza todos estos aspectos clave del SEO para empresas de servicios
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<MapPin className="h-10 w-10 text-primary" />}
                title="SEO Local Automatizado" 
                description="Optimización automática de tu presencia en búsquedas locales, Google Maps y directorios locales relevantes para tu sector de servicios."
              />
              
              <ServiceCard 
                icon={<Bot className="h-10 w-10 text-primary" />}
                title="Contenido SEO con IA" 
                description="Generación y optimización de contenido específico para tu sector de servicios, orientado a keywords locales de alto valor."
              />
              
              <ServiceCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Informes Automáticos" 
                description="Generación automática de informes profesionales y personalizables para seguir el progreso de tus optimizaciones SEO."
              />
              
              <ServiceCard 
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Análisis Competitivo" 
                description="Monitoreo continuo de competidores locales para identificar oportunidades y implementar mejoras automáticas en tu estrategia."
              />
              
              <ServiceCard 
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Auditoría SEO Continua" 
                description="Identificación y corrección automática de problemas técnicos, de contenido y de enlaces que afectan tu posicionamiento."
              />
              
              <ServiceCard 
                icon={<Share2 className="h-10 w-10 text-primary" />}
                title="Optimización de Autoridad" 
                description="Estrategias automatizadas para mejorar la autoridad de tu dominio con enlaces de calidad específicos para tu sector."
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
                    <h2 className="text-3xl font-bold mb-4">¿Listo para automatizar tu SEO local?</h2>
                    <p className="text-muted-foreground mb-6">
                      Contáctanos hoy mismo para una demostración personalizada y descubre cómo nuestra tecnología puede transformar tu presencia online.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/contacto">
                        <Button size="lg" className="group">
                          Solicitar demostración
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
