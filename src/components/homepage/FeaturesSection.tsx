
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { BarChart, FileText, Layers, Search, Zap, ArrowUpRight } from 'lucide-react';
import Feature from './Feature';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Informes SEO Todo-en-uno</h2>
          <p className="text-lg text-muted-foreground">
            Genera informes completos que analizan todos los aspectos del rendimiento SEO de tu sitio web.
          </p>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature
            icon={<Search className="h-10 w-10 text-primary" />}
            title="Análisis Técnico"
            description="Evalúa la velocidad del sitio, compatibilidad móvil, rastreabilidad y otros factores técnicos que afectan tu SEO."
            delay={0}
          />
          <Feature
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Evaluación de Contenido"
            description="Obtén información detallada sobre la calidad del contenido, uso de palabras clave, legibilidad y oportunidades de mejora."
            delay={100}
          />
          <Feature
            icon={<Layers className="h-10 w-10 text-primary" />}
            title="Análisis de Backlinks"
            description="Revisa la calidad, diversidad y autoridad de tu perfil de backlinks en comparación con la competencia."
            delay={200}
          />
          <Feature
            icon={<BarChart className="h-10 w-10 text-primary" />}
            title="Métricas de Rendimiento"
            description="Haz seguimiento de tus rankings, tráfico y métricas de conversión con visualizaciones intuitivas y elegantes."
            delay={300}
          />
          <Feature
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Recomendaciones de Acción"
            description="Recibe pasos priorizados y accionables para mejorar tu rendimiento SEO y superar a la competencia."
            delay={400}
          />
          <Feature
            icon={<ArrowUpRight className="h-10 w-10 text-primary" />}
            title="Información de Competidores"
            description="Compara tu rendimiento con competidores e identifica oportunidades estratégicas."
            delay={500}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
