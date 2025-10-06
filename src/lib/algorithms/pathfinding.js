import { MinHeap } from './heap'

// Grid index helpers
export function toIndex(x, y, cols) {
  return y * cols + x
}

export function manhattan(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

export function get4Neighbors(x, y, cols, rows) {
  const out = []
  if (x > 0) out.push({ x: x - 1, y })
  if (x < cols - 1) out.push({ x: x + 1, y })
  if (y > 0) out.push({ x, y: y - 1 })
  if (y < rows - 1) out.push({ x, y: y + 1 })
  return out
}

// Run a search and yield steps; consumers can step incrementally or run to completion.
// grid: Uint8Array where 1 means wall; others are walkable
export function* search({ cols, rows, grid, start, end, mode = 'dijkstra' }) {
  const heap = new MinHeap((n) => n.f)
  const size = cols * rows
  const visited = new Uint8Array(size)
  const prev = new Int32Array(size)
  prev.fill(-1)
  const gScore = new Float32Array(size)
  gScore.fill(Infinity)

  const startIdx = toIndex(start.x, start.y, cols)
  const h0 = manhattan(start.x, start.y, end.x, end.y)
  const f0 = mode === 'astar' ? h0 : mode === 'greedy' ? h0 : 0
  heap.push({ x: start.x, y: start.y, g: 0, f: f0 })
  gScore[startIdx] = 0

  while (true) {
    const cur = heap.pop()
    if (!cur) return { found: false, prev, gScore }
    const ci = toIndex(cur.x, cur.y, cols)
    // Skip walls on pop; mark visited when popped
    if (grid[ci] === 1) continue
    if (visited[ci]) continue
    visited[ci] = 1
    if (cur.x === end.x && cur.y === end.y) return { found: true, prev, gScore }
    for (const n of get4Neighbors(cur.x, cur.y, cols, rows)) {
      const ni = toIndex(n.x, n.y, cols)
      if (grid[ni] === 1) continue
      const g = cur.g + 1
      if (g < gScore[ni]) {
        prev[ni] = ci
        gScore[ni] = g
        let f
        if (mode === 'astar') f = g + manhattan(n.x, n.y, end.x, end.y)
        else if (mode === 'greedy') f = manhattan(n.x, n.y, end.x, end.y)
        else f = g
        heap.push({ x: n.x, y: n.y, g, f })
      }
    }
    yield { visited, prev, gScore }
  }
}

export function reconstructPath(prev, endIdx) {
  const path = []
  let p = endIdx
  while (p !== -1) {
    path.push(p)
    p = prev[p]
  }
  path.reverse()
  return path
}


