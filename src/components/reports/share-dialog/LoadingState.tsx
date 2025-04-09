
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-4">
      <div className="w-8 h-8 rounded-full border-4 border-t-primary border-primary/30 animate-spin"></div>
      <span className="ml-3">Generando enlace...</span>
    </div>
  );
};

export default LoadingState;
