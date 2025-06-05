
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
  DUO_MODE_TIME_LIMIT,
  DUO_MODE_FALL_SPEED,
} from '@/lib/constants';

export type GameMode = 'solo' | 'duo';

export const useGame = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const [activeGameMode, setActiveGameMode] = useState<GameMode | null>(null);
  const [timeLeft, setTimeLeft] = useState(DUO_MODE_TIME_LIMIT);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallSpeedRef = useRef(INITIAL_FALL_SPEED);
  const lastSelectedModeRef = useRef<GameMode>('solo');


  const spawnNewPiece = useCallback(() => {
    if (gameOver) return; // Do not spawn if game is over (e.g. time up in duo mode)
    const newPiece = nextPiece || getRandomPiece();
    const nextRandomPiece = getRandomPiece();
    
    setCurrentPiece(newPiece);
    setNextPiece(nextRandomPiece);

    if (checkCollision(newPiece, board)) {
      setGameOver(true);
      setIsPaused(true);
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [board, nextPiece, gameOver]);
  
  useEffect(() => {
    // This effect is to ensure `nextPiece` is primed when the hook initializes,
    // but not to start the game or spawn `currentPiece` automatically.
    if (!nextPiece && !currentPiece) {
        setNextPiece(getRandomPiece());
    }
  }, [nextPiece, currentPiece]);


  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return false;
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
      return true;
    }
    return false;
  }, [currentPiece, board, gameOver, isPaused]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotatedMatrix = rotateMatrix(currentPiece.matrix);
    const newPiece = { ...currentPiece, matrix: rotatedMatrix };

    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      const kickedRight = { ...newPiece, x: newPiece.x + 1 };
      if (!checkCollision(kickedRight, board)) {
        setCurrentPiece(kickedRight);
        return;
      }
      const kickedLeft = { ...newPiece, x: newPiece.x - 1 };
      if (!checkCollision(kickedLeft, board)) {
        setCurrentPiece(kickedLeft);
        return;
      }
      const kickedRightTwice = { ...newPiece, x: newPiece.x + 2 };
      if (currentPiece.shapeName === 'I' && !checkCollision(kickedRightTwice, board)) {
        setCurrentPiece(kickedRightTwice);
        return;
      }
      const kickedLeftTwice = { ...newPiece, x: newPiece.x - 2 };
      if (currentPiece.shapeName === 'I' && !checkCollision(kickedLeftTwice, board)) {
        setCurrentPiece(kickedLeftTwice);
      }
    }
  }, [currentPiece, board, gameOver, isPaused]);
  
  const hardDropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let tempPiece = { ...currentPiece };
    while (!checkCollision({ ...tempPiece, y: tempPiece.y + 1 }, board)) {
      tempPiece.y += 1;
    }
    // setCurrentPiece(tempPiece); // This will be set before solidify
    
    // Immediately solidify and spawn next after hard drop
    const newBoard = mergePieceToBoard(tempPiece, board);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);

    if (linesCleared > 0) {
      const currentLevelForScore = activeGameMode === 'duo' ? 1 : level;
      setScore(prev => prev + SCORE_PER_LINE[linesCleared] * currentLevelForScore);
      if (activeGameMode === 'solo') {
        setLinesClearedTotal(prev => prev + linesCleared);
      }
    }
    
    if (activeGameMode === 'duo' && timeLeft <= 0) {
        setGameOver(true);
        setIsPaused(true);
    } else {
        spawnNewPiece();
    }
  }, [currentPiece, board, gameOver, isPaused, spawnNewPiece, level, activeGameMode, timeLeft]);


  const softDrop = useCallback(() => {
    if (isPaused || gameOver || !currentPiece) return;

    if (movePiece(0, 1)) {
      // Successfully moved down
    } else {
      // Cannot move down, solidify piece
      const newBoard = mergePieceToBoard(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);

      if (linesCleared > 0) {
        const currentLevelForScore = activeGameMode === 'duo' ? 1 : level;
        setScore(prev => prev + SCORE_PER_LINE[linesCleared] * currentLevelForScore);
        if (activeGameMode === 'solo') {
          setLinesClearedTotal(prev => prev + linesCleared);
        }
      }
      spawnNewPiece();
    }
  }, [movePiece, currentPiece, board, spawnNewPiece, level, isPaused, gameOver, activeGameMode]);

  const startGame = useCallback(({ mode }: { mode: GameMode }) => {
    lastSelectedModeRef.current = mode;
    setActiveGameMode(mode);
    setBoard(createEmptyBoard());
    setScore(0);
    setLinesClearedTotal(0);
    setGameOver(false);
    
    if (mode === 'solo') {
      setLevel(1);
      fallSpeedRef.current = INITIAL_FALL_SPEED;
      setTimeLeft(0); // Not used in solo
    } else { // duo mode
      setLevel(1); // Or set to a fixed value / hide
      fallSpeedRef.current = DUO_MODE_FALL_SPEED;
      setTimeLeft(DUO_MODE_TIME_LIMIT);
    }

    const firstPiece = nextPiece || getRandomPiece(); // Use primed nextPiece or get a new one
    setCurrentPiece(firstPiece);
    setNextPiece(getRandomPiece()); // Prime the next one
    setIsPaused(false); // Start the game immediately
  }, [nextPiece]); // Added nextPiece dependency

  // Level up effect for solo mode
  useEffect(() => {
    if (activeGameMode === 'solo' && linesClearedTotal >= level * LINES_PER_LEVEL) {
      setLevel(prev => prev + 1);
      fallSpeedRef.current = Math.max(100, INITIAL_FALL_SPEED - (level * SPEED_INCREMENT_PER_LEVEL));
    }
  }, [linesClearedTotal, level, activeGameMode]);
  
  // Game loop for piece falling
  useEffect(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (!isPaused && !gameOver && currentPiece) {
      gameIntervalRef.current = setInterval(softDrop, fallSpeedRef.current);
    }
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [softDrop, isPaused, gameOver, currentPiece]); // Added currentPiece to dependencies

  // Timer loop for duo mode
  useEffect(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (activeGameMode === 'duo' && !isPaused && !gameOver && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current!);
            setGameOver(true);
            setIsPaused(true);
            if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeGameMode, isPaused, gameOver, timeLeft]);


  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver && event.key !== 'Enter') return; // Allow Enter for restart via modal
      if (!activeGameMode) return; // Don't handle keys if no game mode active (mode selection screen)
      
      if (isPaused && event.key.toLowerCase() !== 'p') return;


      switch (event.key.toLowerCase()) {
        case 'arrowleft':
          movePiece(-1, 0);
          break;
        case 'arrowright':
          movePiece(1, 0);
          break;
        case 'arrowdown':
          softDrop();
          break;
        case 'arrowup':
          rotatePiece();
          break;
        case ' ': // Space bar for hard drop
          event.preventDefault();
          hardDropPiece();
          break;
        case 'p':
          if (!gameOver) { // Prevent pausing if game is over
             setIsPaused(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, hardDropPiece, softDrop, gameOver, isPaused, activeGameMode]);

  const togglePause = () => {
    if (!gameOver) { // Prevent pausing/unpausing if game is over
        setIsPaused(prev => !prev);
    }
  };
  
  const restartGame = () => {
    startGame({ mode: lastSelectedModeRef.current });
  }

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    linesClearedTotal,
    gameOver,
    isPaused,
    activeGameMode,
    timeLeft,
    startGame,
    restartGame, // For game over modal
    moveLeft: () => movePiece(-1, 0),
    moveRight: () => movePiece(1, 0),
    rotate: rotatePiece,
    softDrop,
    hardDrop: hardDropPiece,
    togglePause
  };
};
