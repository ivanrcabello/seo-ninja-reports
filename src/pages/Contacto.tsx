
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contacto = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te responderemos lo antes posible.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

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
                  Estamos aquí para ayudarte
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Contacta con <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    nosotros
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  ¿Tienes dudas sobre nuestros servicios o necesitas asistencia? Estamos a un mensaje de distancia.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatedContainer animation="slide-up">
                  <BlurredCard className="overflow-hidden">
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Tu nombre"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="tu@email.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">Asunto</label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          >
                            <option value="">Selecciona un asunto</option>
                            <option value="info">Información general</option>
                            <option value="support">Soporte técnico</option>
                            <option value="billing">Facturación</option>
                            <option value="partnership">Colaboración</option>
                            <option value="other">Otro</option>
                          </select>
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="message" className="block text-sm font-medium mb-2">Mensaje</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="¿En qué podemos ayudarte?"
                            required
                          ></textarea>
                        </div>
                        
                        <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                          {loading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enviando...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Send className="mr-2 h-4 w-4" />
                              Enviar mensaje
                            </span>
                          )}
                        </Button>
                      </form>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              </div>
              
              <div>
                <AnimatedContainer animation="slide-up" delay={200}>
                  <BlurredCard className="overflow-hidden h-full">
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full p-2 bg-primary/10 text-primary">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <a href="mailto:info@seoyseolocal.com" className="text-primary hover:underline">
                              info@soyseolocal.com
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full p-2 bg-primary/10 text-primary">
                            <Phone className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Teléfono</h3>
                            <a href="tel:+34911234567" className="text-primary hover:underline">
                              +34 911 23 45 67
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full p-2 bg-primary/10 text-primary">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Ubicación</h3>
                            <p className="text-muted-foreground">
                              Madrid, España
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-6 mt-6 border-t border-border">
                          <h3 className="font-medium mb-4">Horario de atención</h3>
                          <p className="text-muted-foreground mb-2">
                            Lunes a viernes: 9:00 - 18:00
                          </p>
                          <p className="text-muted-foreground">
                            Fines de semana: Cerrado
                          </p>
                        </div>
                      </div>
                    </div>
                  </BlurredCard>
                </AnimatedContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contacto;
