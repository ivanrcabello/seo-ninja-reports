
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Globe, ArrowRight } from 'lucide-react';
import FileUploader from './FileUploader';
import BlurredCard from '../ui/BlurredCard';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';

interface ReportGeneratorProps {
  clientId: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const navigate = useNavigate();
  
  const client = getClient(clientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const report = await generateReport(clientId, url, files);
      navigate(`/reports/${report.id}`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (url) {
      setStep(2);
    }
  };

  const previousStep = () => {
    setStep(1);
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">
            Generate SEO Report {client ? `for ${client.name}` : ''}
          </CardTitle>
          <CardDescription>
            Enter website details and upload supporting files to generate a comprehensive SEO report.
          </CardDescription>
        </CardHeader>
        
        {step === 1 ? (
          <>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the main URL you want to analyze
                </p>
              </div>
              
              <div className="flex justify-center items-center">
                <span className="h-px flex-1 bg-border"></span>
                <span className="px-3 text-sm text-muted-foreground">Then</span>
                <span className="h-px flex-1 bg-border"></span>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Upload Supporting Files</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      In the next step, you'll upload files like analytics exports, previous reports, 
                      screenshots, and other documents to enhance your SEO analysis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-4">
              <Button
                onClick={nextStep}
                disabled={!url}
                className="group"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Upload Supporting Files</Label>
                <FileUploader
                  onFilesChange={setFiles}
                  maxFiles={5}
                  acceptedTypes=".pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
                />
                <p className="text-xs text-muted-foreground">
                  Upload analytics exports, previous reports, screenshots, or other documents to enhance your analysis
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={files.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </BlurredCard>
  );
};

export default ReportGenerator;
