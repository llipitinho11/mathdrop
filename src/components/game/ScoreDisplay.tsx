
import type { Piece } from '@/lib/game';
import type { GameMode } from '@/hooks/useGame';
import { EMPTY_CELL_COLOR, BORDER_COLOR } from '@/lib/constants';

interface ScoreDisplayProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
  gameMode: GameMode | null;
  timeLeft?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, level, linesCleared, nextPiece, gameMode, timeLeft }) => {
  const previewCellSize = 'max(1.5vw, 10px)';

  return (
    <div className="p-1 space-y-1 text-foreground bg-card rounded-lg shadow-md border sm:p-2 md:p-3 lg:p-4 w-full max-w-[100px] sm:max-w-[120px] md:max-w-[150px]" style={{borderColor: BORDER_COLOR}}>
      <div>
        <h3 className="text-[0.6rem] sm:text-xs md:text-sm font-semibold">Pontuação</h3>
        <p className="text-xs sm:text-sm md:text-base text-accent font-bold">{score}</p>
      </div>

      {gameMode === 'duo' && timeLeft !== undefined && (
        <div className="mt-1">
          <h3 className="text-[0.6rem] sm:text-xs md:text-sm font-semibold">Tempo</h3>
          <p className="text-xs sm:text-sm md:text-base text-accent font-bold">{timeLeft}s</p>
        </div>
      )}
      
      {gameMode === 'solo' && (
        <>
          <div className="hidden lg:block">
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Nível</h3>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-accent font-bold">{level}</p>
          </div>
          <div className="hidden lg:block">
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Linhas</h3>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-accent font-bold">{linesCleared}</p>
          </div>
        </>
      )}

      <div>
        <h3 className="text-[0.6rem] sm:text-xs font-semibold">Próximo</h3>
        {nextPiece && (
          <div
            className="grid border rounded" 
            style={{
              gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, ${previewCellSize})`,
              gridTemplateRows: `repeat(${nextPiece.matrix.length}, ${previewCellSize})`,
              width: `calc(${nextPiece.matrix[0].length} * (${previewCellSize}) + 2px)`,
              height: `calc(${nextPiece.matrix.length} * (${previewCellSize}) + 2px)`,
              borderColor: BORDER_COLOR,
              backgroundColor: EMPTY_CELL_COLOR,
              marginTop: '0.125rem'
            }}
          >
            {nextPiece.matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`next-${rIdx}-${cIdx}`}
                  style={{
                    backgroundColor: cell ? nextPiece.color : EMPTY_CELL_COLOR,
                    boxShadow: cell ? 'inset 0.5px 0.5px 1px rgba(0,0,0,0.2)' : 'none',
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
