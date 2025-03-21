
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusinessProfile } from '@/types/report.types';
import { GmbUrlInput, GmbProfileDisplay } from './gmbTest';
import { useGmbAnalysis } from './gmbTest/useGmbAnalysis';

interface ClientGmbTestProps {
  clientId: string;
  clientWebsite?: string;
  onProfileUpdate?: (profile: Partial<BusinessProfile>) => void;
}

const ClientGmbTest: React.FC<ClientGmbTestProps> = ({ 
  clientId, 
  clientWebsite, 
  onProfileUpdate 
}) => {
  const {
    businessUrl,
    setBusinessUrl,
    isAnalyzing,
    error,
    setError,
    businessProfile,
    useWebsite,
    setUseWebsite,
    isSimulated,
    handleAnalyze
  } = useGmbAnalysis({ clientId, clientWebsite, onProfileUpdate });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Análisis de Google Business
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GmbUrlInput
          businessUrl={businessUrl}
          setBusinessUrl={setBusinessUrl}
          handleAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          clientWebsite={clientWebsite}
          useWebsite={useWebsite}
          setUseWebsite={setUseWebsite}
          error={error}
          setError={setError}
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {businessProfile && (
          <GmbProfileDisplay 
            businessProfile={businessProfile}
            isSimulated={isSimulated}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGmbTest;
