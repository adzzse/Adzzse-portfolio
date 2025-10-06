import React from 'react'
import CellularAutomaton from './CellularAutomaton'
import { initLangtonsAnt, stepLangtonsAnt } from '../lib/automata/langtonsAnt'

function LangtonsAnt() {
  // Custom step function for Langton's Ant using lib
  const stepFunction = (grid, cols, rows, customState, setCustomState, wrapEdges) => {
    const { grid: newGrid, state } = stepLangtonsAnt(grid, cols, rows, customState, wrapEdges)
    setCustomState(state)
    return { grid: newGrid }
  }

  // Custom initial state setup
  const initialState = (cols, rows) => initLangtonsAnt(cols, rows)

  // Custom drawing function for Langton's Ant
  const customDraw = (ctx, canvas, grid, cols, rows, cellSize, showGrid, index, customState) => {
    if (!ctx || !canvas) return
    
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const { antX, antY, direction } = customState

    // Background
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#0f1738'
    ctx.fillRect(0, 0, width, height)

    // Cells
    ctx.fillStyle = '#6ee7ff'
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[index(x, y)] === 1) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    // Ant
    const antPx = antX * cellSize
    const antPy = antY * cellSize
    ctx.fillStyle = '#ffd166'
    ctx.fillRect(antPx, antPy, cellSize, cellSize)

    // Direction indicator (small triangle)
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    const cx = antPx + cellSize / 2
    const cy = antPy + cellSize / 2
    const r = Math.max(2, cellSize * 0.25)
    let dx = 0, dy = 0
    if (direction === 0) { dy = -r }
    else if (direction === 1) { dx = r }
    else if (direction === 2) { dy = r }
    else if (direction === 3) { dx = -r }
    ctx.arc(cx + dx, cy + dy, Math.max(1, r * 0.6), 0, Math.PI * 2)
    ctx.fill()

    // Grid
    if (showGrid && cellSize >= 8) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= cols; x++) {
        const gx = x * cellSize + 0.5
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, rows * cellSize)
      }
      for (let y = 0; y <= rows; y++) {
        const gy = y * cellSize + 0.5
        ctx.moveTo(0, gy)
        ctx.lineTo(cols * cellSize, gy)
      }
      ctx.stroke()
    }
  }

  // Custom controls for Langton's Ant
  const customControls = ({ setGrid, cols, rows, customState, setCustomState }) => {
    const handleCenterAnt = () => {
      setCustomState(prev => ({
        ...prev,
        antX: Math.floor(cols / 2),
        antY: Math.floor(rows / 2),
        direction: 0
      }))
    }

    return (
      <button onClick={handleCenterAnt}>Center</button>
    )
  }

  const aboutContent = (
    <>
      <p>
        Langton's Ant is a two-dimensional Turing machine. 
        The ant turns 90°/-90° on white/black, flips the color and moves forward.
      </p>
      <ul>
        <li>Play/Pause to run the simulation.</li>
        <li>Step advances one move.</li>
        <li>Clear resets the board.</li>
        <li>Random seeds the board with random tiles; use Center Ant to re-center the ant.</li>
      </ul>
    </>
  )

  return (
    <CellularAutomaton
      title="Langton's Ant"
      tagline="Simple rules, surprising chaos, and long highways."
      rules="https://en.wikipedia.org/wiki/Langton%27s_ant"
      cellColor="#6ee7ff"
      backgroundColor="#0f1738"
      aboutContent={aboutContent}
      stepFunction={stepFunction}
      initialState={initialState}
      customDraw={customDraw}
      customControls={customControls}
      maxFps={120}
    />
  )
}

export default LangtonsAnt


