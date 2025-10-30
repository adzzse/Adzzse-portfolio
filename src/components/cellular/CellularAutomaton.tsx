import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useCanvas, useGridConfig } from '../../hooks';
import { CellularAutomatonProps, GridCell } from '../../types/cellular-automaton';
import { drawGridLines } from '../../lib/grid';
import GridLayout from '../shared/GridLayout';

interface ExtendedCellularAutomatonProps extends CellularAutomatonProps {
  stepFunction?: (grid: Uint8Array, next: Uint8Array, cols: number, rows: number, customState: any) => void;
  initialState?: (cols: number, rows: number) => Uint8Array;
  customDraw?: (ctx: CanvasRenderingContext2D, grid: Uint8Array, cols: number, rows: number, cellSize: number) => void;
  cellStates?: number;
  maxFps?: number;
}

const CellularAutomaton: React.FC<ExtendedCellularAutomatonProps> = ({ 
  title, 
  tagline, 
  rules, 
  birthRules, 
  survivalRules, 
  cellColor = '#6ee7ff',
  backgroundColor = '#0f1738',
  extraControls = null,
  aboutContent = null,
  stepFunction = null,
  initialState = null,
  customDraw = null,
  cellStates = 2,
  customControls = null,
  maxFps = 120 
}) => {
  const animationRef = useRef<number>(0);
  const lastStepAt = useRef<number>(0);
  
  const { config, updateConfig } = useGridConfig();
  const { canvasRef, ctxRef, dimensions } = useCanvas(config);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [customState, setCustomState] = useState<Record<string, any>>({});
  const [grid, setGrid] = useState<Uint8Array>(new Uint8Array(0));
  const [next, setNext] = useState<Uint8Array>(new Uint8Array(0));
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null);

  const recentChangedAtRef = useRef<Float64Array>(new Float64Array(0));
  const visualAnimationRef = useRef<number>(0);

  const controlsNode = typeof extraControls === 'function' ? null : extraControls;

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);
    if (config.showGrid && config.cellSize >= 4) {
      drawGridLines(ctx, dimensions.cols, dimensions.rows, config.cellSize);
    }
  }, [ctxRef, canvasRef, dimensions, config.showGrid, config.cellSize, backgroundColor]);

  return (
    <GridLayout
      title={title}
      tagline={tagline}
      rules={rules}
      aboutContent={aboutContent}
      extraControls={controlsNode}
    >
      <canvas
        ref={canvasRef}
        style={{
          backgroundColor,
          width: '100%',
          height: '100%'
        }}
      />
    </GridLayout>
  );
};

export default CellularAutomaton;