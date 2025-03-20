
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';

interface KeywordFormProps {
  onAdd: (keyword: string, searchVolume: string, difficulty: string) => Promise<any>;
  isSaving: boolean;
  formId?: string; // Added to uniquely identify this form
}

const KeywordForm: React.FC<KeywordFormProps> = ({ onAdd, isSaving, formId = 'default' }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [searchVolume, setSearchVolume] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  // Save and restore form state on tab visibility change
  useEffect(() => {
    const saveState = () => {
      const state = { newKeyword, searchVolume, difficulty };
      sessionStorage.setItem(`keyword-form-${formId}`, JSON.stringify(state));
    };

    const loadState = () => {
      try {
        const savedState = sessionStorage.getItem(`keyword-form-${formId}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          setNewKeyword(state.newKeyword || '');
          setSearchVolume(state.searchVolume || '');
          setDifficulty(state.difficulty || '');
        }
      } catch (error) {
        console.error('Error loading keyword form state:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadState();
      } else {
        saveState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Load state on component mount
    loadState();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [formId, newKeyword, searchVolume, difficulty]);

  const handleSubmit = async () => {
    const result = await onAdd(newKeyword, searchVolume, difficulty);
    if (result) {
      setNewKeyword('');
      setSearchVolume('');
      setDifficulty('');
      // Clear form data from session storage after successful submission
      sessionStorage.removeItem(`keyword-form-${formId}`);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-12 gap-2">
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
        onClick={handleSubmit} 
        className="w-full" 
        disabled={isSaving || !newKeyword.trim()}
      >
        {isSaving ? (
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
    </div>
  );
};

export default KeywordForm;
