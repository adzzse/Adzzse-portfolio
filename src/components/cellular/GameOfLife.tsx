import React from 'react';
import CellularAutomaton from '../cellular/CellularAutomaton';

const GameOfLife: React.FC = () => {
  const aboutContent = (
    <>
      <p>
        Conway's Game of Life is a cellular automaton where cells live, die, or are born based on their neighbors.
      </p>
      <ul>
        <li>Play/Pause to run the simulation.</li>
        <li>Step advances one generation.</li>
        <li>Clear empties the board. Random seeds it.</li>
        <li>Drag to paint. Right-click/Alt-drag to erase.</li>
        <li>Pinch to zoom on mobile; use cell size slider on desktop.</li>
      </ul>
    </>
  );

  return (
    <CellularAutomaton
      title="Conway's Game of Life"
      tagline="Evolution is determined by its initial state, requiring no further input."
      rules="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
      birthRules={[3]}
      survivalRules={[2, 3]}
      cellColor="#6ee7ff"
      backgroundColor="#0f1738"
      aboutContent={aboutContent}
    />
  );
};

export default GameOfLife;