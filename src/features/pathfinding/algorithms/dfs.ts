import type { GridNode, AlgorithmResult } from '../types'
import { getNeighbors, reconstructPath } from './utils'

/**
 * Depth-First Search (DFS) - finds a path (not guaranteed to be shortest)
 * Uses stack-based approach (recursion converted to iteration for better control)
 */
export const dfs = (
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

  const stack: GridNode[] = [startNode]

  while (stack.length > 0) {
    const currentNode = stack.pop()!

    // Skip if already visited or is a wall
    if (currentNode.isVisited || currentNode.isWall) continue

    currentNode.isVisited = true
    visitedNodesInOrder.push(currentNode)

    // Found the finish node
    if (currentNode === finishNode) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(finishNode),
      }
    }

    // Explore neighbors (in reverse order to maintain consistent direction)
    const neighbors = getNeighbors(currentNode, grid).reverse()
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue
      neighbor.previousNode = currentNode
      stack.push(neighbor)
    }
  }

  // No path found
  return { visitedNodesInOrder, shortestPath: [] }
}
