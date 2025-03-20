
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const BlogHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background opacity-50 -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedContainer animation="fade" className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              Recursos y Noticias
            </span>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Blog de <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                SEO Local
              </span>
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artículos, guías y consejos para mejorar el posicionamiento local de tu negocio y destacar en tu área.
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
