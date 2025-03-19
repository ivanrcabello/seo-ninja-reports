
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, UserCircle2, BarChart, Search, Settings } from 'lucide-react';

const Guias = () => {
  const guides = [
    {
      title: "Primeros pasos con SoySeoLocal",
      description: "Guía completa para empezar a utilizar la plataforma, crear tu cuenta y configurar tu perfil.",
      icon: <UserCircle2 className="h-6 w-6" />,
      category: "Comenzando",
      link: "#"
    },
    {
      title: "Cómo crear y gestionar clientes",
      description: "Aprende a añadir nuevos clientes, gestionar sus datos y organizar tu cartera de clientes de forma eficiente.",
      icon: <UserCircle2 className="h-6 w-6" />,
      category: "Gestión de clientes",
      link: "#"
    },
    {
      title: "Generación de informes SEO locales",
      description: "Guía paso a paso para crear informes SEO completos y personalizados para cualquier negocio local.",
      icon: <FileText className="h-6 w-6" />,
      category: "Informes",
      link: "#"
    },
    {
      title: "Análisis de palabras clave locales",
      description: "Cómo identificar y seguir las palabras clave más relevantes para negocios locales.",
      icon: <Search className="h-6 w-6" />,
      category: "Keywords",
      link: "#"
    },
    {
      title: "Interpretación de datos y métricas",
      description: "Aprende a entender y explicar a tus clientes los resultados y métricas de los informes SEO.",
      icon: <BarChart className="h-6 w-6" />,
      category: "Análisis",
      link: "#"
    },
    {
      title: "Compartir informes con clientes",
      description: "Diferentes métodos para compartir los informes con tus clientes de forma profesional.",
      icon: <FileText className="h-6 w-6" />,
      category: "Informes",
      link: "#"
    },
    {
      title: "Configuración de la cuenta",
      description: "Cómo personalizar tu cuenta, gestionar API keys y configurar preferencias.",
      icon: <Settings className="h-6 w-6" />,
      category: "Configuración",
      link: "#"
    },
    {
      title: "Optimización de Google Business Profile",
      description: "Guía completa sobre cómo mejorar la presencia en Google Business Profile según nuestros informes.",
      icon: <Search className="h-6 w-6" />,
      category: "SEO Local",
      link: "#"
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
                  Recursos de Ayuda
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Guías y <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    Tutoriales
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Todo lo que necesitas saber para sacar el máximo provecho de SoySeoLocal y mejorar el posicionamiento de tus clientes.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Guides */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide, index) => (
                <AnimatedContainer key={index} animation="slide-up" delay={index * 100}>
                  <BlurredCard className="h-full overflow-hidden">
                    <div className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {guide.category}
                        </span>
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {guide.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                          <p className="text-muted-foreground">{guide.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto pt-4">
                        <Link to={guide.link}>
                          <Button variant="ghost" className="group p-0 h-auto font-medium flex items-center text-primary hover:text-primary/80">
                            Ver guía completa
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlurredCard className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Si necesitas ayuda con algo específico o tienes alguna duda que no está cubierta en nuestras guías, no dudes en contactarnos.
                </p>
                <Link to="/contacto">
                  <Button size="lg">
                    Contactar con soporte
                  </Button>
                </Link>
              </div>
            </BlurredCard>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Guias;
