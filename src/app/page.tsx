
'use client';

import GameBoard from '@/components/game/GameBoard';
import GameControls from '@/components/game/GameControls';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import GameOverModal from '@/components/game/GameOverModal';
import { useGame, type GameMode } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';

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
    activeGameMode,
    timeLeft,
    startGame,
    restartGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
  } = useGame();

  const [selectedMode, setSelectedMode] = useState<GameMode>('solo');
  
  const handleStartGame = () => {
    startGame({ mode: selectedMode });
  };

  const isGameEffectivelyOverOrNotStarted = gameOver || !activeGameMode;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 bg-background text-foreground font-body">
      <Toaster />
      <header className="mb-4 sm:mb-6 md:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">MathDrop</h1>
        <p className="text-accent text-base sm:text-lg mt-1">Matemática nos Jogos Virtuais</p>
      </header>

      {isGameEffectivelyOverOrNotStarted && !currentPiece && (
        <div className="mb-6 p-6 bg-card rounded-lg shadow-xl border border-border">
          <h2 className="text-xl font-semibold text-center mb-4 text-primary">Escolha o Modo de Jogo</h2>
          <RadioGroup defaultValue="solo" onValueChange={(value) => setSelectedMode(value as GameMode)} className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-md hover:bg-background/70 transition-colors">
              <RadioGroupItem value="solo" id="mode-solo" className="border-primary text-primary focus:ring-primary"/>
              <Label htmlFor="mode-solo" className="text-lg cursor-pointer">Modo Solo Clássico</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-md hover:bg-background/70 transition-colors">
              <RadioGroupItem value="duo" id="mode-duo" className="border-primary text-primary focus:ring-primary"/>
              <Label htmlFor="mode-duo" className="text-lg cursor-pointer">Modo Competição (60s)</Label>
            </div>
          </RadioGroup>
          <Button 
            onClick={handleStartGame} 
            className="w-full h-12 text-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform active:scale-95 transition-transform"
          >
            Iniciar Jogo
          </Button>
        </div>
      )}

      {!isGameEffectivelyOverOrNotStarted && currentPiece && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-start justify-center gap-x-1 sm:gap-x-2 w-full max-w-[200px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:max-w-md mx-auto">
            <div className="flex-shrink-0"> 
              <GameBoard board={board} currentPiece={currentPiece} />
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 flex-grow min-w-0"> 
              <ScoreDisplay 
                score={score} 
                level={level} 
                linesCleared={linesClearedTotal} 
                nextPiece={nextPiece}
                gameMode={activeGameMode}
                timeLeft={timeLeft}
              />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 md:mt-4 w-full max-w-[200px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:max-w-md">
            <GameControls
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onRotate={rotate}
              onSoftDrop={softDrop}
              onHardDrop={hardDrop}
              onTogglePause={togglePause}
              isPaused={isPaused}
              gameOver={gameOver}
              gameActive={!!activeGameMode && !!currentPiece && !gameOver}
            />
          </div>
        </div>
      )}
      
      {gameOver && activeGameMode && <GameOverModal isOpen={gameOver} score={score} onRestart={restartGame} gameMode={activeGameMode} />}

      <footer className="mt-6 sm:mt-8 md:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
        <p>Feito para o TCS</p>
        <p>&copy; {new Date().getFullYear()} Mathdrop.</p>
      </footer>
    </div>
  );
}

