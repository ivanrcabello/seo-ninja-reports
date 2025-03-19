
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const Caracteristicas = () => {
  const currentFeatures = [
    {
      title: "Informes SEO Automáticos",
      description: "Generación de informes SEO completos y personalizados para cualquier sitio web en cuestión de minutos."
    },
    {
      title: "Análisis Local",
      description: "Evaluación específica de factores de SEO local como Google Business Profile, citas locales y reseñas."
    },
    {
      title: "Recomendaciones Accionables",
      description: "Sugerencias prácticas y priorizadas que puedes implementar inmediatamente para mejorar el posicionamiento."
    },
    {
      title: "Análisis de Competencia",
      description: "Compara el rendimiento SEO con competidores directos en tu área local."
    },
    {
      title: "Seguimiento de Keywords",
      description: "Monitoriza el posicionamiento de palabras clave relevantes para el negocio."
    },
    {
      title: "Informes para Clientes",
      description: "Crea informes profesionales con tu marca para compartir con tus clientes."
    }
  ];

  const upcomingFeatures = [
    {
      title: "Integración con Google Analytics",
      description: "Conecta con Google Analytics para incluir datos de tráfico en tus informes."
    },
    {
      title: "Auditorías Técnicas Avanzadas",
      description: "Análisis técnico profundo con recomendaciones específicas para mejorar aspectos técnicos del SEO."
    },
    {
      title: "Seguimiento Automático",
      description: "Monitoreo automatizado de mejoras y cambios en el posicionamiento."
    },
    {
      title: "Plantillas Personalizables",
      description: "Crea y guarda tus propias plantillas de informes para diferentes tipos de clientes."
    },
    {
      title: "API para Integraciones",
      description: "Conecta con tus herramientas favoritas a través de nuestra API."
    }
  ];

  return (
    <Layout>
      <div className="pt-20">
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
                  Funcionalidades
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Características de <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    SoySeoLocal
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Descubre todas las herramientas y funcionalidades que ponemos a tu disposición para mejorar el SEO local de tu negocio.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button size="lg" className="w-full sm:w-auto">
                      Comenzar ahora
                    </Button>
                  </Link>
                  <Link to="/paquetes">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Ver precios
                    </Button>
                  </Link>
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Current Features */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Características actuales</h2>
              <p className="text-lg text-muted-foreground">
                Todas las herramientas que necesitas para optimizar tu presencia local en línea.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentFeatures.map((feature, index) => (
                <AnimatedContainer key={index} animation="slide-up" delay={index * 100}>
                  <BlurredCard className="h-full">
                    <div className="p-6 flex flex-col h-full">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center bg-primary/10 mb-4">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </section>
        
        {/* Upcoming Features */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl sm:text-4xl font-bold">Próximamente</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Estamos trabajando constantemente para mejorar nuestra plataforma. Estas son algunas de las características que llegarán pronto.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <AnimatedContainer key={index} animation="slide-up" delay={index * 100}>
                  <BlurredCard className="h-full border border-dashed">
                    <div className="p-6 flex flex-col h-full">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center bg-yellow-500/10 mb-4">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/paquetes">
                <Button size="lg">
                  Ver nuestros planes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Caracteristicas;
