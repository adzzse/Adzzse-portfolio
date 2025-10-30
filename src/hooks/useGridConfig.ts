import { useState, useCallback } from 'react';
import { GridConfig } from '../types/cellular-automaton';

export const useGridConfig = (initialConfig?: Partial<GridConfig>) => {
  const [config, setConfig] = useState<GridConfig>({
    cellSize: initialConfig?.cellSize ?? 12,
    showGrid: initialConfig?.showGrid ?? true,
    wrapEdges: initialConfig?.wrapEdges ?? true,
    fps: initialConfig?.fps ?? 10
  });

  const updateConfig = useCallback((updates: Partial<GridConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    config,
    updateConfig,
    setConfig
  };
};