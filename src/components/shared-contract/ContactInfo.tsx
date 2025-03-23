
import React from 'react';

const ContactInfo: React.FC = () => {
  return (
    <div className="text-center text-sm text-muted-foreground mt-8">
      <p>Si tienes alguna pregunta sobre este contrato, puedes contactarnos en:</p>
      <div className="mt-2">
        <a href="mailto:info@soyseolocal.com" className="text-primary hover:underline">info@soyseolocal.com</a>
        <span className="mx-2">|</span>
        <a href="tel:+34600000000" className="text-primary hover:underline">+34 600 000 000</a>
      </div>
    </div>
  );
};

export default ContactInfo;
