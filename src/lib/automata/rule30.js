import { index2D } from './neighbors'

export function initRule30(cols, rows) {
  const grid = new Uint8Array(cols * rows)
  if (cols > 0 && rows > 0) {
    const centerX = Math.floor(cols / 2)
    grid[index2D(centerX, 0, cols)] = 1
  }
  return grid
}

export function stepRule30(grid, cols, rows, wrapEdges = true) {
  const next = new Uint8Array(cols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let left, center, right
      if (wrapEdges) {
        left = grid[index2D((x - 1 + cols) % cols, y, cols)]
        center = grid[index2D(x, y, cols)]
        right = grid[index2D((x + 1) % cols, y, cols)]
      } else {
        left = x > 0 ? grid[index2D(x - 1, y, cols)] : 0
        center = grid[index2D(x, y, cols)]
        right = x < cols - 1 ? grid[index2D(x + 1, y, cols)] : 0
      }
      const pattern = (left << 2) | (center << 1) | right
      const newState = (30 >> pattern) & 1
      next[index2D(x, y, cols)] = newState
    }
  }
  return next
}


