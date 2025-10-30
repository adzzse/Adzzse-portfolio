import { GridDimensions } from './cellular-automaton';

export interface PathNode {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  parent: PathNode | null;
}

export interface PathfindingState {
  grid: boolean[][];
  start: [number, number] | null;
  end: [number, number] | null;
  path: [number, number][];
  visited: Set<string>;
  dimensions: GridDimensions;
}

export type PathfindingAlgorithm = 'dijkstra' | 'astar' | 'greedy';

export interface PathfindingConfig {
  showVisited: boolean;
  showDistance: boolean;
  showArrows: boolean;
  algorithm: PathfindingAlgorithm;
  diagonal: boolean;
  cellSize: number;
  fps: number;
}