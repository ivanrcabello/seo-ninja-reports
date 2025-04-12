
/**
 * Get a human-readable label for a keyword difficulty score
 */
export function getKeywordDifficultyLabel(difficulty: number | string): string {
  const difficultyValue = typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty;
  
  if (isNaN(difficultyValue)) return 'Desconocido';
  
  if (difficultyValue < 30) {
    return 'Fácil';
  } else if (difficultyValue < 60) {
    return 'Medio';
  } else {
    return 'Difícil';
  }
}

/**
 * Format a search volume number with thousands separators
 */
export function formatSearchVolume(volume: number | string | undefined): string {
  if (volume === undefined) return '-';
  
  const volumeValue = typeof volume === 'string' ? parseInt(volume, 10) : volume;
  if (isNaN(volumeValue)) return '-';
  
  return new Intl.NumberFormat('es-ES').format(volumeValue);
}

/**
 * Ensure keyword has proper types (convert strings to numbers where needed)
 */
export function normalizeKeyword(keyword: Keyword): Keyword {
  return {
    keyword: keyword.keyword,
    searchVolume: keyword.searchVolume !== undefined ? 
      (typeof keyword.searchVolume === 'string' && keyword.searchVolume.trim() !== '' ? 
        parseInt(keyword.searchVolume, 10) : keyword.searchVolume) : 
      undefined,
    difficulty: keyword.difficulty !== undefined ? 
      (typeof keyword.difficulty === 'string' && keyword.difficulty.trim() !== '' ? 
        parseInt(keyword.difficulty, 10) : keyword.difficulty) : 
      undefined
  };
}

/**
 * Convert keywords to JSON-safe format for storage
 */
export function keywordsToJson(keywords: Keyword[]): any[] {
  return keywords.map(k => ({
    keyword: k.keyword,
    searchVolume: k.searchVolume,
    difficulty: k.difficulty
  }));
}

/**
 * Convert JSON data from database to Keyword objects
 */
export function jsonToKeywords(jsonData: any[]): Keyword[] {
  if (!jsonData || !Array.isArray(jsonData)) {
    return [];
  }
  
  return jsonData.map(item => ({
    keyword: typeof item.keyword === 'string' ? item.keyword : '',
    searchVolume: item.searchVolume !== undefined ? item.searchVolume : undefined,
    difficulty: item.difficulty !== undefined ? item.difficulty : undefined
  }));
}

// Add type import to avoid TypeScript error
import { Keyword } from '@/types/report-hooks.types';
