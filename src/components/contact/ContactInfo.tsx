
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
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
                <a href="mailto:info@soyseolocal.com" className="text-primary hover:underline">
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
  );
};

export default ContactInfo;
