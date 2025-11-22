// Core types for pathfinding visualizer

export type NodeType = 'start' | 'finish' | 'wall' | 'weight' | 'visited' | 'path' | 'normal'

export interface Coordinate {
  row: number
  col: number
}

export interface GridNode extends Coordinate {
  isStart: boolean
  isFinish: boolean
  isWall: boolean
  isWeight: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  heuristic: number
  previousNode: GridNode | null
  weight: number
}

export type Algorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs'

export type MazeType = 'recursive-division' | 'random'

export type VisualizationSpeed = 'slow' | 'medium' | 'fast'

export interface AlgorithmResult {
  visitedNodesInOrder: GridNode[]
  shortestPath: GridNode[]
}

export interface VisualizationState {
  isVisualizing: boolean
  isGeneratingMaze: boolean
  speed: VisualizationSpeed
}

export const SPEED_MAP: Record<VisualizationSpeed, number> = {
  slow: 50,
  medium: 20,
  fast: 5,
}

export const DEFAULT_WEIGHT = 5
