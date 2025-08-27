import React from 'react'
import CellularAutomaton from './CellularAutomaton'

function Highlife() {
  const aboutContent = (
    <>
    <p>
        Highlife is a cellular automaton with rules B36/S23, meaning:
      </p>
      <ul>
        <li><strong>Birth (B36):</strong> Dead cells with exactly 3 or 6 neighbors become alive</li>
        <li><strong>Survival (S23):</strong> Live cells with 2 or 3 neighbors survive</li>
        <li><strong>Death:</strong> All other cells die or stay dead</li>
      </ul>
      
    </>
  )

  // Create a replicator pattern for Highlife
  const createReplicator = (setGrid, cols, rows) => {
    const newGrid = new Uint8Array(cols * rows)
    
    // Create a simple replicator pattern in the center
    const centerX = Math.floor(cols / 2)
    const centerY = Math.floor(rows / 2)
    
    // Simple replicator pattern (small glider-like structure)
    const pattern = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ]
    
    // Place the pattern in the center
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[0].length; x++) {
        const gridX = centerX - 1 + x
        const gridY = centerY - 1 + y
        
        if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
          const index = gridY * cols + gridX
          newGrid[index] = pattern[y][x]
        }
      }
    }
    
    setGrid(newGrid)
  }

  const extraControls = ({ setGrid, cols, rows }) => (
    <button 
      onClick={() => createReplicator(setGrid, cols, rows)}
    >
      Replicator
    </button>
  )

  return (
    <CellularAutomaton
      title="Highlife"
      tagline="B36/S23 cellular automaton - creates replicators and interesting patterns"
      rules="https://conwaylife.com/wiki/HighLife"
      birthRules={[3, 6]}
      survivalRules={[2, 3]}
      cellColor="#ff6b9d"
      backgroundColor="#1a0f2e"
      aboutContent={aboutContent}
      extraControls={extraControls}
    />
  )
}

export default Highlife
