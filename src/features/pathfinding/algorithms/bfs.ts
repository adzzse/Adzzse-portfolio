import type { GridNode, AlgorithmResult } from '../types'
import { getNeighbors, reconstructPath } from './utils'

/**
 * Breadth-First Search (BFS) - finds the shortest path (unweighted)
 * Guarantees shortest path for unweighted graphs
 */
export const bfs = (
  grid: GridNode[][],
  startNode: GridNode,
  finishNode: GridNode
): AlgorithmResult => {
  const visitedNodesInOrder: GridNode[] = []

  // Reset all nodes
  for (const row of grid) {
    for (const node of row) {
      node.previousNode = null
      node.isVisited = false
    }
  }

  const queue: GridNode[] = [startNode]
  startNode.isVisited = true

  while (queue.length > 0) {
    const currentNode = queue.shift()!
    visitedNodesInOrder.push(currentNode)

    // Found the finish node
    if (currentNode === finishNode) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(finishNode),
      }
    }

    // Explore neighbors
    const neighbors = getNeighbors(currentNode, grid)
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue

      neighbor.isVisited = true
      neighbor.previousNode = currentNode
      queue.push(neighbor)
    }
  }

  // No path found
  return { visitedNodesInOrder, shortestPath: [] }
}
