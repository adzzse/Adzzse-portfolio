import type { GridNode, AlgorithmResult } from '../types'
import { getNeighbors, reconstructPath, manhattanDistance, MinHeap } from './utils'

/**
 * A* Algorithm - finds the shortest path using heuristic (Manhattan distance)
 * Supports weighted nodes
 */
export const astar = (
  grid: GridNode[][],
  startNode: GridNode,
  finishNode: GridNode
): AlgorithmResult => {
  const visitedNodesInOrder: GridNode[] = []

  // Reset all nodes
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity
      node.heuristic = manhattanDistance(node, finishNode)
      node.previousNode = null
      node.isVisited = false
    }
  }

  startNode.distance = 0

  // Create min heap with f-score comparison (distance + heuristic)
  const openSet = new MinHeap(
    (a: GridNode, b: GridNode) => a.distance + a.heuristic - (b.distance + b.heuristic)
  )
  openSet.push(startNode)

  while (!openSet.isEmpty()) {
    const currentNode = openSet.pop()!

    // Skip if already visited
    if (currentNode.isVisited) continue

    // Skip walls
    if (currentNode.isWall) continue

    // If distance is still infinity, we're trapped
    if (currentNode.distance === Infinity) {
      return { visitedNodesInOrder, shortestPath: [] }
    }

    currentNode.isVisited = true
    visitedNodesInOrder.push(currentNode)

    // Found the finish node
    if (currentNode === finishNode) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(finishNode),
      }
    }

    // Update neighbors
    const neighbors = getNeighbors(currentNode, grid)
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue

      // Account for weighted nodes
      const weight = neighbor.isWeight ? neighbor.weight : 1
      const tentativeDistance = currentNode.distance + weight

      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance
        neighbor.previousNode = currentNode
        openSet.push(neighbor)
      }
    }
  }

  // No path found
  return { visitedNodesInOrder, shortestPath: [] }
}
