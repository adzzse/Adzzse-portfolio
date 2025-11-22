import type { GridNode, AlgorithmResult } from '../types'
import { getNeighbors, reconstructPath, MinHeap } from './utils'

/**
 * Dijkstra's Algorithm - finds the shortest path using a priority queue
 * Supports weighted nodes
 */
export const dijkstra = (
  grid: GridNode[][],
  startNode: GridNode,
  finishNode: GridNode
): AlgorithmResult => {
  const visitedNodesInOrder: GridNode[] = []

  // Reset all nodes
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity
      node.previousNode = null
      node.isVisited = false
    }
  }

  startNode.distance = 0

  // Create min heap with distance comparison
  const unvisitedNodes = new MinHeap((a: GridNode, b: GridNode) => a.distance - b.distance)
  unvisitedNodes.push(startNode)

  while (!unvisitedNodes.isEmpty()) {
    const currentNode = unvisitedNodes.pop()!

    // Skip if already visited (can happen with heap)
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
      const newDistance = currentNode.distance + weight

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance
        neighbor.previousNode = currentNode
        unvisitedNodes.push(neighbor)
      }
    }
  }

  // No path found
  return { visitedNodesInOrder, shortestPath: [] }
}
