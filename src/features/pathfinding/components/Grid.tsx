import React from 'react'
import Node from './Node'
import type { GridNode } from '../types'

interface GridProps {
  grid: GridNode[][]
  onMouseDown: (row: number, col: number) => void
  onMouseEnter: (row: number, col: number) => void
  onMouseUp: () => void
}

const Grid: React.FC<GridProps> = ({ grid, onMouseDown, onMouseEnter, onMouseUp }) => {
  return (
    <div
      className="inline-block border-2 border-gray-400 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg"
      role="grid"
      aria-label="Pathfinding grid"
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node, nodeIdx) => (
            <Node
              key={nodeIdx}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
