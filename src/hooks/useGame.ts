'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, Piece } from '@/lib/game';
import {
  createEmptyBoard,
  getRandomPiece,
  rotateMatrix,
  checkCollision,
  mergePieceToBoard,
  clearLines,
} from '@/lib/game';
import {
  BOARD_HEIGHT,
  INITIAL_FALL_SPEED,
  SPEED_INCREMENT_PER_LEVEL,
  LINES_PER_LEVEL,
  SCORE_PER_LINE,
} from '@/lib/constants';

export const useGame = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallSpeedRef = useRef(INITIAL_FALL_SPEED);

  const spawnNewPiece = useCallback(() => {
    const newPiece = nextPiece || getRandomPiece();
    const nextRandomPiece = getRandomPiece();
    
    setCurrentPiece(newPiece);
    setNextPiece(nextRandomPiece);

    if (checkCollision(newPiece, board)) {
      setGameOver(true);
      setIsPaused(true);
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    }
  }, [board, nextPiece]);
  
  useEffect(() => {
    if (!currentPiece) { // Initial spawn or after game over
      setNextPiece(getRandomPiece()); // Prime the next piece
      spawnNewPiece();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
    return !checkCollision(newPiece, board);
  }, [currentPiece, board, gameOver, isPaused]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotatedMatrix = rotateMatrix(currentPiece.matrix);
    const newPiece = { ...currentPiece, matrix: rotatedMatrix };

    // Basic wall kick: try to move left/right if collision after rotation
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      // Try moving 1 unit right
      const kickedRight = { ...newPiece, x: newPiece.x + 1 };
      if (!checkCollision(kickedRight, board)) {
        setCurrentPiece(kickedRight);
        return;
      }
      // Try moving 1 unit left
      const kickedLeft = { ...newPiece, x: newPiece.x - 1 };
      if (!checkCollision(kickedLeft, board)) {
        setCurrentPiece(kickedLeft);
        return;
      }
       // Try moving 2 units right (for I piece)
      const kickedRightTwice = { ...newPiece, x: newPiece.x + 2 };
      if (currentPiece.shapeName === 'I' && !checkCollision(kickedRightTwice, board)) {
        setCurrentPiece(kickedRightTwice);
        return;
      }
      // Try moving 2 units left (for I piece)
      const kickedLeftTwice = { ...newPiece, x: newPiece.x - 2 };
      if (currentPiece.shapeName === 'I' && !checkCollision(kickedLeftTwice, board)) {
        setCurrentPiece(kickedLeftTwice);
      }
    }
  }, [currentPiece, board, gameOver, isPaused]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let tempPiece = { ...currentPiece };
    while (!checkCollision({ ...tempPiece, y: tempPiece.y + 1 }, board)) {
      tempPiece.y += 1;
    }
    setCurrentPiece(tempPiece);
    // Force solidify after hard drop
    // This part needs to be integrated with the game loop logic carefully
    // For now, the next game tick will handle solidification
  }, [currentPiece, board, gameOver, isPaused]);

  const softDrop = useCallback(() => {
    if (isPaused || gameOver) return;
    if (movePiece(0, 1)) {
      // Successfully moved down
    } else {
      // Cannot move down, solidify piece
      if (currentPiece) {
        const newBoard = mergePieceToBoard(currentPiece, board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);

        if (linesCleared > 0) {
          setScore(prev => prev + SCORE_PER_LINE[linesCleared] * level);
          setLinesClearedTotal(prev => prev + linesCleared);
        }
        spawnNewPiece();
      }
    }
  }, [movePiece, currentPiece, board, spawnNewPiece, level, isPaused, gameOver]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLinesClearedTotal(0);
    setLevel(1);
    setGameOver(false);
    fallSpeedRef.current = INITIAL_FALL_SPEED;
    const firstPiece = getRandomPiece();
    setCurrentPiece(firstPiece);
    setNextPiece(getRandomPiece());
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (linesClearedTotal >= level * LINES_PER_LEVEL) {
      setLevel(prev => prev + 1);
      fallSpeedRef.current = Math.max(100, INITIAL_FALL_SPEED - (level * SPEED_INCREMENT_PER_LEVEL));
    }
  }, [linesClearedTotal, level]);
  
  useEffect(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (!isPaused && !gameOver) {
      gameIntervalRef.current = setInterval(softDrop, fallSpeedRef.current);
    }
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [softDrop, isPaused, gameOver, fallSpeedRef]);


  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;
      if (isPaused && event.key !== 'p' && event.key !== 'P') return;

      switch (event.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          softDrop(); // Accelerate drop
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ': // Space bar for hard drop
          event.preventDefault(); // Prevent page scroll
          dropPiece();
          // After hard drop, we need to immediately try to solidify and spawn next.
          // The current softDrop logic in interval will handle this on next tick,
          // but for instant feedback, we can call it manually.
          // This needs careful handling to avoid race conditions with interval.
          // For now, rely on next tick.
          break;
        case 'p':
        case 'P':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, dropPiece, softDrop, gameOver, isPaused]);

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    linesClearedTotal,
    gameOver,
    isPaused,
    startGame,
    moveLeft: () => movePiece(-1, 0),
    moveRight: () => movePiece(1, 0),
    rotate: rotatePiece,
    softDrop,
    hardDrop: dropPiece,
    togglePause: () => setIsPaused(prev => !prev)
  };
};
