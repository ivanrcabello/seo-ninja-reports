
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpenAISettings } from './api/OpenAISettings';
import GoogleSettings from './api/GoogleSettings';
import GoogleBusinessSettings from './api/GoogleBusinessSettings';
import LogoUpload from './LogoUpload';

const ApiSettings = () => {
  return (
    <Tabs defaultValue="apis" className="space-y-4">
      <TabsList>
        <TabsTrigger value="apis">APIs Externas</TabsTrigger>
        <TabsTrigger value="customization">Personalización</TabsTrigger>
      </TabsList>
      
      <TabsContent value="apis" className="space-y-4">
        <OpenAISettings />
        <GoogleSettings />
        <GoogleBusinessSettings />
      </TabsContent>
      
      <TabsContent value="customization" className="space-y-4">
        <LogoUpload />
      </TabsContent>
    </Tabs>
  );
};

export default ApiSettings;
