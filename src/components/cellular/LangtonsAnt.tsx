import React from 'react';
import CellularAutomaton from './CellularAutomaton';
import { initLangtonsAnt, stepLangtonsAnt } from '../../lib/automata/langtonsAnt';
import { AntState } from '../../types/langtons-ant';
import { StepFunction, InitialStateFunction, DrawFunction } from '../../types/cellular-automaton';

const LangtonsAnt: React.FC = () => {
  // Custom step function for Langton's Ant using lib
  const stepFunction: StepFunction = (grid, next, cols, rows, customState) => {
    const antState = customState as AntState || initLangtonsAnt(cols, rows);
    const { grid: newGrid, state } = stepLangtonsAnt(
      grid,
      cols,
      rows,
      antState,
      true
    );
    next.set(newGrid);
    return state;
  };

  // Custom initial state setup
  const initialState: InitialStateFunction = (cols, rows) => {
    return new Uint8Array(cols * rows);
  };

  // Custom drawing function for Langton's Ant
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
    const state = (ctx.canvas.customState || initLangtonsAnt(cols, rows)) as AntState;

    if (!state) return;

    const { antX, antY, direction } = state;

    // Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f1738';
    ctx.fillRect(0, 0, width, height);

    // Cells
    ctx.fillStyle = '#6ee7ff';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[index(x, y)] === 1) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Ant
    const antPx = antX * cellSize;
    const antPy = antY * cellSize;
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(antPx, antPy, cellSize, cellSize);

    // Direction indicator (small triangle)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    const cx = antPx + cellSize / 2;
    const cy = antPy + cellSize / 2;
    const r = Math.max(2, cellSize * 0.25);

    // Draw direction indicator based on current direction
    const angle = (direction * Math.PI) / 2 - Math.PI / 2;
    ctx.moveTo(
      cx + r * Math.cos(angle),
      cy + r * Math.sin(angle)
    );
    ctx.lineTo(
      cx + r * Math.cos(angle + (2.5 * Math.PI) / 3),
      cy + r * Math.sin(angle + (2.5 * Math.PI) / 3)
    );
    ctx.lineTo(
      cx + r * Math.cos(angle - (2.5 * Math.PI) / 3),
      cy + r * Math.sin(angle - (2.5 * Math.PI) / 3)
    );
    ctx.fill();
  };

  const aboutContent = (
    <>
      <p>
        Langton's Ant is a cellular automaton with simple rules but complex behavior:
      </p>
      <ul>
        <li>At a white square, turn right 90°, flip the color, and move forward</li>
        <li>At a black square, turn left 90°, flip the color, and move forward</li>
        <li>After about 10,000 steps, the ant starts building a "highway"</li>
      </ul>
    </>
  );

  return (
    <CellularAutomaton
      title="Langton's Ant"
      tagline="Simple rules create complex highways."
      rules="https://en.wikipedia.org/wiki/Langton%27s_ant"
      cellColor="#6ee7ff"
      backgroundColor="#0f1738"
      aboutContent={aboutContent}
      stepFunction={stepFunction}
      initialState={initialState}
      customDraw={customDraw}
      cellStates={2}
    />
  );
};

export default LangtonsAnt;