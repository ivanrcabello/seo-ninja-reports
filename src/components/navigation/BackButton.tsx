
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const BackButton = ({ 
  fallbackUrl = '/dashboard',
  className = '',
  variant = "outline"
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleGoBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // No history, go to fallback URL
      navigate(fallbackUrl);
    }
  };
  
  // Don't show back button on main pages
  if (['/dashboard', '/', '/auth'].includes(location.pathname)) {
    return null;
  }
  
  return (
    <Button 
      variant={variant} 
      size="sm" 
      className={`${className}`} 
      onClick={handleGoBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver
    </Button>
  );
};

export default BackButton;
