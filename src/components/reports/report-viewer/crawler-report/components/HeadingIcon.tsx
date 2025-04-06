
import React from 'react';
import { Heading1, Heading2, Heading3 } from 'lucide-react';

interface HeadingIconProps {
  type: string;
  className?: string;
}

const HeadingIcon: React.FC<HeadingIconProps> = ({ type, className = "" }) => {
  switch (type) {
    case 'h1': 
      return <Heading1 className={`h-4 w-4 text-blue-500 ${className}`} />;
    case 'h2': 
      return <Heading2 className={`h-4 w-4 text-green-500 ${className}`} />;
    case 'h3': 
      return <Heading3 className={`h-4 w-4 text-amber-500 ${className}`} />;
    default: 
      return <Heading2 className={`h-4 w-4 text-gray-500 ${className}`} />;
  }
};

export default HeadingIcon;
