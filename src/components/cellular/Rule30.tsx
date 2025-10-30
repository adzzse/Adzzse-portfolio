import React from 'react';
import CellularAutomaton from './CellularAutomaton';
import { initRule30, stepRule30 } from '../../lib/automata/rule30';
import { DrawFunction, InitialStateFunction, StepFunction } from '../../types/cellular-automaton';

const Rule30: React.FC = () => {
  // Custom step function for Rule 30 using lib
  const stepFunction: StepFunction = (
    grid,
    next,
    cols,
    rows,
    customState
  ) => {
    const newGrid = stepRule30(grid, cols, rows, true);
    next.set(newGrid);
  };

  // Custom initial state setup - single cell in the middle of the first row
  const initialState: InitialStateFunction = (cols, rows) => {
    return initRule30(cols, rows);
  };

  // Custom drawing function for Rule 30
  const customDraw: DrawFunction = (
    ctx,
    grid,
    cols,
    rows,
    cellSize,
    showGrid = false,
    index = (x: number, y: number) => y * cols + x
  ) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a0f2e';
    ctx.fillRect(0, 0, width, height);

    // Cells - Rule 30 creates interesting patterns
    ctx.fillStyle = '#ff6b9d';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[index(x, y)] === 1) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Grid
    if (showGrid && cellSize >= 8) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        const gx = x * cellSize + 0.5;
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, rows * cellSize);
      }
      for (let y = 0; y <= rows; y++) {
        const gy = y * cellSize + 0.5;
        ctx.moveTo(0, gy);
        ctx.lineTo(cols * cellSize, gy);
      }
      ctx.stroke();
    }
  };

  const aboutContent = (
    <>
      <p>
        Rule 30 is an elementary cellular automaton introduced by Stephen Wolfram.
        It produces complex, seemingly random patterns from simple rules.
      </p>
      <ul>
        <li>Each cell's new state depends on itself and its two neighbors</li>
        <li>The pattern grows downward from a single cell</li>
        <li>Known for generating pseudorandom numbers</li>
        <li>One of 256 possible elementary cellular automata</li>
      </ul>
    </>
  );

  return (
    <CellularAutomaton
      title="Rule 30"
      tagline="Complex patterns emerge from simple rules."
      rules="https://en.wikipedia.org/wiki/Rule_30"
      cellColor="#ff6b9d"
      backgroundColor="#1a0f2e"
      aboutContent={aboutContent}
      stepFunction={stepFunction}
      initialState={initialState}
      customDraw={customDraw}
      cellStates={2}
    />
  );
};

export default Rule30;