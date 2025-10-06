import { countMooreNeighbors, index2D } from './neighbors'

export function stepConway(grid, cols, rows, birthRules, survivalRules, wrapEdges = true) {
  const next = new Uint8Array(cols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = index2D(x, y, cols)
      const alive = grid[i] === 1
      const n = countMooreNeighbors(x, y, grid, cols, rows, wrapEdges)
      let newState = 0
      if (alive) newState = survivalRules.includes(n) ? 1 : 0
      else newState = birthRules.includes(n) ? 1 : 0
      next[i] = newState
    }
  }
  return next
}


