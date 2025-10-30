import React, { useRef, useEffect, useState, useCallback } from 'react'
import { pointerToCellFromEvent, resizeCanvasToDpr, computeGridSize, drawGridLines } from '../lib/grid'
import GridLayout from './GridLayout'

type ExtraControlsFn = (args: { setGrid: React.Dispatch<React.SetStateAction<Uint8Array>>; cols: number; rows: number; grid: Uint8Array; customState: any; setCustomState: React.Dispatch<React.SetStateAction<any>> }) => React.ReactNode
type CustomControlsFn = (args: { setGrid: React.Dispatch<React.SetStateAction<Uint8Array>>; cols: number; rows: number; customState: any; setCustomState: React.Dispatch<React.SetStateAction<any>> }) => React.ReactNode

type StepFunction = (
  grid: Uint8Array,
  cols: number,
  rows: number,
  customState: any,
  setCustomState: React.Dispatch<React.SetStateAction<any>>,
  wrapEdges: boolean,
  index: (x: number, y: number) => number
) => { grid?: Uint8Array; next?: Uint8Array } | void

type InitialStateFn = (cols: number, rows: number, grid: Uint8Array) => any

type CustomDrawFn = (
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement | null,
  grid: Uint8Array,
  cols: number,
  rows: number,
  cellSize: number,
  showGrid: boolean,
  index: (x: number, y: number) => number,
  customState: any
) => void

type CellularAutomatonProps = {
  title: string
  tagline?: string
  rules?: string
  birthRules?: number[]
  survivalRules?: number[]
  cellColor?: string
  backgroundColor?: string
  extraControls?: React.ReactNode | ExtraControlsFn | null
  aboutContent?: React.ReactNode | null
  stepFunction?: StepFunction | null
  initialState?: InitialStateFn | null
  customDraw?: CustomDrawFn | null
  cellStates?: number
  customControls?: React.ReactNode | CustomControlsFn | null
  maxFps?: number
}

function CellularAutomaton({ 
  title, 
  tagline, 
  rules, 
  birthRules, 
  survivalRules, 
  cellColor = '#6ee7ff',
  backgroundColor = '#0f1738',
  extraControls = null,
  aboutContent = null,
  stepFunction = null,
  initialState = null,
  customDraw = null,
  cellStates = 2,
  customControls = null,
  maxFps = 120
}: CellularAutomatonProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false)
  const [cellSize, setCellSize] = useState(12)
  const [showGrid, setShowGrid] = useState(true)
  const [wrapEdges, setWrapEdges] = useState(true)
  const [fps, setFps] = useState(10)
  
  // Grid state
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [grid, setGrid] = useState<Uint8Array>(new Uint8Array(0))
  const [next, setNext] = useState<Uint8Array>(new Uint8Array(0))
  
  // Custom state for automata that need additional data
  const [customState, setCustomState] = useState<any>({})
  
  const lastStepAt = useRef(0)
  
  // Canvas context
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  // Visual effect state (timestamps for recently changed cells)
  const recentChangedAtRef = useRef<Float64Array>(new Float64Array(0))
  const visualAnimationRef = useRef<number | null>(null)
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null)
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    ctx.current = canvas.getContext('2d')
    resizeCanvas()
  }, [])
  
  // Resize handling - exactly like the working code
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !ctx.current) return
    resizeCanvasToDpr(canvas, ctx as any, recomputeGridSize)
  }, [])
  
  // Grid size computation - exactly like the working code
  const recomputeGridSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const { cols: newCols, rows: newRows } = computeGridSize(canvas, cellSize)
    
    if (newCols === cols && newRows === rows) return
    
    const oldCols = cols
    const oldRows = rows
    const oldGrid = grid
    
    setCols(newCols)
    setRows(newRows)
    
    const newSize = newCols * newRows
    const newGrid = new Uint8Array(newSize)
    const newNext = new Uint8Array(newSize)
    const newRecent = new Float64Array(newSize)
    
    // Preserve old content centered if possible
    if (oldCols > 0 && oldRows > 0) {
      const copyCols = Math.min(oldCols, newCols)
      const copyRows = Math.min(oldRows, newRows)
      const colOffset = Math.floor((newCols - copyCols) / 2)
      const rowOffset = Math.floor((newRows - copyRows) / 2)
      
      for (let y = 0; y < copyRows; y++) {
        for (let x = 0; x < copyCols; x++) {
          const oldIdx = y * oldCols + x
          const newIdx = (y + rowOffset) * newCols + (x + colOffset)
          newGrid[newIdx] = oldGrid[oldIdx]
        }
      }
    }
    
    setGrid(newGrid)
    setNext(newNext)
    recentChangedAtRef.current = newRecent
    
    // Initialize custom state if provided
    if (initialState) {
      const newCustomState = initialState(newCols, newRows, newGrid)
      if (newCustomState) {
        setCustomState(newCustomState)
      }
    }
  }, [cols, rows, grid, cellSize, initialState])
  
  // Update grid size when cell size changes
  useEffect(() => {
    recomputeGridSize()
  }, [cellSize, recomputeGridSize])
  
  // Grid index helper
  const index = useCallback((x: number, y: number) => y * cols + x, [cols])
  
  // Count neighbors (for standard cellular automata)
  const countNeighbors = useCallback((x: number, y: number) => {
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
          count += grid[index(nx, ny)]
        } else {
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
          count += grid[index(nx, ny)]
        }
      }
    }
    return count
  }, [cols, rows, grid, wrapEdges, index])
  
  // Default step function for Conway-style automata
  const defaultStep = useCallback(() => {
    const newNext = new Uint8Array(cols * rows)
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = index(x, y)
        const alive = grid[i] === 1
        const neighbors = countNeighbors(x, y)
        let newState = 0
        
        if (alive) {
          newState = survivalRules && survivalRules.includes(neighbors) ? 1 : 0
        } else {
          newState = birthRules && birthRules.includes(neighbors) ? 1 : 0
        }
        newNext[i] = newState
        if (newState !== grid[i]) {
          recentChangedAtRef.current[i] = performance.now()
        }
      }
    }
    
    setNext(newNext)
    setGrid(newNext)
  }, [cols, rows, grid, countNeighbors, index, birthRules, survivalRules])
  
  // Game step with custom rules or custom step function
  const step = useCallback(() => {
    if (stepFunction) {
      // Use custom step function
      const result = stepFunction(grid, cols, rows, customState, setCustomState, wrapEdges, index)
      if (result && result.grid) {
        setGrid(result.grid)
        if (result.next) setNext(result.next)
      }
    } else if (birthRules && survivalRules) {
      // Use default Conway-style rules
      defaultStep()
    }
  }, [stepFunction, grid, cols, rows, customState, setCustomState, wrapEdges, index, birthRules, survivalRules, defaultStep])
  
  // Default draw function
  const defaultDraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !ctx.current) return
    
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const now = performance.now()
    
    ctx.current.clearRect(0, 0, width, height)
    ctx.current.fillStyle = backgroundColor
    ctx.current.fillRect(0, 0, width, height)
    
    // Draw live cells with fade-in for recent changes
    ctx.current.save()
    for (let y = 0; y < rows; y++) {
      const rowStart = y * cols
      for (let x = 0; x < cols; x++) {
        if (grid[rowStart + x] === 1) {
          const cellX = x * cellSize
          const cellY = y * cellSize
          const changedAt = recentChangedAtRef.current[rowStart + x] || 0
          const dt = now - changedAt
          const FADE_MS = 300
          let alpha = 1
          if (dt > 0 && dt < FADE_MS) {
            alpha = 0.2 + 0.8 * (dt / FADE_MS)
          }
          ctx.current.globalAlpha = alpha
          ctx.current.fillStyle = cellColor
          ctx.current.fillRect(cellX, cellY, cellSize, cellSize)
        }
      }
    }
    ctx.current.restore()
    
    // Recently changed highlight overlay (fade out)
    {
      const HIGHLIGHT_MS = 600
      ctx.current.save()
      for (let y = 0; y < rows; y++) {
        const rowStart = y * cols
        for (let x = 0; x < cols; x++) {
          const i = rowStart + x
          const changedAt = recentChangedAtRef.current[i] || 0
          const dt = now - changedAt
          if (dt > 0 && dt < HIGHLIGHT_MS) {
            const t = 1 - dt / HIGHLIGHT_MS
            // Green overlay, fading out
            ctx.current.globalAlpha = Math.max(0, Math.min(1, t)) * 0.8
            ctx.current.fillStyle = '#a3e635'
            ctx.current.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
          }
        }
      }
      ctx.current.restore()
    }
    
    if (showGrid && cellSize >= 8) {
      drawGridLines(ctx.current, cols, rows, cellSize)
    }

    // Hover cell selection pulse
    if (hoverCell && hoverCell.x >= 0 && hoverCell.x < cols && hoverCell.y >= 0 && hoverCell.y < rows) {
      const pulse = 0.5 + 0.5 * Math.sin(now / 200)
      const x = hoverCell.x * cellSize
      const y = hoverCell.y * cellSize
      ctx.current.save()
      ctx.current.strokeStyle = `rgba(34, 211, 238, ${0.3 + 0.5 * pulse})`
      ctx.current.lineWidth = Math.max(1, Math.min(3, cellSize * 0.15 + pulse))
      ctx.current.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1)
      ctx.current.restore()
    }
  }, [grid, cols, rows, cellSize, showGrid, backgroundColor, cellColor, hoverCell])
  
  // Draw function - use custom or default
  const draw = useCallback(() => {
    if (customDraw) {
      customDraw(ctx.current, canvasRef.current, grid, cols, rows, cellSize, showGrid, index, customState)
    } else {
      defaultDraw()
    }
  }, [customDraw, defaultDraw, grid, cols, rows, cellSize, showGrid, index, customState])
  
  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!isPlaying) return
    
    const msPerFrame = 1000 / fps
    if (timestamp - lastStepAt.current >= msPerFrame) {
      step()
      lastStepAt.current = timestamp
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [isPlaying, fps, step])

  // Visual animation loop (always on) to support hover pulse and fade-outs
  const visualAnimate = useCallback(() => {
    // Redraw every frame for visual effects
    draw()
    visualAnimationRef.current = requestAnimationFrame(visualAnimate)
  }, [draw])
  
  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animate])

  // Start/stop the visual RAF independent of simulation playing state
  useEffect(() => {
    visualAnimationRef.current = requestAnimationFrame(visualAnimate)
    return () => {
      if (visualAnimationRef.current) cancelAnimationFrame(visualAnimationRef.current)
    }
  }, [visualAnimate])
  
  // Redraw when needed
  useEffect(() => {
    draw()
  }, [draw])
  
  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
      draw()
    })
    
    resizeObserver.observe(canvas)
    
    return () => resizeObserver.disconnect()
  }, [resizeCanvas, draw])
  
  // Pointer interactions - exactly like the working code
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [paintValue, setPaintValue] = useState(1)
  
  const pointerToCell = useCallback((evt: any) => {
    return pointerToCellFromEvent(evt, canvasRef.current, cellSize, cols, rows)
  }, [cols, rows, cellSize])
  
  const setCell = useCallback((x: number, y: number, value: number) => {
    setGrid(prev => {
      const i = index(x, y)
      const newGrid = new Uint8Array(prev)
      if (newGrid[i] !== value) {
        newGrid[i] = value
        // mark recently changed
        recentChangedAtRef.current[i] = performance.now()
      }
      return newGrid
    })
  }, [index])
  
  const handlePointerDown = useCallback((evt: any) => {
    evt.preventDefault()
    setIsPointerDown(true)
    setPaintValue((evt.button === 2 || evt.altKey) ? 0 : 1)
    
    const cell = pointerToCell(evt)
    if (cell) {
      setCell(cell.x, cell.y, paintValue)
    }
  }, [pointerToCell, setCell, paintValue])
  
  const handlePointerMove = useCallback((evt: any) => {
    const cell = pointerToCell(evt)
    setHoverCell(cell)
    draw()
    if (!isPointerDown) return
    if (cell) {
      setCell(cell.x, cell.y, paintValue)
    }
  }, [isPointerDown, pointerToCell, setCell, paintValue, draw])
  
  const handlePointerUp = useCallback(() => {
    setIsPointerDown(false)
  }, [])
  
  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.addEventListener('mousedown', handlePointerDown as any)
    canvas.addEventListener('mousemove', handlePointerMove as any)
    canvas.addEventListener('mouseenter', (e: any) => { setHoverCell(pointerToCell(e)); draw() })
    canvas.addEventListener('mouseleave', () => { setHoverCell(null); draw() })
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    
    window.addEventListener('mouseup', handlePointerUp as any)
    
    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown as any)
      canvas.removeEventListener('mousemove', handlePointerMove as any)
      canvas.removeEventListener('mouseenter', (e: any) => { setHoverCell(pointerToCell(e)); draw() })
      canvas.removeEventListener('mouseleave', () => { setHoverCell(null); draw() })
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault())
      window.removeEventListener('mouseup', handlePointerUp as any)
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp, draw, pointerToCell])
  
  // Touch support
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0] as any)
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0] as any)
      }
    }
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handlePointerUp as any)
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handlePointerUp as any)
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp])
  
  // Control handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleStep = () => { if (!isPlaying) step() }
  const handleClear = () => {
    const newGrid = new Uint8Array(cols * rows)
    setGrid(newGrid)
    
    // Reset custom state if initialState is provided
    if (initialState) {
      const newCustomState = initialState(cols, rows, newGrid)
      if (newCustomState) {
        setCustomState(newCustomState)
      }
    }
  }
  const handleRandom = () => {
    const newGrid = new Uint8Array(cols * rows)
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = Math.random() < 0.3 ? 1 : 0
    }
    setGrid(newGrid)
    // mark all initialized cells as changed to show overlay
    const now = performance.now()
    if (recentChangedAtRef.current.length !== newGrid.length) {
      recentChangedAtRef.current = new Float64Array(newGrid.length)
    }
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i] === 1) recentChangedAtRef.current[i] = now
    }
  }
  
  const controls = (
    <>
      <div className="control-row main-controls">
        <button 
          onClick={handlePlayPause} 
          className="primary"
        >
          {isPlaying ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleStep}>Step</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleRandom}>Random</button>
      </div>
      {extraControls && (
        <div className="control-row">
          {typeof extraControls === 'function' 
            ? (extraControls as ExtraControlsFn)({ setGrid, cols, rows, grid, customState, setCustomState })
            : extraControls}
        </div>
      )}
      {customControls && (
        <div className="control-row">
          {typeof customControls === 'function' 
            ? (customControls as CustomControlsFn)({ setGrid, cols, rows, customState, setCustomState })
            : customControls}
        </div>
      )}
      <div className="control-row">
        <label className="inline">
          Speed
          <input 
            type="range" 
            min="1" 
            max={maxFps} 
            value={fps} 
            onChange={(e) => setFps(parseInt((e.target as HTMLInputElement).value))}
            onWheel={(e) => {
              e.preventDefault()
              const delta = (e as any).deltaY > 0 ? -1 : 1
              setFps(prev => Math.max(1, Math.min(maxFps || 120, prev + delta)))
            }}
          />
          <span>{fps} fps</span>
        </label>
      </div>
      <div className="control-row">
        <label className="inline">
          Cell Size
          <input 
            type="range" 
            min="5" 
            max="30" 
            value={cellSize} 
            onChange={(e) => setCellSize(parseInt((e.target as HTMLInputElement).value))}
            onWheel={(e) => {
              e.preventDefault()
              const delta = (e as any).deltaY > 0 ? -1 : 1
              setCellSize(prev => Math.max(5, Math.min(30, prev + delta)))
            }}
          />
          <span>{cellSize} px</span>
        </label>
      </div>
      <div className="control-row options">
        <label className="switch-label">
          <span className="switch-text">Wrap edges</span>
          <div className="switch-container">
            <input 
              type="checkbox" 
              checked={wrapEdges} 
              onChange={(e) => setWrapEdges((e.target as HTMLInputElement).checked)}
              className="switch-input"
            />
            <span className="switch-slider"></span>
          </div>
        </label>
        <label className="switch-label">
          <span className="switch-text">Show grid</span>
          <div className="switch-container">
            <input 
              type="checkbox" 
              checked={showGrid} 
              onChange={(e) => setShowGrid((e.target as HTMLInputElement).checked)}
              className="switch-input"
            />
            <span className="switch-slider"></span>
          </div>
        </label>
      </div>
      {aboutContent && (
        <details className="about">
          <summary>About {title}</summary>
          {aboutContent}
        </details>
      )}
    </>
  )

  const footerLinks = (
    <>
      {rules && <a href={rules} target="_blank" rel="noopener noreferrer">Learn more</a>}
      {rules && <span>·</span>}
      <a href="https://github.com/adzzse/Adzzse-portfolio" target="_blank" rel="noopener noreferrer">View source</a>
    </>
  )

  return (
    <GridLayout 
      title={title}
      tagline={tagline}
      canvasRef={canvasRef}
      controls={controls}
      footerLinks={footerLinks}
    />
  )
}

export default CellularAutomaton
