import type { Coordinate } from '../types'
import { GRID_ROWS, GRID_COLS } from '../constants'

/**
 * Recursive Division Maze Algorithm
 * Creates a maze by recursively dividing the grid with walls
 * Returns walls in the order they should be animated
 */
export const recursiveDivision = (
  startRow: number,
  startCol: number,
  finishRow: number,
  finishCol: number
): Coordinate[] => {
  const walls: Coordinate[] = []

  const divide = (
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    orientation: 'horizontal' | 'vertical'
  ): void => {
    if (rowEnd < rowStart || colEnd < colStart) return

    if (orientation === 'horizontal') {
      if (rowEnd - rowStart < 2) return

      // Choose a random row for the wall
      const possibleRows: number[] = []
      for (let r = rowStart + 1; r < rowEnd; r += 2) {
        possibleRows.push(r)
      }
      if (possibleRows.length === 0) return
      const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)]!

      // Choose a random column for the passage
      const possibleCols: number[] = []
      for (let c = colStart; c <= colEnd; c += 2) {
        possibleCols.push(c)
      }
      const passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)]!

      // Add walls except at the passage
      for (let col = colStart; col <= colEnd; col++) {
        if (
          col !== passageCol &&
          (wallRow !== startRow || col !== startCol) &&
          (wallRow !== finishRow || col !== finishCol)
        ) {
          walls.push({ row: wallRow, col })
        }
      }

      // Recursively divide the two sections
      divide(rowStart, wallRow - 1, colStart, colEnd, 'vertical')
      divide(wallRow + 1, rowEnd, colStart, colEnd, 'vertical')
    } else {
      // Vertical orientation
      if (colEnd - colStart < 2) return

      // Choose a random column for the wall
      const possibleCols: number[] = []
      for (let c = colStart + 1; c < colEnd; c += 2) {
        possibleCols.push(c)
      }
      if (possibleCols.length === 0) return
      const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)]!

      // Choose a random row for the passage
      const possibleRows: number[] = []
      for (let r = rowStart; r <= rowEnd; r += 2) {
        possibleRows.push(r)
      }
      const passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)]!

      // Add walls except at the passage
      for (let row = rowStart; row <= rowEnd; row++) {
        if (
          row !== passageRow &&
          (row !== startRow || wallCol !== startCol) &&
          (row !== finishRow || wallCol !== finishCol)
        ) {
          walls.push({ row, col: wallCol })
        }
      }

      // Recursively divide the two sections
      divide(rowStart, rowEnd, colStart, wallCol - 1, 'horizontal')
      divide(rowStart, rowEnd, wallCol + 1, colEnd, 'horizontal')
    }
  }

  // Surround the grid with walls
  for (let row = 0; row < GRID_ROWS; row++) {
    if (
      (row !== startRow || 0 !== startCol) &&
      (row !== finishRow || 0 !== finishCol)
    ) {
      walls.push({ row, col: 0 })
    }
    if (
      (row !== startRow || GRID_COLS - 1 !== startCol) &&
      (row !== finishRow || GRID_COLS - 1 !== finishCol)
    ) {
      walls.push({ row, col: GRID_COLS - 1 })
    }
  }

  for (let col = 1; col < GRID_COLS - 1; col++) {
    if (
      (0 !== startRow || col !== startCol) &&
      (0 !== finishRow || col !== finishCol)
    ) {
      walls.push({ row: 0, col })
    }
    if (
      (GRID_ROWS - 1 !== startRow || col !== startCol) &&
      (GRID_ROWS - 1 !== finishRow || col !== finishCol)
    ) {
      walls.push({ row: GRID_ROWS - 1, col })
    }
  }

  // Start the recursive division
  const orientation = GRID_ROWS > GRID_COLS ? 'horizontal' : 'vertical'
  divide(1, GRID_ROWS - 2, 1, GRID_COLS - 2, orientation)

  return walls
}
