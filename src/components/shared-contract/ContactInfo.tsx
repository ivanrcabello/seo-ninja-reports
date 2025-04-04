
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <footer className="text-center bg-white rounded-lg p-6 shadow-md">
      <h3 className="font-medium mb-4">¿Necesitas ayuda?</h3>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
        <a href="mailto:contacto@seolocal.es" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Mail className="h-4 w-4" />
          <span>contacto@seolocal.es</span>
        </a>
        
        <a href="tel:+34654633796" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Phone className="h-4 w-4" />
          <span>+34 654 633 796</span>
        </a>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Madrid, España</span>
        </div>
      </div>
    </footer>
  );
};

export default ContactInfo;
