
/**
 * Get a human-readable label for a keyword difficulty score
 */
export function getKeywordDifficultyLabel(difficulty: number | string): string {
  const difficultyValue = typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty;
  
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
