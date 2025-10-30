import { useCallback } from 'react';
import { GridControls } from '../lib/grid/patterns';

export interface PatternControlProps extends GridControls {
  pattern: number[][];
  label: string;
  className?: string;
}

export const usePatternControl = ({ 
  pattern,
  label,
  className = 'control-button',
  ...gridControls
}: PatternControlProps) => {
  const { setGrid, cols, rows } = gridControls;

  const applyPattern = useCallback(() => {
    const newGrid = new Uint8Array(cols * rows);
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);
    const patternWidth = pattern[0]?.length || 0;
    const patternHeight = pattern.length;

    if (patternWidth === 0) return;

    for (let y = 0; y < patternHeight; y++) {
      for (let x = 0; x < patternWidth; x++) {
        const gridX = centerX - Math.floor(patternWidth / 2) + x;
        const gridY = centerY - Math.floor(patternHeight / 2) + y;
        
        if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
          const index = gridY * cols + gridX;
          const value = pattern[y]?.[x];
          if (typeof value === 'number') {
            newGrid[index] = value;
          }
        }
      }
    }
    
    setGrid(newGrid);
  }, [cols, rows, pattern, setGrid]);

  const Control = useCallback(() => (
    <button
      onClick={applyPattern}
      className={className}
    >
      {label}
    </button>
  ), [applyPattern, className, label]);

  return {
    applyPattern,
    Control
  };
};