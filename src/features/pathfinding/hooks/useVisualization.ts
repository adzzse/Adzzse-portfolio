import { useState, useCallback } from 'react'
import type { GridNode, VisualizationSpeed } from '../types'
import { SPEED_MAP } from '../types'

interface UseVisualizationReturn {
  isVisualizing: boolean
  isGeneratingMaze: boolean
  speed: VisualizationSpeed
  setSpeed: (speed: VisualizationSpeed) => void
  animateAlgorithm: (
    visitedNodes: GridNode[],
    shortestPath: GridNode[],
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>
  ) => Promise<void>
  animateMaze: (
    walls: { row: number; col: number }[],
    updateNodeWall: (row: number, col: number, isWall: boolean) => void
  ) => Promise<void>
}

export const useVisualization = (): UseVisualizationReturn => {
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false)
  const [speed, setSpeed] = useState<VisualizationSpeed>('medium')

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const animateAlgorithm = useCallback(
    async (
      visitedNodes: GridNode[],
      shortestPath: GridNode[],
      setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>
    ) => {
      setIsVisualizing(true)
      const delayMs = SPEED_MAP[speed]

      // Animate visited nodes
      for (let i = 0; i < visitedNodes.length; i++) {
        const node = visitedNodes[i]
        if (!node) continue
        if (!node.isStart && !node.isFinish) {
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => row.map((n) => ({ ...n })))
            const cell = newGrid[node.row]?.[node.col]
            if (cell) {
              cell.isVisited = true
            }
            return newGrid
          })
          await delay(delayMs)
        }
      }

      // Animate shortest path
      for (let i = 0; i < shortestPath.length; i++) {
        const node = shortestPath[i]
        if (!node) continue
        if (!node.isStart && !node.isFinish) {
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => row.map((n) => ({ ...n })))
            const cell = newGrid[node.row]?.[node.col]
            if (cell) {
              cell.isPath = true
            }
            return newGrid
          })
          await delay(delayMs * 2)
        }
      }

      setIsVisualizing(false)
    },
    [speed]
  )

  const animateMaze = useCallback(
    async (
      walls: { row: number; col: number }[],
      updateNodeWall: (row: number, col: number, isWall: boolean) => void
    ) => {
      setIsGeneratingMaze(true)
      const delayMs = Math.max(SPEED_MAP[speed] / 2, 1)

      for (const wall of walls) {
        updateNodeWall(wall.row, wall.col, true)
        await delay(delayMs)
      }

      setIsGeneratingMaze(false)
    },
    [speed]
  )

  return {
    isVisualizing,
    isGeneratingMaze,
    speed,
    setSpeed,
    animateAlgorithm,
    animateMaze,
  }
}
