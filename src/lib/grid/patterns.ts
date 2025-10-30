export interface GridControls {
  setGrid: (grid: Uint8Array) => void;
  cols: number;
  rows: number;
}

export interface GridPatternOptions {
  centerX?: number;
  centerY?: number;
  offsetX?: number;
  offsetY?: number;
}

export const applyPattern = (
  grid: Uint8Array,
  cols: number,
  rows: number,
  pattern: readonly (readonly number[])[],
  options: GridPatternOptions = {}
): void => {
  const {
    centerX = Math.floor(cols / 2),
    centerY = Math.floor(rows / 2),
    offsetX = 0,
    offsetY = 0
  } = options;

  const patternHeight = pattern.length;
  const patternWidth = pattern[0]?.length ?? 0;

  if (patternWidth === 0) return;

  for (let y = 0; y < patternHeight; y++) {
    for (let x = 0; x < patternWidth; x++) {
      const gridX = centerX + offsetX - Math.floor(patternWidth / 2) + x;
      const gridY = centerY + offsetY - Math.floor(patternHeight / 2) + y;
      
      if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        const index = gridY * cols + gridX;
        const value = pattern[y]?.[x];
        if (typeof value === 'number') {
          grid[index] = value;
        }
      }
    }
  }
};