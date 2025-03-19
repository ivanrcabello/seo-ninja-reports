
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'blur';
  delay?: number;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-down':
        return 'animate-slide-down';
      case 'scale':
        return 'animate-scale-in';
      case 'blur':
        return 'animate-blur-in';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        getAnimationClass(),
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
