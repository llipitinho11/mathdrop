'use client';

import GameBoard from '@/components/game/GameBoard';
import GameControls from '@/components/game/GameControls';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import GameOverModal from '@/components/game/GameOverModal';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

export default function BlockDropPage() {
  const {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    linesClearedTotal,
    gameOver,
    isPaused,
    startGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
  } = useGame();


  // Start the game automatically or when startGame is called for the first time.
  // The useGame hook now handles initial piece spawning, so we just need a start button if paused initially.
  useEffect(() => {
    // This effect ensures that if the game initializes in a paused state (e.g. on first load),
    // the user has a clear way to start.
    // startGame() will set isPaused to false.
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground font-body">
      <Toaster />
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary tracking-tight">MathDrop</h1>
        <p className="text-accent text-lg mt-1">Matemática nos Jogos Virtuais</p>
      </header>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full max-w-4xl">
        <div className="flex-shrink-0">
          <GameBoard board={board} currentPiece={currentPiece} />
        </div>

        <div className="flex flex-col space-y-6 w-full lg:w-64">
          <ScoreDisplay score={score} level={level} linesCleared={linesClearedTotal} nextPiece={nextPiece} />
          { (isPaused && !gameOver && !currentPiece) && ( // Show start button if game hasn't truly started
             <Button onClick={startGame} className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground">
                Iniciar Jogo
            </Button>
          )}
          <GameControls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onRotate={rotate}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            onTogglePause={togglePause}
            isPaused={isPaused}
            gameOver={gameOver}
          />
        </div>
      </div>
      
      {gameOver && <GameOverModal isOpen={gameOver} score={score} onRestart={startGame} />}

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Feito para o TCS</p>
        <p>&copy; {new Date().getFullYear()} Mathdrop.</p>
      </footer>
    </div>
  );
}
