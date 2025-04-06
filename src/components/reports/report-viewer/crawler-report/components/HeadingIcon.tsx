
import React from 'react';

interface HeadingIconProps {
  type: string;
  className?: string;
}

const HeadingIcon: React.FC<HeadingIconProps> = ({ type, className = "h-4 w-4" }) => {
  switch (type) {
    case 'h1':
      return (
        <div className={`${className} flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold`}>
          H1
        </div>
      );
    case 'h2':
      return (
        <div className={`${className} flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold`}>
          H2
        </div>
      );
    case 'h3':
      return (
        <div className={`${className} flex items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold`}>
          H3
        </div>
      );
    default:
      return (
        <div className={`${className} flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold`}>
          {type.toUpperCase()}
        </div>
      );
  }
};

export default HeadingIcon;
