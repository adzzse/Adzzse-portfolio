import React, { useRef, useEffect, useState, useCallback } from 'react'

function CellularAutomaton({ 
  title, 
  tagline, 
  rules, 
  birthRules, 
  survivalRules, 
  cellColor = '#6ee7ff',
  backgroundColor = '#0f1738',
  extraControls = null,
  aboutContent = null
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false)
  const [cellSize, setCellSize] = useState(12)
  const [showGrid, setShowGrid] = useState(true)
  const [wrapEdges, setWrapEdges] = useState(true)
  const [fps, setFps] = useState(10)
  
  // Grid state
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [grid, setGrid] = useState(new Uint8Array(0))
  const [next, setNext] = useState(new Uint8Array(0))
  
  const lastStepAt = useRef(0)
  
  // Canvas context
  const ctx = useRef(null)
  
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
    
    const dpr = window.devicePixelRatio || 1
    const cssWidth = canvas.clientWidth
    const cssHeight = canvas.clientHeight
    const displayWidth = Math.floor(cssWidth * dpr)
    const displayHeight = Math.floor(cssHeight * dpr)
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth
      canvas.height = displayHeight
      ctx.current.setTransform(dpr, 0, 0, dpr, 0, 0)
      recomputeGridSize()
    }
  }, [])
  
  // Grid size computation - exactly like the working code
  const recomputeGridSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const newCols = Math.max(1, Math.floor(width / cellSize))
    const newRows = Math.max(1, Math.floor(height / cellSize))
    
    if (newCols === cols && newRows === rows) return
    
    const oldCols = cols
    const oldRows = rows
    const oldGrid = grid
    
    setCols(newCols)
    setRows(newRows)
    
    const newGrid = new Uint8Array(newCols * newRows)
    const newNext = new Uint8Array(newCols * newRows)
    
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
  }, [cols, rows, grid, cellSize])
  
  // Update grid size when cell size changes
  useEffect(() => {
    recomputeGridSize()
  }, [cellSize, recomputeGridSize])
  
  // Grid index helper
  const index = useCallback((x, y) => y * cols + x, [cols])
  
  // Count neighbors
  const countNeighbors = useCallback((x, y) => {
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
  
  // Game step with custom rules
  const step = useCallback(() => {
    const newNext = new Uint8Array(cols * rows)
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = index(x, y)
        const alive = grid[i] === 1
        const neighbors = countNeighbors(x, y)
        let newState = 0
        
        if (alive) {
          // Survival: check if neighbors count is in survival rules
          newState = survivalRules.includes(neighbors) ? 1 : 0
        } else {
          // Birth: check if neighbors count is in birth rules
          newState = birthRules.includes(neighbors) ? 1 : 0
        }
        newNext[i] = newState
      }
    }
    
    setNext(newNext)
    setGrid(newNext)
  }, [cols, rows, grid, countNeighbors, index, birthRules, survivalRules])
  
  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !ctx.current) return
    
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    
    ctx.current.clearRect(0, 0, width, height)
    ctx.current.fillStyle = backgroundColor
    ctx.current.fillRect(0, 0, width, height)
    
    ctx.current.fillStyle = cellColor
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[index(x, y)] === 1) {
          ctx.current.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }
    
    if (showGrid && cellSize >= 8) {
      ctx.current.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.current.lineWidth = 1
      ctx.current.beginPath()
      
      for (let x = 0; x <= cols; x++) {
        const gx = x * cellSize + 0.5
        ctx.current.moveTo(gx, 0)
        ctx.current.lineTo(gx, rows * cellSize)
      }
      
      for (let y = 0; y <= rows; y++) {
        const gy = y * cellSize + 0.5
        ctx.current.moveTo(0, gy)
        ctx.current.lineTo(cols * cellSize, gy)
      }
      
      ctx.current.stroke()
    }
  }, [grid, cols, rows, cellSize, showGrid, index, backgroundColor, cellColor])
  
  // Animation loop
  const animate = useCallback((timestamp) => {
    if (!isPlaying) return
    
    const msPerFrame = 1000 / fps
    if (timestamp - lastStepAt.current >= msPerFrame) {
      step()
      lastStepAt.current = timestamp
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [isPlaying, fps, step])
  
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
  
  const pointerToCell = useCallback((evt) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(((evt.clientX - rect.left) / rect.width) * canvas.clientWidth / cellSize)
    const y = Math.floor(((evt.clientY - rect.top) / rect.height) * canvas.clientHeight / cellSize)
    
    if (x < 0 || x >= cols || y < 0 || y >= rows) return null
    return { x, y }
  }, [cols, rows, cellSize])
  
  const setCell = useCallback((x, y, value) => {
    setGrid(prev => {
      const newGrid = new Uint8Array(prev)
      newGrid[index(x, y)] = value
      return newGrid
    })
  }, [index])
  
  const handlePointerDown = useCallback((evt) => {
    evt.preventDefault()
    setIsPointerDown(true)
    setPaintValue((evt.button === 2 || evt.altKey) ? 0 : 1)
    
    const cell = pointerToCell(evt)
    if (cell) {
      setCell(cell.x, cell.y, paintValue)
    }
  }, [pointerToCell, setCell, paintValue])
  
  const handlePointerMove = useCallback((evt) => {
    if (!isPointerDown) return
    
    const cell = pointerToCell(evt)
    if (cell) {
      setCell(cell.x, cell.y, paintValue)
    }
  }, [isPointerDown, pointerToCell, setCell, paintValue])
  
  const handlePointerUp = useCallback(() => {
    setIsPointerDown(false)
  }, [])
  
  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.addEventListener('mousedown', handlePointerDown)
    canvas.addEventListener('mousemove', handlePointerMove)
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    
    window.addEventListener('mouseup', handlePointerUp)
    
    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown)
      canvas.removeEventListener('mousemove', handlePointerMove)
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault())
      window.removeEventListener('mouseup', handlePointerUp)
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp])
  
  // Touch support
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0])
      }
    }
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0])
      }
    }
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handlePointerUp)
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp])
  
  // Control handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleStep = () => { if (!isPlaying) step() }
  const handleClear = () => setGrid(new Uint8Array(cols * rows))
  const handleRandom = () => {
    const newGrid = new Uint8Array(cols * rows)
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = Math.random() < 0.3 ? 1 : 0
    }
    setGrid(newGrid)
  }
  
  return (
    <div className="cellular-automaton">
      <header className="site-header">
        <h2>{title}</h2>
        <p className="tagline">{tagline}</p>
      </header>
      
      <div className="layout">
        <section className="board-section">
          <canvas 
            ref={canvasRef}
            aria-label={`${title} board`}
            role="img"
          />
        </section>
        
        <aside className="controls">
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
                ? extraControls({ setGrid, cols, rows, grid })
                : extraControls
              }
            </div>
          )}
          
          <div className="control-row">
            <label className="inline">
              Speed
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={fps} 
                onChange={(e) => setFps(parseInt(e.target.value))}
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
                onChange={(e) => setCellSize(parseInt(e.target.value))}
              />
              <span>{cellSize} px</span>
            </label>
          </div>
          
          <div className="control-row options">
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={wrapEdges} 
                onChange={(e) => setWrapEdges(e.target.checked)}
              />
              Wrap edges
            </label>
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={showGrid} 
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              Show grid
            </label>
          </div>
          
          {aboutContent && (
            <details className="about">
              <summary>About {title}</summary>
              {aboutContent}
            </details>
          )}
        </aside>
      </div>
      
      <footer className="site-footer">
        <a href={rules} target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
        <span>·</span>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          View source
        </a>
      </footer>
    </div>
  )
}

export default CellularAutomaton
