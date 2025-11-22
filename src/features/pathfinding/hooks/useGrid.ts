import { useState, useCallback } from 'react'
import type { GridNode } from '../types'
import { GRID_ROWS, GRID_COLS, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL, NODE_WEIGHT } from '../constants'

interface UseGridReturn {
  grid: GridNode[][]
  startNode: GridNode
  finishNode: GridNode
  createGrid: () => void
  resetGrid: () => void
  clearPath: () => void
  clearBoard: () => void
  updateNodeWall: (row: number, col: number, isWall: boolean) => void
  updateNodeWeight: (row: number, col: number, isWeight: boolean) => void
  updateStartNode: (row: number, col: number) => void
  updateFinishNode: (row: number, col: number) => void
  setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>
}

export const useGrid = (): UseGridReturn => {
  const createInitialGrid = (): GridNode[][] => {
    const grid: GridNode[][] = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: GridNode[] = []
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          isWall: false,
          isWeight: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          heuristic: 0,
          previousNode: null,
          weight: NODE_WEIGHT,
        })
      }
      grid.push(currentRow)
    }
    return grid
  }

  const [grid, setGrid] = useState<GridNode[][]>(createInitialGrid)
  const [startNode, setStartNode] = useState<GridNode>(grid[START_NODE_ROW]![START_NODE_COL]!)
  const [finishNode, setFinishNode] = useState<GridNode>(grid[FINISH_NODE_ROW]![FINISH_NODE_COL]!)

  const createGrid = useCallback(() => {
    const newGrid = createInitialGrid()
    setGrid(newGrid)
    setStartNode(newGrid[START_NODE_ROW]![START_NODE_COL]!)
    setFinishNode(newGrid[FINISH_NODE_ROW]![FINISH_NODE_COL]!)
  }, [])

  const resetGrid = useCallback(() => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        distance: Infinity,
        heuristic: 0,
        previousNode: null,
        isVisited: false,
        isPath: false,
      }))
    )
    setGrid(newGrid)
  }, [grid])

  const clearPath = useCallback(() => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previousNode: null,
      }))
    )
    setGrid(newGrid)
  }, [grid])

  const clearBoard = useCallback(() => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
        isWeight: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previousNode: null,
      }))
    )
    setGrid(newGrid)
  }, [grid])

  const updateNodeWall = useCallback((row: number, col: number, isWall: boolean) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((node) => ({ ...node })))
      newGrid[row]![col]!.isWall = isWall
      if (isWall) {
        newGrid[row]![col]!.isWeight = false
      }
      return newGrid
    })
  }, [])

  const updateNodeWeight = useCallback((row: number, col: number, isWeight: boolean) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((node) => ({ ...node })))
      newGrid[row]![col]!.isWeight = isWeight
      if (isWeight) {
        newGrid[row]![col]!.isWall = false
      }
      return newGrid
    })
  }, [])

  const updateStartNode = useCallback((row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((node) => ({ ...node })))
      // Clear old start
      newGrid[startNode.row]![startNode.col]!.isStart = false
      // Set new start
      newGrid[row]![col]!.isStart = true
      newGrid[row]![col]!.isWall = false
      newGrid[row]![col]!.isWeight = false
      setStartNode(newGrid[row]![col]!)
      return newGrid
    })
  }, [startNode])

  const updateFinishNode = useCallback((row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((node) => ({ ...node })))
      // Clear old finish
      newGrid[finishNode.row]![finishNode.col]!.isFinish = false
      // Set new finish
      newGrid[row]![col]!.isFinish = true
      newGrid[row]![col]!.isWall = false
      newGrid[row]![col]!.isWeight = false
      setFinishNode(newGrid[row]![col]!)
      return newGrid
    })
  }, [finishNode])

  return {
    grid,
    startNode,
    finishNode,
    createGrid,
    resetGrid,
    clearPath,
    clearBoard,
    updateNodeWall,
    updateNodeWeight,
    updateStartNode,
    updateFinishNode,
    setGrid,
  }
}
