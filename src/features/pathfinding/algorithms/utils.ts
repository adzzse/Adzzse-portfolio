import type { GridNode } from '../types'

/**
 * Calculate Manhattan distance heuristic for A* algorithm
 */
export const manhattanDistance = (node: GridNode, finish: GridNode): number => {
  return Math.abs(node.row - finish.row) + Math.abs(node.col - finish.col)
}

/**
 * Get all valid neighbors of a node (up, down, left, right)
 */
export const getNeighbors = (node: GridNode, grid: GridNode[][]): GridNode[] => {
  const neighbors: GridNode[] = []
  const { row, col } = node
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  if (rows === 0 || cols === 0) return neighbors

  // Up
  if (row > 0) {
    const neighbor = grid[row - 1]?.[col]
    if (neighbor) neighbors.push(neighbor)
  }
  // Down
  if (row < rows - 1) {
    const neighbor = grid[row + 1]?.[col]
    if (neighbor) neighbors.push(neighbor)
  }
  // Left
  if (col > 0) {
    const neighbor = grid[row]?.[col - 1]
    if (neighbor) neighbors.push(neighbor)
  }
  // Right
  if (col < cols - 1) {
    const neighbor = grid[row]?.[col + 1]
    if (neighbor) neighbors.push(neighbor)
  }

  return neighbors
}

/**
 * Reconstruct the shortest path by traversing previousNode pointers
 */
export const reconstructPath = (finishNode: GridNode): GridNode[] => {
  const path: GridNode[] = []
  let currentNode: GridNode | null = finishNode

  while (currentNode !== null) {
    path.unshift(currentNode)
    currentNode = currentNode.previousNode
  }

  return path
}

/**
 * MinHeap implementation for priority queue (used in Dijkstra and A*)
 */
export class MinHeap {
  private heap: GridNode[] = []
  private compare: (a: GridNode, b: GridNode) => number

  constructor(compare: (a: GridNode, b: GridNode) => number) {
    this.compare = compare
  }

  push(node: GridNode): void {
    this.heap.push(node)
    this.bubbleUp(this.heap.length - 1)
  }

  pop(): GridNode | undefined {
    if (this.heap.length === 0) return undefined
    if (this.heap.length === 1) return this.heap.pop()

    const min = this.heap[0]
    this.heap[0] = this.heap.pop()!
    this.bubbleDown(0)
    return min
  }

  isEmpty(): boolean {
    return this.heap.length === 0
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      const currentNode = this.heap[index]
      const parentNode = this.heap[parentIndex]
      if (!currentNode || !parentNode || this.compare(currentNode, parentNode) >= 0) break

      this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let smallest = index

      const leftNode = this.heap[leftChild]
      const rightNode = this.heap[rightChild]
      const smallestNode = this.heap[smallest]

      if (
        leftChild < this.heap.length &&
        leftNode && smallestNode &&
        this.compare(leftNode, smallestNode) < 0
      ) {
        smallest = leftChild
      }

      if (
        rightChild < this.heap.length &&
        rightNode && this.heap[smallest] &&
        this.compare(rightNode, this.heap[smallest]!) < 0
      ) {
        smallest = rightChild
      }

      if (smallest === index) break

      this.swap(index, smallest)
      index = smallest
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i]
    const swap = this.heap[j]
    if (temp && swap) {
      this.heap[i] = swap
      this.heap[j] = temp
    }
  }
}
