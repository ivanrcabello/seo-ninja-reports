
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Cómo optimizar Google Business Profile para SEO local",
      excerpt: "Aprende las mejores prácticas para optimizar tu ficha de Google Business Profile y mejorar tu visibilidad en búsquedas locales.",
      author: "Iván Rodríguez",
      date: "15 mayo, 2023",
      category: "SEO Local",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 2,
      title: "Las 10 claves del SEO local para pequeños negocios",
      excerpt: "Descubre las estrategias fundamentales que todo pequeño negocio debe implementar para destacar en su área local.",
      author: "María López",
      date: "3 junio, 2023",
      category: "Estrategia SEO",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80",
    },
    {
      id: 3,
      title: "SEO técnico: factores que afectan a tu posicionamiento local",
      excerpt: "Análisis de los aspectos técnicos que impactan directamente en el posicionamiento de tu negocio en búsquedas locales.",
      author: "Carlos Sánchez",
      date: "22 julio, 2023",
      category: "SEO Técnico",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
    },
    {
      id: 4,
      title: "Cómo conseguir reseñas positivas para tu negocio local",
      excerpt: "Estrategias efectivas para obtener más reseñas de clientes y gestionar tu reputación online de manera eficaz.",
      author: "Laura Gómez",
      date: "8 agosto, 2023",
      category: "Reputación Online",
      imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 5,
      title: "La importancia del contenido local en tu estrategia SEO",
      excerpt: "Por qué crear contenido relevante para tu audiencia local es fundamental para el éxito de tu estrategia de SEO.",
      author: "Iván Rodríguez",
      date: "19 septiembre, 2023",
      category: "Contenido SEO",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 6,
      title: "Cómo analizar a tu competencia local en SEO",
      excerpt: "Técnicas y herramientas para realizar un análisis competitivo efectivo que te ayude a superar a tus competidores locales.",
      author: "Ana Martínez",
      date: "5 octubre, 2023",
      category: "Análisis Competitivo",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
  ];

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
        
        {/* Blog Posts */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <AnimatedContainer key={post.id} animation="slide-up" delay={index * 100}>
                  <BlurredCard className="h-full overflow-hidden">
                    <div className="flex flex-col h-full">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-2">
                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button size="lg" variant="outline">
                Cargar más artículos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlurredCard className="max-w-3xl mx-auto">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Suscríbete a nuestro newsletter</h2>
                <p className="text-muted-foreground mb-6">
                  Recibe los últimos artículos, consejos y noticias sobre SEO local directamente en tu bandeja de entrada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button className="sm:w-auto">Suscribirse</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
                </p>
              </div>
            </BlurredCard>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
