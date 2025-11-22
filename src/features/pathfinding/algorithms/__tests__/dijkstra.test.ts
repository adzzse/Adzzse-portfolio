import { describe, it, expect } from 'vitest'
import { dijkstra } from '../dijkstra'
import type { GridNode } from '../../types'

// Helper to create a simple grid
const createTestGrid = (rows: number, cols: number): GridNode[][] => {
  const grid: GridNode[][] = []
  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = []
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: false,
        isFinish: false,
        isWall: false,
        isWeight: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previousNode: null,
        weight: 5,
      })
    }
    grid.push(currentRow)
  }
  return grid
}

describe('Dijkstra Algorithm', () => {
  it('should find shortest path in a simple grid', () => {
    const grid = createTestGrid(5, 5)
    const start = grid[0]![0]!
    const finish = grid[0]![4]!
    start.isStart = true
    finish.isFinish = true

    const result = dijkstra(grid, start, finish)

    expect(result.visitedNodesInOrder.length).toBeGreaterThan(0)
    expect(result.shortestPath.length).toBeGreaterThan(0)
    expect(result.shortestPath[0]).toBe(start)
    expect(result.shortestPath[result.shortestPath.length - 1]).toBe(finish)
  })

  it('should return empty path when no path exists', () => {
    const grid = createTestGrid(3, 3)
    const start = grid[0]![0]!
    const finish = grid[2]![2]!
    start.isStart = true
    finish.isFinish = true

    // Block the path completely
    grid[0]![1]!.isWall = true
    grid[1]![0]!.isWall = true
    grid[1]![1]!.isWall = true

    const result = dijkstra(grid, start, finish)

    expect(result.shortestPath).toEqual([])
  })

  it('should handle weighted nodes correctly', () => {
    const grid = createTestGrid(3, 3)
    const start = grid[0]![0]!
    const finish = grid[0]![2]!
    start.isStart = true
    finish.isFinish = true

    // Make middle weighted
    grid[0]![1]!.isWeight = true
    grid[0]![1]!.weight = 10

    const result = dijkstra(grid, start, finish)

    expect(result.shortestPath.length).toBeGreaterThan(0)
    expect(result.shortestPath[result.shortestPath.length - 1]).toBe(finish)
  })
})
