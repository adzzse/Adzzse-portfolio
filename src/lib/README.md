## Library

Utilities and algorithms shared across visualizations.

### Structure

- `grid.js`: Canvas/grid helpers (sizing, pointers, drawing, neighbors, text, fades).
- `algorithms/heap.js`: Reusable binary min-heap (`MinHeap`).
- `algorithms/pathfinding.js`: Pathfinding primitives (heuristics, neighbors, search, path reconstruction).
 - `automata/`:
   - `neighbors.js`: 2D indexing and Moore neighbor counting.
   - `conway.js`: Conway-style step (`stepConway`).
   - `langtonsAnt.js`: Init and step for Langton's Ant.
   - `rule30.js`: Init and step for Rule 30.

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

### automata

Conway
```js
import { stepConway } from '../lib/automata/conway'
const next = stepConway(grid, cols, rows, [3], [2,3], true)
```

Langton's Ant
```js
import { initLangtonsAnt, stepLangtonsAnt } from '../lib/automata/langtonsAnt'
let state = initLangtonsAnt(cols, rows)
const { grid: next, state: nextState } = stepLangtonsAnt(grid, cols, rows, state, true)
```

Rule 30
```js
import { initRule30, stepRule30 } from '../lib/automata/rule30'
let grid = initRule30(cols, rows)
grid = stepRule30(grid, cols, rows, true)
```

Library overview
- src/lib/grid.js: Canvas/grid utilities shared by visualizations.
- src/lib/algorithms/heap.js: Reusable binary min-heap.
- src/lib/algorithms/pathfinding.js: Pathfinding primitives (heuristics, neighbors, search generator, path reconstruction).
- src/lib/grid.js
- createIndex(cols): Returns an indexer function (x, y) -> y * cols + x for flattening 2D grid coordinates into 1D indices.
- pointerToCellFromEvent(evt, canvas, cellSize, cols, rows): Converts a pointer/mouse event on a canvas into a grid cell {x, y} or null if out of bounds.
- resizeCanvasToDpr(canvas, ctxRef, onResize): Resizes the canvas to device pixel ratio; updates ctxRef.current with a 2D context scaled to DPR, then calls onResize.
- computeGridSize(canvas, cellSize): Computes { cols, rows } that fit in the canvas’ CSS size for a given cellSize.
- drawGridLines(ctx, cols, rows, cellSize): Draws faint grid lines to delineate cells.
- get4Neighbors(x, y, cols, rows): Returns up/down/left/right neighbors within bounds.
- drawArrow(ctx, fromCx, fromCy, toCx, toCy, cellSize, color?): Renders an arrow between two cell centers with reasonable scaling.
- drawCenteredText(ctx, text, cx, cy, cellSize, color?): Draws centered text within a cell, font size derived from cellSize.
- computeFadeAlpha(startAtMs, nowMs, durationMs, minAlpha?, maxAlpha?): Linear fade alpha from minAlpha to maxAlpha over durationMs since startAtMs.
- src/lib/algorithms/heap.js
- class MinHeap: Binary min-heap for arbitrary items.
- constructor(keySelector = n => n.f): Accepts a function to extract the sort key (defaults to the f property).
- clear(): Empties the heap.
- get size: Number of items.
- push(node): Inserts an item and restores heap order.
- pop(): Removes and returns the smallest item (by key) or undefined if empty.
- Internal methods #siftUp(i) and #siftDown(i) maintain heap invariants.
- src/lib/algorithms/pathfinding.js
- toIndex(x, y, cols): 2D-to-1D index helper for grid arrays.
- manhattan(ax, ay, bx, by): Manhattan distance heuristic (|dx| + |dy|); used by A* and Greedy Best-First.
- get4Neighbors(x, y, cols, rows): Cardinal neighbors within bounds (duplicated locally for algorithm use).
- function* search({ cols, rows, grid, start, end, mode = 'dijkstra' }): Generator that performs pathfinding:
- Uses a MinHeap of nodes {x, y, g, f}.
- Initializes visited, prev (filled with -1), and gScore (Infinity).
- Pushes start with f determined by mode:
- dijkstra: f = g
- astar: f = g + manhattan(...)
- greedy: f = manhattan(...)
- Expands nodes, updates prev and gScore, pushes neighbors.
- Yields progress { visited, prev, gScore } each iteration so UIs can animate.
- Returns { found: boolean, prev, gScore } when done (on success or exhaustion).
- reconstructPath(prev, endIdx): Rebuilds the path by following prev links from endIdx back to the source; returns the sequence of indices from start to end.