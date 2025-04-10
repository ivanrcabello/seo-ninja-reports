
import React from 'react';
import { Keyword } from '@/types/report-hooks.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getKeywordDifficultyLabel } from '@/utils/keywordUtils';

interface KeywordsListProps {
  keywords: Keyword[];
  onRemove?: (index: number) => void;
  readOnly?: boolean;
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords, onRemove, readOnly = false }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="text-center py-2 text-muted-foreground">
        No hay palabras clave añadidas
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Palabra clave</TableHead>
            <TableHead className="text-right">Volumen</TableHead>
            <TableHead className="text-right">Dificultad</TableHead>
            {!readOnly && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword, index) => (
            <TableRow key={index}>
              <TableCell>{keyword.keyword}</TableCell>
              <TableCell className="text-right">{keyword.searchVolume || '-'}</TableCell>
              <TableCell className="text-right">
                {keyword.difficulty !== undefined ? (
                  <Badge variant={getDifficultyVariant(keyword.difficulty)}>
                    {getKeywordDifficultyLabel(keyword.difficulty)}
                  </Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              {!readOnly && (
                <TableCell className="text-right">
                  {onRemove && (
                    <button
                      onClick={() => onRemove(index)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to determine badge variant based on difficulty
function getDifficultyVariant(difficulty: number): 'default' | 'success' | 'warning' | 'destructive' {
  if (difficulty < 30) return 'success';
  if (difficulty < 60) return 'warning';
  return 'destructive';
}

export default KeywordsList;
