
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { GameMode } from '@/hooks/useGame';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  onRestart: () => void;
  gameMode: GameMode | null;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, score, onRestart, gameMode }) => {
  if (!isOpen) return null;

  const title = gameMode === 'duo' ? "Tempo Esgotado!" : "Fim de Jogo!";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onRestart()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold text-center text-primary">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg text-foreground/80 pt-2">
            Sua pontuação final é: <strong className="text-accent">{score}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button onClick={onRestart} className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
            Jogar Novamente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverModal;
