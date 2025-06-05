import type { ShapeName } from './constants';
import { BOARD_WIDTH, BOARD_HEIGHT, SHAPES, SHAPE_NAMES } from './constants';

export type Cell = string | 0; // 0 for empty, color string for filled
export type Board = Cell[][];
export type Piece = {
  shapeName: ShapeName;
  matrix: number[][];
  color: string;
  x: number;
  y: number;
};

export const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const getRandomPiece = (): Piece => {
  const shapeName = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
  const shapeData = SHAPES[shapeName];
  return {
    shapeName,
    matrix: shapeData.shape,
    color: shapeData.color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shapeData.shape[0].length / 2),
    y: 0,
  };
};

export const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const newMatrix = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      newMatrix[j][rows - 1 - i] = matrix[i][j];
    }
  }
  return newMatrix;
};

export const checkCollision = (piece: Piece, board: Board): boolean => {
  const { matrix, x, y } = piece;
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        const boardX = x + col;
        const boardY = y + row;
        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY] && board[boardY][boardX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const mergePieceToBoard = (piece: Piece, board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  const { matrix, x, y, color } = piece;
  matrix.forEach((rowArr, rowIdx) => {
    rowArr.forEach((cell, colIdx) => {
      if (cell) {
        const boardY = y + rowIdx;
        const boardX = x + colIdx;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = color;
        }
      }
    });
  });
  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));
  newBoard = [...emptyRows, ...newBoard];
  return { newBoard, linesCleared };
};
