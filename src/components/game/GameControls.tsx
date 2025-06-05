
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCw, ArrowDown, ChevronsDown, Play, Pause } from 'lucide-react';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  gameOver: boolean;
  gameActive: boolean; // New prop to determine if game is running for pause button label
}

const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onTogglePause,
  isPaused,
  gameOver,
  gameActive
}) => {
  const commonButtonClass = "w-full h-9 text-sm sm:h-10 sm:text-base md:h-11 md:text-lg lg:h-12 lg:text-xl flex-1 transition-all transform active:scale-95";
  const iconSize = 18;

  const movementDisabled = isPaused || gameOver || !gameActive;
  const pauseDisabled = gameOver || !gameActive;


  return (
    <div className="w-full max-w-xs space-y-1 sm:space-y-2">
      <div className="flex space-x-1 sm:space-x-2">
        <Button
          onClick={onMoveLeft}
          disabled={movementDisabled}
          aria-label="Mover para Esquerda"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowLeft size={iconSize} />
        </Button>
        <Button
          onClick={onRotate}
          disabled={movementDisabled}
          aria-label="Girar"
          className={commonButtonClass}
          variant="secondary"
        >
          <RotateCw size={iconSize} />
        </Button>
        <Button
          onClick={onMoveRight}
          disabled={movementDisabled}
          aria-label="Mover para Direita"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowRight size={iconSize} />
        </Button>
      </div>
      <div className="flex space-x-1 sm:space-x-2">
        <Button
          onClick={onSoftDrop}
          disabled={movementDisabled}
          aria-label="Descida Suave"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowDown size={iconSize} />
        </Button>
        <Button
          onClick={onHardDrop}
          disabled={movementDisabled}
          aria-label="Descida Rápida"
          className={commonButtonClass}
          variant="secondary"
        >
          <ChevronsDown size={iconSize} />
        </Button>
      </div>
       <Button
        onClick={onTogglePause}
        disabled={pauseDisabled}
        aria-label={isPaused ? "Continuar" : "Pausar"}
        className={`${commonButtonClass} bg-primary hover:bg-primary/90`}
      >
        {isPaused && gameActive ? <Play size={iconSize} /> : <Pause size={iconSize} />}
        <span className="ml-1 text-xs sm:ml-2 sm:text-sm md:text-base">
          {isPaused && gameActive ? "Continuar" : "Pausar"}
        </span>
      </Button>
    </div>
  );
};

export default GameControls;
