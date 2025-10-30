import { ReactNode } from 'react';
import { AntState } from './langtons-ant';

declare global {
  interface HTMLCanvasElement {
    customState?: unknown;
  }
}

export interface CellularAutomatonProps {
  title: string;
  tagline: string;
  rules: string;
  birthRules?: number[];
  survivalRules?: number[];
  cellColor?: string;
  backgroundColor?: string;
  aboutContent?: ReactNode;
  stepFunction?: StepFunction;
  initialState?: InitialStateFunction;
  customDraw?: DrawFunction;
  cellStates?: number;
  extraControls?: (props: GridControls) => JSX.Element;
  customControls?: (props: GridControls) => JSX.Element | React.ReactNode;
  maxFps?: number;
}

export interface CanvasRefs {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
}

export interface GridCell {
  x: number;
  y: number;
  state: number;
}

export interface GridDimensions {
  cols: number;
  rows: number;
}

export interface GridConfig {
  cellSize: number;
  showGrid: boolean;
  wrapEdges: boolean;
  fps: number;
}

export interface GridControls {
  setGrid: (grid: Uint8Array) => void;
  cols: number;
  rows: number;
}

export type StepFunction = (
  grid: Uint8Array,
  next: Uint8Array,
  cols: number,
  rows: number,
  customState: unknown
) => unknown;

export type InitialStateFunction = (
  cols: number,
  rows: number
) => Uint8Array;

export type DrawFunction = (
  ctx: CanvasRenderingContext2D & { canvas: HTMLCanvasElement & { customState?: unknown } },
  grid: Uint8Array,
  cols: number,
  rows: number,
  cellSize: number,
  showGrid?: boolean,
  index?: (x: number, y: number) => number
) => void;

export type GridState = boolean[][];

export interface AutomatonState {
  grid: Uint8Array;
  customState?: unknown;
}