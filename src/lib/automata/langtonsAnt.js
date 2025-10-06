import { index2D } from './neighbors'

export function initLangtonsAnt(cols, rows) {
  return {
    antX: Math.floor(cols / 2),
    antY: Math.floor(rows / 2),
    direction: 0, // 0=up,1=right,2=down,3=left
  }
}

export function stepLangtonsAnt(grid, cols, rows, state, wrapEdges = true) {
  const { antX, antY, direction } = state
  if (cols === 0 || rows === 0) return { grid, state }

  const i = index2D(antX, antY, cols)
  const current = grid[i] // 0 white, 1 black

  const newDir = current === 0 ? (direction + 1) % 4 : (direction + 3) % 4

  const newGrid = new Uint8Array(grid)
  newGrid[i] = current === 0 ? 1 : 0

  let nx = antX
  let ny = antY
  if (newDir === 0) ny -= 1
  else if (newDir === 1) nx += 1
  else if (newDir === 2) ny += 1
  else if (newDir === 3) nx -= 1

  if (wrapEdges) {
    if (nx < 0) nx = cols - 1
    else if (nx >= cols) nx = 0
    if (ny < 0) ny = rows - 1
    else if (ny >= rows) ny = 0
  } else {
    nx = Math.max(0, Math.min(cols - 1, nx))
    ny = Math.max(0, Math.min(rows - 1, ny))
  }

  return {
    grid: newGrid,
    state: { antX: nx, antY: ny, direction: newDir },
  }
}


