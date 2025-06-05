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
}

const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onTogglePause,
  isPaused,
  gameOver
}) => {
  const commonButtonClass = "w-full h-14 text-lg flex-1 transition-all transform active:scale-95";
  const iconSize = 28;

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="flex space-x-2">
        <Button
          onClick={onMoveLeft}
          disabled={isPaused || gameOver}
          aria-label="Move Left"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowLeft size={iconSize} />
        </Button>
        <Button
          onClick={onRotate}
          disabled={isPaused || gameOver}
          aria-label="Rotate"
          className={commonButtonClass}
          variant="secondary"
        >
          <RotateCw size={iconSize} />
        </Button>
        <Button
          onClick={onMoveRight}
          disabled={isPaused || gameOver}
          aria-label="Move Right"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowRight size={iconSize} />
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onSoftDrop}
          disabled={isPaused || gameOver}
          aria-label="Soft Drop"
          className={commonButtonClass}
          variant="secondary"
        >
          <ArrowDown size={iconSize} />
        </Button>
        <Button
          onClick={onHardDrop}
          disabled={isPaused || gameOver}
          aria-label="Hard Drop"
          className={commonButtonClass}
          variant="secondary"
        >
          <ChevronsDown size={iconSize} />
        </Button>
      </div>
       <Button
        onClick={onTogglePause}
        disabled={gameOver}
        aria-label={isPaused ? "Play" : "Pause"}
        className={`${commonButtonClass} bg-primary hover:bg-primary/90`}
      >
        {isPaused ? <Play size={iconSize} /> : <Pause size={iconSize} />}
        <span className="ml-2">{isPaused && !gameOver ? "Play" : "Pause"}</span>
      </Button>
    </div>
  );
};

export default GameControls;
