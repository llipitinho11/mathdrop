
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


  useEffect(() => {
    // This effect ensures that if the game initializes in a paused state (e.g. on first load),
    // the user has a clear way to start.
    // startGame() will set isPaused to false.
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 bg-background text-foreground font-body">
      <Toaster />
      <header className="mb-4 sm:mb-6 md:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">MathDrop</h1>
        <p className="text-accent text-base sm:text-lg mt-1">Matemática nos Jogos Virtuais</p>
      </header>

      <div className="flex flex-row items-start justify-center gap-x-2 sm:gap-x-4 w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
        {/* GameBoard Wrapper */}
        <div className="flex-shrink-0"> 
          <GameBoard board={board} currentPiece={currentPiece} />
        </div>

        {/* Sidebar: ScoreDisplay + GameControls */}
        <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 flex-grow min-w-0"> 
          <ScoreDisplay score={score} level={level} linesCleared={linesClearedTotal} nextPiece={nextPiece} />
          { (isPaused && !gameOver && !currentPiece) && ( // Show start button if game hasn't truly started
             <Button 
                onClick={startGame} 
                className="w-full h-9 text-xs sm:h-10 sm:text-sm md:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
              >
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

      <footer className="mt-6 sm:mt-8 md:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
        <p>Feito para o TCS</p>
        <p>&copy; {new Date().getFullYear()} Mathdrop.</p>
      </footer>
    </div>
  );
}
