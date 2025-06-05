import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, score, onRestart }) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold text-center text-primary">Fim de Jogo!</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg text-foreground/80 pt-2">
            Sua pontuação final é: <strong className="text-accent">{score}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button onClick={onRestart} className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
            Jogue Novamente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverModal;
