import React, { useCallback, useEffect, useRef, useState } from 'react'
import { resizeCanvasToDpr, computeGridSize, pointerToCellFromEvent, drawGridLines, drawArrow, drawCenteredText, computeFadeAlpha, get4Neighbors } from '../lib/grid'
import { MinHeap } from '../lib/algorithms/heap'
import GridLayout from './GridLayout'

function Pathfinding() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const simRafRef = useRef(null)
  const drawRafRef = useRef(null)

  // Grid/UI state
  const [cellSize, setCellSize] = useState(18)
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [algo, setAlgo] = useState('dijkstra')
  const [speed, setSpeed] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [showDistances, setShowDistances] = useState(false)
  const [showDirections, setShowDirections] = useState(false)

  // Cells: 0 empty, 1 wall
  const [grid, setGrid] = useState(new Uint8Array(0))
  const [start, setStart] = useState({ x: 5, y: 5 })
  const [end, setEnd] = useState({ x: 25, y: 15 })

  // Search state
  const openRef = useRef(new MinHeap((n) => n.f)) // {x,y,g,f}
  const visitedRef = useRef(new Uint8Array(0))
  const visitedAtRef = useRef(new Float64Array(0))
  const prevRef = useRef(new Int32Array(0))
  const gScoreRef = useRef(new Float32Array(0))
  const doneRef = useRef(false)
  const lastStepAt = useRef(0)
  // Precomputed path helpers to reduce per-frame allocations
  const pathPosRef = useRef(new Int32Array(0)) // index -> position in path or -1
  const pathNextRef = useRef(new Int32Array(0)) // index -> next index in path or -1

  // Visuals
  const hoverCellRef = useRef(null)
  const selectedAtRef = useRef(new Float64Array(0))
  const pathRef = useRef([])
  const pathRevealStartRef = useRef(0)
  const dragModeRef = useRef(null) // 'start' | 'end' | null

  // Helpers
  const index = useCallback((x, y) => y * cols + x, [cols])
  const pointerToCell = useCallback((evt) => pointerToCellFromEvent(evt, canvasRef.current, cellSize, cols, rows), [cellSize, cols, rows])

  const recomputeGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { cols: nc, rows: nr } = computeGridSize(canvas, cellSize)
    if (nc === cols && nr === rows) return
    const newSize = nc * nr
    const newGrid = new Uint8Array(newSize)
    for (let y = 0; y < Math.min(rows, nr); y++) {
      for (let x = 0; x < Math.min(cols, nc); x++) {
        newGrid[y * nc + x] = grid[y * cols + x] || 0
      }
    }
    setCols(nc)
    setRows(nr)
    setGrid(newGrid)
    visitedRef.current = new Uint8Array(newSize)
    visitedAtRef.current = new Float64Array(newSize)
    prevRef.current = new Int32Array(newSize)
    prevRef.current.fill(-1)
    gScoreRef.current = new Float32Array(newSize)
    gScoreRef.current.fill(Infinity)
    openRef.current = new MinHeap((n) => n.f)
    selectedAtRef.current = new Float64Array(newSize)
    doneRef.current = false
    pathRef.current = []
  }, [cellSize, cols, rows, grid])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    resizeCanvasToDpr(canvas, ctxRef, recomputeGrid)
  }, [recomputeGrid])

  useEffect(() => {
    resizeCanvas()
    const ro = new ResizeObserver(() => { resizeCanvas(); draw() })
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [resizeCanvas])

  useEffect(() => { recomputeGrid() }, [cellSize, recomputeGrid])

  const heuristic = useCallback((x, y) => Math.abs(x - end.x) + Math.abs(y - end.y), [end])
  const pushOpen = useCallback((n) => { openRef.current.push(n) }, [])
  const popOpen = useCallback(() => openRef.current.pop(), [])
  const neighbors = useCallback((x, y) => get4Neighbors(x, y, cols, rows), [cols, rows])

  const resetSearch = useCallback(() => {
    const size = cols * rows
    visitedRef.current = new Uint8Array(size)
    visitedAtRef.current = new Float64Array(size)
    prevRef.current = new Int32Array(size)
    prevRef.current.fill(-1)
    gScoreRef.current = new Float32Array(size)
    gScoreRef.current.fill(Infinity)
    openRef.current = new MinHeap((n) => n.f)
    doneRef.current = false
    pathRef.current = []
    pathPosRef.current = new Int32Array(size)
    pathPosRef.current.fill(-1)
    pathNextRef.current = new Int32Array(size)
    pathNextRef.current.fill(-1)
  }, [cols, rows])

  const startSearch = useCallback(() => {
    resetSearch()
    const s = { x: start.x, y: start.y }
    const si = index(s.x, s.y)
    const h0 = heuristic(s.x, s.y)
    const f0 = algo === 'astar' ? h0 : (algo === 'greedy' ? h0 : 0)
    pushOpen({ x: s.x, y: s.y, g: 0, f: f0 })
    gScoreRef.current[si] = 0
    setIsRunning(true)
    lastStepAt.current = performance.now()
  }, [resetSearch, start, index, pushOpen, algo, heuristic])

  const step = useCallback(() => {
    if (doneRef.current) return
    const cur = popOpen()
    if (!cur) { doneRef.current = true; setIsRunning(false); return }
    const ci = index(cur.x, cur.y)
    // Skip walls
    if (grid[ci] === 1) { return }
    // Mark visited on pop
    visitedRef.current[ci] = 1
    visitedAtRef.current[ci] = performance.now()
    if (cur.x === end.x && cur.y === end.y) {
      const endIdx = index(end.x, end.y)
      const path = []
      let p = endIdx
      while (p !== -1) { path.push(p); p = prevRef.current[p] }
      path.reverse()
      pathRef.current = path
      pathRevealStartRef.current = performance.now()
      // Precompute path position and next maps for the entire path once
      const size = cols * rows
      if (pathPosRef.current.length !== size) {
        pathPosRef.current = new Int32Array(size)
        pathNextRef.current = new Int32Array(size)
      }
      pathPosRef.current.fill(-1)
      pathNextRef.current.fill(-1)
      for (let k = 0; k < path.length; k++) {
        const curIdx = path[k]
        pathPosRef.current[curIdx] = k
        const nextIdx = k + 1 < path.length ? path[k + 1] : -1
        pathNextRef.current[curIdx] = nextIdx
      }
      doneRef.current = true
      setIsRunning(false)
      return
    }
    for (const n of neighbors(cur.x, cur.y)) {
      const ni = index(n.x, n.y)
      if (visitedRef.current[ni] === 0 && grid[ni] !== 1) {
        prevRef.current[ni] = ci
        const g = cur.g + 1
        gScoreRef.current[ni] = g
        let f
        if (algo === 'astar') f = g + heuristic(n.x, n.y)
        else if (algo === 'greedy') f = heuristic(n.x, n.y)
        else f = g
        pushOpen({ x: n.x, y: n.y, g, f })
      }
    }
  }, [algo, end, grid, heuristic, index, neighbors, popOpen, pushOpen])

  const animate = useCallback((ts) => {
    if (!isRunning) return
    const ms = 1000 / speed
    if (ts - lastStepAt.current >= ms) { step(); lastStepAt.current = ts }
    simRafRef.current = requestAnimationFrame(animate)
  }, [isRunning, speed, step])

  useEffect(() => {
    if (isRunning) simRafRef.current = requestAnimationFrame(animate)
    return () => { if (simRafRef.current) cancelAnimationFrame(simRafRef.current) }
  }, [isRunning, animate])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const now = performance.now()

    // Determine how much of the path is currently revealed
    let shownPathCount = 0
    if (pathRef.current.length > 0) {
      const elapsed = now - pathRevealStartRef.current
      const per = 30
      shownPathCount = Math.min(pathRef.current.length, Math.max(1, Math.floor(elapsed / per)))
    }
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0f1738'
    ctx.fillRect(0, 0, w, h)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = index(x, y)
        const px = x * cellSize
        const py = y * cellSize
        if (visitedRef.current[i]) {
          const t0 = visitedAtRef.current[i] || now
          const dt = Math.max(0, now - t0)
          const a = Math.min(1, dt / 300)
          ctx.fillStyle = `rgba(110,231,255,${0.08 + 0.22 * a})`
          ctx.fillRect(px, py, cellSize, cellSize)
        }
        if (grid[i] === 1) {
          const t0 = selectedAtRef.current[i] || 0
          const dt = now - t0
          const FADE_MS = 300
          let alpha = 1
          if (t0 > 0 && dt < FADE_MS) {
            alpha = 0.2 + 0.8 * (dt / FADE_MS)
          }
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle = '#6ee7ff'
          ctx.fillRect(px, py, cellSize, cellSize)
          ctx.restore()
        }
        const selAt = selectedAtRef.current[i] || 0
        if (selAt > 0) {
          const dt = now - selAt
          if (dt < 500) {
            const k = 1 - dt / 500
            ctx.save()
            ctx.strokeStyle = `rgba(255,255,255,${0.3 * k})`
            ctx.lineWidth = Math.max(1, Math.min(3, cellSize * 0.15 * k + 1))
            ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1)
            ctx.restore()
          }
        }

        // Draw direction arrow and distance text for visited nodes (non-walls)
        if (visitedRef.current[i] && grid[i] !== 1) {
          const prev = prevRef.current[i]
          const cx = px + cellSize / 2
          const cy = py + cellSize / 2
          // Direction arrow: only on currently revealed path nodes
          if (showDirections && cellSize >= 10 && shownPathCount > 0) {
            const pos = pathPosRef.current[i] ?? -1
            if (pos !== -1 && pos + 1 < shownPathCount) {
              const nextIdx = pathNextRef.current[i]
              const nx = nextIdx % cols
              const ny = Math.floor(nextIdx / cols)
              const angle = Math.atan2(ny - y, nx - x)
              const shaftLen = Math.max(3, cellSize * 0.35)
              const headLen = Math.max(2, cellSize * 0.2)
              const endX = cx + Math.cos(angle) * shaftLen
              const endY = cy + Math.sin(angle) * shaftLen
              const leftAngle = angle + 2.5
              const rightAngle = angle - 2.5
              const leftX = endX + Math.cos(leftAngle) * headLen
              const leftY = endY + Math.sin(leftAngle) * headLen
              const rightX = endX + Math.cos(rightAngle) * headLen
              const rightY = endY + Math.sin(rightAngle) * headLen
              ctx.save()
              ctx.strokeStyle = 'rgba(255,255,255,0.65)'
              ctx.lineWidth = Math.max(1, Math.min(2, cellSize * 0.08))
              ctx.beginPath()
              ctx.moveTo(cx, cy)
              ctx.lineTo(endX, endY)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(endX, endY)
              ctx.lineTo(leftX, leftY)
              ctx.moveTo(endX, endY)
              ctx.lineTo(rightX, rightY)
              ctx.stroke()
              ctx.restore()
            }
          }
          // Distance text (g score)
          if (showDistances && cellSize >= 16) {
            const g = gScoreRef.current[i]
            if (isFinite(g)) drawCenteredText(ctx, String(g), cx, cy, cellSize)
          }
        }
      }
    }

    if (pathRef.current.length > 0) {
      const elapsed = now - pathRevealStartRef.current
      const per = 30
      const fadeMs = 300
      const show = Math.min(pathRef.current.length, Math.max(1, Math.floor(elapsed / per)))
      ctx.save()
      for (let k = 0; k < show; k++) {
        const idx = pathRef.current[k]
        const cx = idx % cols
        const cy = Math.floor(idx / cols)
        const px = cx * cellSize
        const py = cy * cellSize
        const appearAt = pathRevealStartRef.current + k * per
        const fillA = computeFadeAlpha(appearAt, now, fadeMs, 0.2, 0.7)
        const strokeA = computeFadeAlpha(appearAt, now, fadeMs, 0.15, 0.6)
        ctx.fillStyle = `rgba(34,197,94,${fillA})`
        ctx.fillRect(px, py, cellSize, cellSize)
        ctx.strokeStyle = `rgba(34,197,94,${strokeA})`
        ctx.lineWidth = Math.max(1, Math.min(2, cellSize * 0.12))
        ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1)
      }
      ctx.restore()
    }

    // Start/End
    ctx.fillStyle = '#f59e0b'
    ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize)
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize)

    if (showGrid && cellSize >= 8) drawGridLines(ctx, cols, rows, cellSize)

    if (hoverCellRef.current) {
      const { x, y } = hoverCellRef.current
      ctx.save()
      ctx.strokeStyle = 'rgba(34,211,238,0.6)'
      ctx.lineWidth = Math.max(1, Math.min(2, cellSize * 0.12))
      ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1)
      ctx.restore()
    }
  }, [cellSize, cols, rows, index, grid, showGrid, start, end, showDistances, showDirections])

  const drawLoop = useCallback(() => { draw(); drawRafRef.current = requestAnimationFrame(drawLoop) }, [draw])
  useEffect(() => { drawRafRef.current = requestAnimationFrame(drawLoop); return () => { if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current) } }, [drawLoop])

  // Interaction
  const [isDown, setIsDown] = useState(false)
  const [paintWall, setPaintWall] = useState(1)
  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDown(true)
    const cell = pointerToCell(e)
    if (!cell) return
    // Start dragging if clicking on start or end
    if (cell.x === start.x && cell.y === start.y) {
      dragModeRef.current = 'start'
      return
    }
    if (cell.x === end.x && cell.y === end.y) {
      dragModeRef.current = 'end'
      return
    }
    if (e.shiftKey) { setStart(cell); resetSearch(); return }
    if (e.ctrlKey || e.metaKey) { setEnd(cell); resetSearch(); return }
    const i = index(cell.x, cell.y)
    const nv = grid[i] === 1 ? 0 : 1
    setPaintWall(nv)
    setGrid(prev => { const ng = new Uint8Array(prev); ng[i] = nv; return ng })
    selectedAtRef.current[i] = performance.now()
    resetSearch()
  }, [pointerToCell, index, grid, resetSearch, start, end])
  const onMouseMove = useCallback((e) => {
    const cell = pointerToCell(e)
    hoverCellRef.current = cell
    if (!cell || !isDown) return
    // Handle dragging start/end positions
    if (dragModeRef.current === 'start') {
      if (grid[index(cell.x, cell.y)] !== 1) { // avoid placing start on wall
        setStart(cell)
        resetSearch()
      }
      return
    }
    if (dragModeRef.current === 'end') {
      if (grid[index(cell.x, cell.y)] !== 1) { // avoid placing end on wall
        setEnd(cell)
        resetSearch()
      }
      return
    }
    if (e.shiftKey || e.ctrlKey || e.metaKey) return
    const i = index(cell.x, cell.y)
    setGrid(prev => { const ng = new Uint8Array(prev); if (ng[i] !== paintWall) { ng[i] = paintWall; selectedAtRef.current[i] = performance.now() } return ng })
  }, [pointerToCell, isDown, index, paintWall, resetSearch, grid])
  const onMouseUp = useCallback(() => { setIsDown(false); dragModeRef.current = null }, [])
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    c.addEventListener('mousedown', onMouseDown)
    c.addEventListener('mousemove', onMouseMove)
    c.addEventListener('mouseleave', () => { hoverCellRef.current = null; setIsDown(false); dragModeRef.current = null })
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      c.removeEventListener('mousedown', onMouseDown)
      c.removeEventListener('mousemove', onMouseMove)
      c.removeEventListener('mouseleave', () => { hoverCellRef.current = null; setIsDown(false); dragModeRef.current = null })
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseDown, onMouseMove, onMouseUp])

  // Controls
  const clearWalls = () => { setGrid(new Uint8Array(cols * rows)); resetSearch() }
  const startPause = () => { if (isRunning) { setIsRunning(false) } else if (openRef.current.size === 0 && !doneRef.current) { startSearch() } else { setIsRunning(true) } }

  const controls = (
    <>
      <div className="control-row main-controls">
        <button onClick={startPause} className="primary">{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={step}>Step</button>
        <button onClick={() => { setIsRunning(false); resetSearch() }}>Reset</button>
        <button onClick={clearWalls}>Clear Walls</button>
      </div>
      <div className="control-row options">
        <label className="switch-label">
          <span className="switch-text">Show distances</span>
          <div className="switch-container">
            <input 
              type="checkbox" 
              checked={showDistances} 
              onChange={(e) => setShowDistances(e.target.checked)}
              className="switch-input"
            />
            <span className="switch-slider"></span>
          </div>
        </label>
        <label className="switch-label">
          <span className="switch-text">Show directions</span>
          <div className="switch-container">
            <input 
              type="checkbox" 
              checked={showDirections} 
              onChange={(e) => setShowDirections(e.target.checked)}
              className="switch-input"
            />
            <span className="switch-slider"></span>
          </div>
        </label>
      </div>
      <div className="control-row">
        <label className="inline">
          Algorithm
          <select value={algo} onChange={(e) => { setAlgo(e.target.value); resetSearch() }}>
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A*</option>
            <option value="greedy">Greedy Best-First</option>
          </select>
        </label>
      </div>
      <div className="control-row">
        <label className="inline">
          Speed
          <input type="range" min="1" max="240" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))}
            onWheel={(e) => { e.preventDefault(); const d = e.deltaY > 0 ? -1 : 1; setSpeed(p => Math.max(1, Math.min(120, p + d))) }} />
          <span>{speed} fps</span>
        </label>
      </div>
      <div className="control-row">
        <label className="inline">
          Cell Size
          <input type="range" min="8" max="32" value={cellSize} onChange={(e) => setCellSize(parseInt(e.target.value))}
            onWheel={(e) => { e.preventDefault(); const d = e.deltaY > 0 ? -1 : 1; setCellSize(p => Math.max(8, Math.min(32, p + d))) }} />
          <span>{cellSize} px</span>
        </label>
      </div>
      <div className="control-row">
        <p className="muted">Tip: Shift-click sets Start, Ctrl-click sets End. Drag to draw walls.</p>
      </div>
    </>
  )

  const footerLinks = (
    <a href="https://github.com/dannndi/pathfinding-visualization" target="_blank" rel="noopener noreferrer">Inspired by pathfinding-visualization</a>
  )

  return (
    <GridLayout
      title="Pathfinding"
      tagline="Interactive pathfinding visualization"
      canvasRef={canvasRef}
      controls={controls}
      footerLinks={footerLinks}
    />
  )
}

export default Pathfinding

