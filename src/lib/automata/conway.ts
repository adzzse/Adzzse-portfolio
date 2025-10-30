import { countMooreNeighbors, index2D } from './neighbors';

export interface ConwayRules {
  birthRules: number[];
  survivalRules: number[];
}

export interface ConwayConfig extends ConwayRules {
  wrapEdges: boolean;
}

export function createRandomGrid(cols: number, rows: number, density = 0.3): Uint8Array {
  const grid = new Uint8Array(cols * rows);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < density ? 1 : 0;
  }
  return grid;
}

export function stepConway(
  grid: Uint8Array,
  next: Uint8Array,
  cols: number,
  rows: number,
  rules: ConwayConfig | ConwayRules = CONWAY_RULES as ConwayConfig
): void {
  const { birthRules, survivalRules, wrapEdges = true } = rules as ConwayConfig;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = index2D(x, y, cols);
      const alive = grid[i] === 1;
      const neighbors = countMooreNeighbors(x, y, grid, cols, rows, wrapEdges);

      let state = 0;
      if (alive) {
        state = survivalRules.includes(neighbors) ? 1 : 0;
      } else {
        state = birthRules.includes(neighbors) ? 1 : 0;
      }
      next[i] = state;
    }
  }
}

export const CONWAY_RULES: ConwayRules = {
  birthRules: [3],
  survivalRules: [2, 3]
};

export const HIGHLIFE_RULES: ConwayRules = {
  birthRules: [3, 6],
  survivalRules: [2, 3]
};