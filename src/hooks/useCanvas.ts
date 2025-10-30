import { useRef, useEffect, useState, useCallback } from 'react';
import { computeGridSize, resizeCanvasToDpr } from '../lib/grid';
import { GridDimensions, GridConfig } from '../types/cellular-automaton';

export const useCanvas = (config: GridConfig) => {
  const { cellSize } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [dimensions, setDimensions] = useState<GridDimensions>({ cols: 0, rows: 0 });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    
    resizeCanvasToDpr(canvas, ctxRef, () => {
      const { cols, rows } = computeGridSize(canvas, cellSize);
      setDimensions({ cols, rows });
    });
  }, [cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctxRef.current = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return {
    canvasRef,
    ctxRef,
    dimensions,
    resizeCanvas
  };
};