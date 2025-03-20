
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { BarChart, FileText, Layers, Search, Zap, ArrowUpRight, Bot, Target, RefreshCw } from 'lucide-react';
import Feature from './Feature';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Automatización SEO con IA</h2>
          <p className="text-lg text-muted-foreground">
            Nuestra plataforma utiliza inteligencia artificial para automatizar y optimizar todos los aspectos del posicionamiento SEO de empresas de servicios.
          </p>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature
            icon={<Bot className="h-10 w-10 text-primary" />}
            title="Análisis Automático"
            description="Nuestra IA analiza automáticamente tu sitio web y competencia para identificar oportunidades de optimización SEO específicas para empresas de servicios."
            delay={0}
          />
          <Feature
            icon={<Target className="h-10 w-10 text-primary" />}
            title="SEO Local Inteligente"
            description="Optimización automática para búsquedas locales, Google Business Profile, y factores de posicionamiento geolocalizado específicos de tu sector."
            delay={100}
          />
          <Feature
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Informes Profesionales"
            description="Genera informes SEO personalizados para tus clientes con tu marca y diseño profesional, destacando logros y oportunidades de mejora."
            delay={200}
          />
          <Feature
            icon={<BarChart className="h-10 w-10 text-primary" />}
            title="Seguimiento de KPIs"
            description="Monitoriza automáticamente el rendimiento de tus keywords, tráfico y conversiones con paneles visuales intuitivos y alertas personalizables."
            delay={300}
          />
          <Feature
            icon={<RefreshCw className="h-10 w-10 text-primary" />}
            title="Optimización Continua"
            description="La plataforma implementa mejoras automáticas continuamente, adaptándose a los cambios de algoritmos y tendencias del mercado local."
            delay={400}
          />
          <Feature
            icon={<ArrowUpRight className="h-10 w-10 text-primary" />}
            title="Ventaja Competitiva"
            description="Análisis competitivo automático que identifica oportunidades para superar a la competencia local en tu sector de servicios."
            delay={500}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
