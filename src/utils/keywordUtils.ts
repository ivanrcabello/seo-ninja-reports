
/**
 * Generates a text label for keyword difficulty based on a numeric value
 */
export function getKeywordDifficultyLabel(difficulty: number): string {
  if (difficulty < 30) return 'Fácil';
  if (difficulty < 60) return 'Medio';
  if (difficulty < 80) return 'Difícil';
  return 'Muy difícil';
}

/**
 * Formats a search volume number with appropriate units
 * For example: 10500 becomes 10.5K
 */
export function formatSearchVolume(volume: number): string {
  if (!volume && volume !== 0) return '-';
  
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  
  return volume.toString();
}
