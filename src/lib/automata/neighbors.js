// Neighbor helpers for cellular automata

export function index2D(x, y, cols) {
  return y * cols + x
}

export function countMooreNeighbors(x, y, grid, cols, rows, wrapEdges = true) {
  let count = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      let nx = x + dx
      let ny = y + dy
      if (wrapEdges) {
        if (nx < 0) nx = cols - 1
        else if (nx >= cols) nx = 0
        if (ny < 0) ny = rows - 1
        else if (ny >= rows) ny = 0
        count += grid[index2D(nx, ny, cols)]
      } else {
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
        count += grid[index2D(nx, ny, cols)]
      }
    }
  }
  return count
}


