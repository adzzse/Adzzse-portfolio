import { useCallback, useEffect, useRef, useState } from 'react';
import { GridDimensions } from '../types/cellular-automaton';

export const useAnimation = (callback: () => void, fps: number, isPlaying: boolean) => {
  const frameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    const frameDuration = 1000 / fps;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current >= frameDuration) {
        callback();
        lastFrameTimeRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback, fps, isPlaying]);

  return frameRef;
};

export const useGrid = (dimensions: GridDimensions, initialState?: boolean[][]) => {
  const [grid, setGrid] = useState<boolean[][]>(() => {
    if (initialState) return initialState;
    return Array(dimensions.rows).fill(false).map(() => 
      Array(dimensions.cols).fill(false)
    );
  });

  const clearGrid = useCallback(() => {
    setGrid(Array(dimensions.rows).fill(false).map(() => 
      Array(dimensions.cols).fill(false)
    ));
  }, [dimensions]);

  const setCell = useCallback((x: number, y: number, value: boolean) => {
    if (x < 0 || x >= dimensions.cols || y < 0 || y >= dimensions.rows) return;
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[y] = [...newGrid[y]];
      newGrid[y][x] = value;
      return newGrid;
    });
  }, [dimensions]);

  useEffect(() => {
    // Resize grid when dimensions change
    setGrid(prev => {
      const newGrid = Array(dimensions.rows).fill(false).map((_, y) =>
        Array(dimensions.cols).fill(false).map((_, x) => 
          y < prev.length && x < prev[0].length ? prev[y][x] : false
        )
      );
      return newGrid;
    });
  }, [dimensions]);

  return {
    grid,
    setGrid,
    setCell,
    clearGrid
  };
};