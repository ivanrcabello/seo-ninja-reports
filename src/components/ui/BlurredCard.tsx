
import React from 'react';
import { cn } from "@/lib/utils";
import AnimatedContainer from './AnimatedContainer';

interface BlurredCardProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'blur';
  delay?: number;
  hover?: boolean;
}

const BlurredCard: React.FC<BlurredCardProps> = ({
  children,
  className,
  animation = 'scale',
  delay = 0,
  hover = true,
}) => {
  return (
    <AnimatedContainer
      animation={animation}
      delay={delay}
      className={cn(
        'glass-card rounded-xl p-6',
        hover && 'hover:scale-[1.01] hover:shadow-xl',
        className
      )}
    >
      {children}
    </AnimatedContainer>
  );
};

export default BlurredCard;
