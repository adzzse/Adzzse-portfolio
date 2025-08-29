import React from 'react'
import CellularAutomaton from './CellularAutomaton'

function Rule30() {
  // Custom step function for Rule 30 (1D cellular automaton)
  const stepFunction = (grid, cols, rows, customState, setCustomState, wrapEdges, index) => {
    const newGrid = new Uint8Array(cols * rows)
    
    // Rule 30: 01111000 in binary
    // This creates a chaotic pattern from a simple rule
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let left, center, right
        
        if (wrapEdges) {
          left = grid[index((x - 1 + cols) % cols, y)]
          center = grid[index(x, y)]
          right = grid[index((x + 1) % cols, y)]
        } else {
          left = x > 0 ? grid[index(x - 1, y)] : 0
          center = grid[index(x, y)]
          right = x < cols - 1 ? grid[index(x + 1, y)] : 0
        }
        
        // Apply Rule 30
        const pattern = (left << 2) | (center << 1) | right
        const newState = (30 >> pattern) & 1
        newGrid[index(x, y)] = newState
      }
    }
    
    return { grid: newGrid }
  }

  // Custom initial state setup - single cell in the middle of the first row
  const initialState = (cols, rows, grid) => {
    const newGrid = new Uint8Array(cols * rows)
    // Set the middle cell of the first row to alive
    if (cols > 0 && rows > 0) {
      const centerX = Math.floor(cols / 2)
      newGrid[centerX] = 1 // First row, so y = 0, index = y * cols + x = 0 * cols + x = x
    }
    return { grid: newGrid }
  }

  // Custom drawing function for Rule 30
  const customDraw = (ctx, canvas, grid, cols, rows, cellSize, showGrid, index, customState) => {
    if (!ctx || !canvas) return
    
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Background
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#1a0f2e'
    ctx.fillRect(0, 0, width, height)

    // Cells - Rule 30 creates interesting patterns
    ctx.fillStyle = '#ff6b9d'
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[index(x, y)] === 1) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

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

  // Custom controls for Rule 30
  const customControls = ({ setGrid, cols, rows, customState, setCustomState }) => {
    const handleSingleCell = () => {
      const newGrid = new Uint8Array(cols * rows)
      if (cols > 0 && rows > 0) {
        const centerX = Math.floor(cols / 2)
        newGrid[centerX] = 1
      }
      setGrid(newGrid)
    }
    
    const handleRandomFirstRow = () => {
      const newGrid = new Uint8Array(cols * rows)
      if (cols > 0 && rows > 0) {
        for (let x = 0; x < cols; x++) {
          newGrid[x] = Math.random() < 0.3 ? 1 : 0
        }
      }
      setGrid(newGrid)
    }

    return (
      <>
        <button onClick={handleSingleCell}>Single Cell</button>
        <button onClick={handleRandomFirstRow}>Random First Row</button>
      </>
    )
  }

  const aboutContent = (
    <>
      <p>
        Rule 30 is a one-dimensional cellular automaton.
      </p>
      <ul>
        <li>Cell's next state depends on its current state and its two neighbors.</li>
        <li>Single Cell starts with one alive cell in the middle of the 1st row.</li>
        <li>Random First Row creates a random pattern in the 1st row.</li>
      </ul>
    </>
  )

  return (
    <CellularAutomaton
      title="Rule 30"
      tagline="Chaos one-dimensional cellular automaton"
      rules="https://en.wikipedia.org/wiki/Rule_30"
      cellColor="#ff6b9d"
      backgroundColor="#1a0f2e"
      aboutContent={aboutContent}
      stepFunction={stepFunction}
      initialState={initialState}
      customDraw={customDraw}
      customControls={customControls}
      maxFps={30}
    />
  )
}

export default Rule30
