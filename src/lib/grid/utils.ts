import { GridCell, GridDimensions } from '../types/cellular-automaton';

export const createIndex = (cols: number) => (x: number, y: number): number => y * cols + x;

export const pointerToCellFromEvent = (
  evt: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement,
  cellSize: number,
  cols: number,
  rows: number
): GridCell | null => {
  const rect = canvas.getBoundingClientRect();
  const x = evt instanceof MouseEvent ? evt.clientX : evt.touches[0].clientX;
  const y = evt instanceof MouseEvent ? evt.clientY : evt.touches[0].clientY;
  
  const gridX = Math.floor((x - rect.left) / cellSize);
  const gridY = Math.floor((y - rect.top) / cellSize);
  
  if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
    return null;
  }
  
  return { x: gridX, y: gridY, state: 1 };
};

export const computeGridSize = (
  canvas: HTMLCanvasElement,
  cellSize: number
): GridDimensions => {
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  return { cols, rows };
};

export const drawGridLines = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  cellSize: number
): void => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, rows * cellSize);
    ctx.stroke();
  }
  
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(cols * cellSize, y * cellSize);
    ctx.stroke();
  }
};