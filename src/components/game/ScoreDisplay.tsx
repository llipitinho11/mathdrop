
import type { Piece } from '@/lib/game';
import { EMPTY_CELL_COLOR, BORDER_COLOR } from '@/lib/constants';

interface ScoreDisplayProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, level, linesCleared, nextPiece }) => {
  const previewCellSize = '8px sm:10px md:12px lg:16px'; // Responsive cell size for preview

  return (
    <div className="p-1 space-y-1 text-foreground bg-card rounded-lg shadow-md border sm:p-2 sm:space-y-2 md:p-3 md:space-y-3 lg:p-4 lg:space-y-4" style={{borderColor: BORDER_COLOR}}>
      <div>
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Pontuação</h3>
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-accent font-bold">{score}</p>
      </div>
      <div className="hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Nível</h3>
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-accent font-bold">{level}</p>
      </div>
      <div className="hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Linhas</h3>
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-accent font-bold">{linesCleared}</p>
      </div>
      <div>
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Próximo</h3>
        {nextPiece && (
          <div
            className="grid border rounded"
            style={{
              gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, ${previewCellSize})`,
              gridTemplateRows: `repeat(${nextPiece.matrix.length}, ${previewCellSize})`,
              width: `calc(${nextPiece.matrix[0].length} * ${previewCellSize} + 2px)`,
              height: `calc(${nextPiece.matrix.length} * ${previewCellSize} + 2px)`,
              borderColor: BORDER_COLOR,
              backgroundColor: EMPTY_CELL_COLOR,
              marginTop: '0.125rem sm:0.25rem md:0.5rem'
            }}
          >
            {nextPiece.matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`next-${rIdx}-${cIdx}`}
                  className="border"
                  style={{
                    backgroundColor: cell ? nextPiece.color : EMPTY_CELL_COLOR,
                    borderColor: cell ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                    boxShadow: cell ? 'inset 0.5px 0.5px 1px rgba(0,0,0,0.2)' : 'none',
                    borderRadius: '0.5px',
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
