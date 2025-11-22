import React from 'react'
import type { GridNode } from '../types'

interface NodeProps {
  node: GridNode
  onMouseDown: (row: number, col: number) => void
  onMouseEnter: (row: number, col: number) => void
  onMouseUp: () => void
}

const Node: React.FC<NodeProps> = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
  const getNodeClass = (): string => {
    const baseClass = 'w-6 h-6 border border-gray-300 dark:border-gray-700 transition-all duration-200'
    
    if (node.isStart) return `${baseClass} bg-green-500`
    if (node.isFinish) return `${baseClass} bg-red-500`
    if (node.isWall) return `${baseClass} bg-gray-900 dark:bg-gray-950 animate-wall`
    if (node.isWeight) return `${baseClass} bg-orange-400 relative after:content-['⚖'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-xs`
    if (node.isPath) return `${baseClass} bg-yellow-400 animate-path`
    if (node.isVisited) return `${baseClass} bg-blue-300 animate-visited`
    
    return `${baseClass} bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`
  }

  return (
    <div
      className={getNodeClass()}
      onMouseDown={() => onMouseDown(node.row, node.col)}
      onMouseEnter={() => onMouseEnter(node.row, node.col)}
      onMouseUp={onMouseUp}
      role="gridcell"
      aria-label={
        node.isStart
          ? 'Start node'
          : node.isFinish
          ? 'Finish node'
          : node.isWall
          ? 'Wall node'
          : node.isWeight
          ? 'Weighted node'
          : 'Empty node'
      }
    />
  )
}

export default Node
