
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const ClientNotFound: React.FC = () => {
  return (
    <AnimatedContainer animation="fade" className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The client you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </AnimatedContainer>
  );
};

export default ClientNotFound;
