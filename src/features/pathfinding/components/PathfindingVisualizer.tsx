import React, { useState, useCallback } from 'react'
import Grid from './Grid'
import ControlPanel from './ControlPanel'
import Legend from './Legend'
import { useGrid } from '../hooks/useGrid'
import { useVisualization } from '../hooks/useVisualization'
import { dijkstra } from '../algorithms/dijkstra'
import { astar } from '../algorithms/astar'
import { bfs } from '../algorithms/bfs'
import { dfs } from '../algorithms/dfs'
import { recursiveDivision } from '../mazes/recursiveDivision'
import { randomMaze } from '../mazes/randomMaze'
import type { Algorithm, MazeType } from '../types'

const PathfindingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra')
  const [mousePressed, setMousePressed] = useState(false)
  const [isDraggingStart, setIsDraggingStart] = useState(false)
  const [isDraggingFinish, setIsDraggingFinish] = useState(false)
  const [isAddingWeight, setIsAddingWeight] = useState(false)

  const {
    grid,
    startNode,
    finishNode,
    clearPath,
    clearBoard,
    updateNodeWall,
    updateNodeWeight,
    updateStartNode,
    updateFinishNode,
    setGrid,
  } = useGrid()

  const { isVisualizing, isGeneratingMaze, speed, setSpeed, animateAlgorithm, animateMaze } =
    useVisualization()

  const visualizeAlgorithm = useCallback(() => {
    clearPath()

    // Wait a tick for the grid to clear
    setTimeout(() => {
      let result
      switch (algorithm) {
        case 'dijkstra':
          result = dijkstra(grid, startNode, finishNode)
          break
        case 'astar':
          result = astar(grid, startNode, finishNode)
          break
        case 'bfs':
          result = bfs(grid, startNode, finishNode)
          break
        case 'dfs':
          result = dfs(grid, startNode, finishNode)
          break
        default:
          result = { visitedNodesInOrder: [], shortestPath: [] }
      }

      animateAlgorithm(result.visitedNodesInOrder, result.shortestPath, setGrid)
    }, 10)
  }, [algorithm, grid, startNode, finishNode, clearPath, animateAlgorithm, setGrid])

  const generateMaze = useCallback(
    (type: MazeType) => {
      clearBoard()

      setTimeout(() => {
        const walls =
          type === 'recursive-division'
            ? recursiveDivision(startNode.row, startNode.col, finishNode.row, finishNode.col)
            : randomMaze(startNode.row, startNode.col, finishNode.row, finishNode.col)

        animateMaze(walls, updateNodeWall)
      }, 10)
    },
    [startNode, finishNode, clearBoard, animateMaze, updateNodeWall]
  )

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (isVisualizing || isGeneratingMaze) return

      const node = grid[row]?.[col]
      if (!node) return

      if (node.isStart) {
        setIsDraggingStart(true)
        return
      }

      if (node.isFinish) {
        setIsDraggingFinish(true)
        return
      }

      setMousePressed(true)

      // Check if shift key is pressed (for weights)
      const shiftPressed = (window.event as MouseEvent)?.shiftKey || false
      setIsAddingWeight(shiftPressed)

      if (shiftPressed) {
        updateNodeWeight(row, col, !node.isWeight)
      } else {
        updateNodeWall(row, col, !node.isWall)
      }
    },
    [grid, isVisualizing, isGeneratingMaze, updateNodeWall, updateNodeWeight]
  )

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isVisualizing || isGeneratingMaze) return

      if (isDraggingStart) {
        updateStartNode(row, col)
        return
      }

      if (isDraggingFinish) {
        updateFinishNode(row, col)
        return
      }

      if (mousePressed) {
        const node = grid[row]?.[col]
        if (!node) return
        if (!node.isStart && !node.isFinish) {
          if (isAddingWeight) {
            updateNodeWeight(row, col, true)
          } else {
            updateNodeWall(row, col, true)
          }
        }
      }
    },
    [
      mousePressed,
      isDraggingStart,
      isDraggingFinish,
      isAddingWeight,
      grid,
      isVisualizing,
      isGeneratingMaze,
      updateNodeWall,
      updateNodeWeight,
      updateStartNode,
      updateFinishNode,
    ]
  )

  const handleMouseUp = useCallback(() => {
    setMousePressed(false)
    setIsDraggingStart(false)
    setIsDraggingFinish(false)
    setIsAddingWeight(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <ControlPanel
          algorithm={algorithm}
          speed={speed}
          isVisualizing={isVisualizing}
          isGeneratingMaze={isGeneratingMaze}
          onAlgorithmChange={setAlgorithm}
          onSpeedChange={setSpeed}
          onVisualize={visualizeAlgorithm}
          onClearPath={clearPath}
          onClearBoard={clearBoard}
          onGenerateMaze={generateMaze}
        />

        <div className="flex justify-center">
          <Grid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>

        <Legend />
      </div>
    </div>
  )
}

export default PathfindingVisualizer
