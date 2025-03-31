
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { FileText, BookOpen, Globe, Star, Lightbulb, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurredCard from '@/components/ui/BlurredCard';

const ResourceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  linkText, 
  linkUrl 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string, 
  linkText: string, 
  linkUrl: string 
}) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <div className="rounded-full p-2 w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
    </CardContent>
    <CardFooter>
      <Button asChild variant="outline" className="w-full">
        <Link to={linkUrl}>{linkText}</Link>
      </Button>
    </CardFooter>
  </Card>
);

const Recursos = () => {
  const resources = [
    {
      icon: FileText,
      title: "Blog de SEO",
      description: "Artículos actualizados sobre estrategias SEO para negocios locales.",
      linkText: "Visitar blog",
      linkUrl: "/blog"
    },
    {
      icon: BookOpen,
      title: "Guías SEO",
      description: "Tutoriales y guías paso a paso para mejorar tu posicionamiento.",
      linkText: "Ver guías",
      linkUrl: "/guias"
    },
    {
      icon: Star,
      title: "Herramientas SEO",
      description: "Recursos gratuitos y herramientas para analizar tu web.",
      linkText: "Acceder a herramientas",
      linkUrl: "/herramientas"
    },
    {
      icon: Globe,
      title: "Documentación",
      description: "Documentación técnica de nuestra plataforma SaaS.",
      linkText: "Leer documentación",
      linkUrl: "/documentacion"
    },
    {
      icon: Lightbulb,
      title: "Webinars",
      description: "Formación online sobre SEO local y marketing digital.",
      linkText: "Ver webinars",
      linkUrl: "/webinars"
    },
    {
      icon: Compass,
      title: "Casos de éxito",
      description: "Ejemplos reales de negocios que han mejorado con nuestro SEO.",
      linkText: "Explorar casos",
      linkUrl: "/casos"
    }
  ];

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background -z-10" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <AnimatedContainer animation="fade" className="container px-4 sm:px-6 mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Centro de Recursos SEO</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Accede a todos nuestros recursos, herramientas y guías para impulsar tu estrategia SEO.
            </p>
          </AnimatedContainer>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <AnimatedContainer key={index} animation="fade" delay={index * 100}>
                  <ResourceCard 
                    icon={resource.icon} 
                    title={resource.title} 
                    description={resource.description}
                    linkText={resource.linkText}
                    linkUrl={resource.linkUrl}
                  />
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up">
              <BlurredCard>
                <div className="p-6 sm:p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda con tu estrategia SEO?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Contáctanos ahora y te ayudaremos a mejorar la visibilidad de tu negocio en internet.
                  </p>
                  <Button asChild size="lg">
                    <a href="https://wa.me/34654633796" target="_blank" rel="noopener noreferrer">
                      Hablar con un experto
                    </a>
                  </Button>
                </div>
              </BlurredCard>
            </AnimatedContainer>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Recursos;
