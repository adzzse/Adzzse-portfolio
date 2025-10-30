import React from 'react';
import CellularAutomaton from './CellularAutomaton';
import { usePatternControl } from '../../hooks/usePatternControl';

const REPLICATOR_PATTERN = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1]
] as const;

const Highlife: React.FC = () => {
  const aboutContent = (
    <>
      <p>
        Highlife is a cellular automaton with rules B36/S23, meaning:
      </p>
      <ul>
        <li><strong>Birth (B36):</strong> Dead cells with exactly 3 or 6 neighbors become alive</li>
        <li><strong>Survival (S23):</strong> Live cells with 2 or 3 neighbors survive</li>
        <li><strong>Death:</strong> All other cells die or stay dead</li>
      </ul>
    </>
  );

  const ReplicatorControl = usePatternControl({
    pattern: REPLICATOR_PATTERN,
    label: 'Add Replicator'
  });

  return (
    <CellularAutomaton
      title="Highlife"
      tagline="A variant of Life with an additional birth rule."
      rules="https://en.wikipedia.org/wiki/Highlife_(cellular_automaton)"
      birthRules={[3, 6]}
      survivalRules={[2, 3]}
      cellColor="#90ee90"
      backgroundColor="#0f1738"
      aboutContent={aboutContent}
      extraControls={ReplicatorControl}
    />
  );
};

export default Highlife;