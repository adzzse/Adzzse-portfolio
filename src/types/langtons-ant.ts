export interface AntState {
  antX: number;
  antY: number;
  direction: Direction;
}

export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3
}

export interface AntStepResult {
  grid: Uint8Array;
  state: AntState;
}