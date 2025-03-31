
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

export interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, link }) => {
  return (
    <AnimatedContainer animation="fade" delay={200} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 flex flex-col h-full border border-border">
      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-1">{description}</p>
      <Link to={link} className="flex items-center text-primary hover:underline mt-auto">
        Ver más <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </AnimatedContainer>
  );
};

export default Feature;
