
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Search, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface KeywordsStepProps {
  nextStep: () => void;
  previousStep: () => void;
}

const KeywordsStep: React.FC<KeywordsStepProps> = ({
  nextStep,
  previousStep
}) => {
  const { 
    keywords, setKeywords,
    useKeywordsData, setUseKeywordsData
  } = useReportGenerator();
  
  const [newKeyword, setNewKeyword] = useState('');
  const [newSearchVolume, setNewSearchVolume] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('');
  
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    setKeywords([
      ...keywords,
      {
        keyword: newKeyword.trim(),
        searchVolume: newSearchVolume,
        difficulty: newDifficulty
      }
    ]);
    
    setNewKeyword('');
    setNewSearchVolume('');
    setNewDifficulty('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };
  
  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Palabras clave</h2>
          <p className="text-muted-foreground">
            Configura las palabras clave importantes para este sitio web
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Search className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium">Palabras clave</h3>
              <p className="text-sm text-muted-foreground">
                Añade palabras clave relevantes para incluir en el informe y análisis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-keywords" 
              checked={useKeywordsData}
              onCheckedChange={(checked) => setUseKeywordsData(checked)}
            />
            <Label htmlFor="use-keywords">
              Incluir análisis de palabras clave en el informe
            </Label>
          </div>
          
          {useKeywordsData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-3">
                  <Label htmlFor="keyword">Palabra clave</Label>
                  <Input 
                    id="keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Introduce una palabra clave"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <Label htmlFor="search-volume">Volumen de búsqueda</Label>
                  <Input 
                    id="search-volume"
                    value={newSearchVolume}
                    onChange={(e) => setNewSearchVolume(e.target.value)}
                    placeholder="1000"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Dificultad (0-100)</Label>
                  <Input 
                    id="difficulty"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    placeholder="50"
                    type="number"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleAddKeyword}
                    disabled={!newKeyword.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-2 min-h-[100px] bg-muted/20">
                {keywords.length > 0 ? (
                  <ScrollArea className="h-[150px] w-full">
                    <div className="flex flex-wrap gap-2 p-2">
                      {keywords.map((kw, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="py-1.5 px-3 flex items-center gap-2"
                        >
                          <span>{kw.keyword}</span>
                          {(kw.searchVolume || kw.difficulty) && (
                            <span className="text-xs text-muted-foreground">
                              {kw.searchVolume && `${kw.searchVolume} búsquedas`}
                              {kw.searchVolume && kw.difficulty && ' · '}
                              {kw.difficulty && `Dificultad: ${kw.difficulty}`}
                            </span>
                          )}
                          <button 
                            onClick={() => handleRemoveKeyword(index)}
                            className="ml-1 text-muted-foreground hover:text-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">No hay palabras clave añadidas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Atrás
        </Button>
        <Button onClick={nextStep}>
          Continuar
        </Button>
      </CardFooter>
    </>
  );
};

export default KeywordsStep;
