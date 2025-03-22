
import React, { useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Keyword {
  keyword: string;
  searchVolume?: string;
  difficulty?: string;
}

interface ReportGeneratorStep3Props {
  keywords: Keyword[];
  setKeywords: (keywords: Keyword[]) => void;
  isLoading: boolean;
  previousStep: () => void;
  nextStep: () => void;
  useKeywordsData: boolean;
  setUseKeywordsData: (value: boolean) => void;
}

const ReportGeneratorStep3: React.FC<ReportGeneratorStep3Props> = ({
  keywords,
  setKeywords,
  isLoading,
  previousStep,
  nextStep,
  useKeywordsData,
  setUseKeywordsData
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [searchVolume, setSearchVolume] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    setIsAdding(true);
    
    // Check if keyword already exists
    const exists = keywords.some(k => k.keyword.toLowerCase() === newKeyword.toLowerCase());
    
    if (!exists) {
      const keyword: Keyword = {
        keyword: newKeyword.trim(),
        searchVolume: searchVolume.trim() || undefined,
        difficulty: difficulty.trim() || undefined
      };
      
      setKeywords([...keywords, keyword]);
      setNewKeyword('');
      setSearchVolume('');
      setDifficulty('');
    }
    
    setIsAdding(false);
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            1
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            2
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            3
          </div>
          <div className="h-0.5 w-10 bg-muted"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
            4
          </div>
          <div className="h-0.5 w-10 bg-muted"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
            5
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-6 pt-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="use-keywords">Incluir análisis de palabras clave</Label>
            <p className="text-xs text-muted-foreground">
              Analiza y recomienda mejoras para posicionar palabras clave
            </p>
          </div>
          <Switch
            id="use-keywords"
            checked={useKeywordsData}
            onCheckedChange={setUseKeywordsData}
          />
        </div>
        
        {useKeywordsData && (
          <div className="space-y-2 pl-6 border-l-2 border-primary/20">
            <Label>Palabras Clave</Label>
            <p className="text-sm text-muted-foreground">
              Añade palabras clave importantes para el sitio web. Estas se utilizarán para enfocar el análisis SEO.
            </p>
            
            <div className="grid grid-cols-12 gap-2 mt-4">
              <div className="col-span-6">
                <Label htmlFor="keyword">Palabra Clave</Label>
                <Input
                  id="keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Ej: marketing digital"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="volume">Volumen</Label>
                <Input
                  id="volume"
                  type="number"
                  value={searchVolume}
                  onChange={(e) => setSearchVolume(e.target.value)}
                  placeholder="Ej: 1000"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="difficulty">Dificultad (1-100)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max="100"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  placeholder="Ej: 65"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAddKeyword} 
              disabled={isAdding || !newKeyword.trim()}
              className="w-full mt-2"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Palabra Clave
                </>
              )}
            </Button>
            
            <div className="space-y-2 mt-6">
              <Label>Palabras Clave Añadidas</Label>
              {keywords.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-2">Aún no has añadido palabras clave.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <span>{keyword.keyword}</span>
                      {keyword.searchVolume && (
                        <span className="text-xs">({keyword.searchVolume})</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-1 text-primary/70 hover:text-primary rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={previousStep}
          disabled={isLoading}
        >
          Atrás
        </Button>
        <Button 
          onClick={nextStep}
          disabled={isLoading}
        >
          Siguiente
        </Button>
      </CardFooter>
    </div>
  );
};

export default ReportGeneratorStep3;
