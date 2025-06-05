
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 24; // For rendering, in pixels for example

export const SHAPES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'hsl(180, 70%, 50%)', // Cyan
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'hsl(30, 100%, 50%)', // Orange
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'hsl(240, 70%, 60%)', // Blue
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'hsl(60, 100%, 50%)', // Yellow
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'hsl(120, 70%, 50%)', // Green
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'hsl(300, 70%, 60%)', // Purple
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'hsl(0, 70%, 60%)', // Red
  },
} as const;

export type ShapeName = keyof typeof SHAPES;

export const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];

export const EMPTY_CELL_COLOR = 'hsl(var(--background))';
export const BORDER_COLOR = 'hsl(var(--border))';

export const INITIAL_FALL_SPEED = 1000; // milliseconds
export const SPEED_INCREMENT_PER_LEVEL = 50; // milliseconds faster
export const LINES_PER_LEVEL = 10;

export const SCORE_PER_LINE = [0, 100, 300, 500, 800]; // Score for 0, 1, 2, 3, 4 lines cleared

export const DUO_MODE_TIME_LIMIT = 30; // seconds
export const DUO_MODE_FALL_SPEED = INITIAL_FALL_SPEED; // Fixed speed for duo mode, can be adjusted
