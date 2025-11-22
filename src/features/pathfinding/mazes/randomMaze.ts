import type { Coordinate } from '../types'
import { GRID_ROWS, GRID_COLS } from '../constants'

/**
 * Random Maze Algorithm
 * Creates a random maze with configurable wall density
 * Returns walls in random order for animation
 */
export const randomMaze = (
  startRow: number,
  startCol: number,
  finishRow: number,
  finishCol: number,
  wallDensity: number = 0.3
): Coordinate[] => {
  const walls: Coordinate[] = []

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      // Skip start and finish nodes
      if ((row === startRow && col === startCol) || (row === finishRow && col === finishCol)) {
        continue
      }

      // Randomly place walls based on density
      if (Math.random() < wallDensity) {
        walls.push({ row, col })
      }
    }
  }

  // Shuffle the walls for random animation order
  for (let i = walls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = walls[i]
    const swap = walls[j]
    if (temp && swap) {
      walls[i] = swap
      walls[j] = temp
    }
  }

  return walls
}
