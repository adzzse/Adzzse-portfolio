## Library

Utilities and algorithms shared across visualizations.

### Structure

- `grid.js`: Canvas/grid helpers (sizing, pointers, drawing, neighbors, text, fades).
- `algorithms/heap.js`: Reusable binary min-heap (`MinHeap`).
- `algorithms/pathfinding.js`: Pathfinding primitives (heuristics, neighbors, search, path reconstruction).

### grid.js

- `createIndex(cols)`: Returns `(x, y) => y * cols + x`.
- `pointerToCellFromEvent(evt, canvas, cellSize, cols, rows)`: Maps mouse/pointer to `{x, y}`.
- `resizeCanvasToDpr(canvas, ctxRef, onResize)`: Resizes canvas to device pixel ratio and updates `ctxRef.current`.
- `computeGridSize(canvas, cellSize)`: `{ cols, rows }` that fit the canvas.
- `drawGridLines(ctx, cols, rows, cellSize)`: Light grid overlay.
- `get4Neighbors(x, y, cols, rows)`: Cardinal neighbors.
- `drawArrow(...)`: Draws an arrow scaled to cell size.
- `drawCenteredText(...)`: Centers text in a cell.
- `computeFadeAlpha(startAt, now, duration, min?, max?)`: Linear fade helper.

### algorithms/heap.js

```js
import { MinHeap } from '../lib/algorithms/heap'

const heap = new MinHeap(item => item.priority)
heap.push({ value: 'A', priority: 3 })
heap.push({ value: 'B', priority: 1 })
heap.push({ value: 'C', priority: 2 })

console.log(heap.size) // 3
console.log(heap.pop()) // { value: 'B', priority: 1 }
```

API
- `new MinHeap(keySelector = n => n.f)`
- `.push(item)`
- `.pop()` → smallest or `undefined`
- `.clear()`
- `.size` (getter)

### algorithms/pathfinding.js

Exports
- `toIndex(x, y, cols)`
- `manhattan(ax, ay, bx, by)`
- `get4Neighbors(x, y, cols, rows)`
- `function* search({ cols, rows, grid, start, end, mode })`
- `reconstructPath(prev, endIdx)`

Example
```js
import { search, toIndex, reconstructPath } from '../lib/algorithms/pathfinding'

const cols = 10, rows = 10
const grid = new Uint8Array(cols * rows) // 0 empty, 1 wall
const start = { x: 0, y: 0 }
const end = { x: 9, y: 9 }

const it = search({ cols, rows, grid, start, end, mode: 'astar' })
let last
for (const step of it) {
  last = step // step = { visited, prev, gScore }
}

const endIdx = toIndex(end.x, end.y, cols)
const path = reconstructPath(last.prev, endIdx)
// `path` is an array of indices from start to end
```

Notes
- `grid` uses `1` as a wall; any non-`1` is traversable with unit cost.
- `mode` can be `'dijkstra' | 'astar' | 'greedy'`.

