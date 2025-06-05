import type { Piece } from '@/lib/game';
import { EMPTY_CELL_COLOR, BORDER_COLOR } from '@/lib/constants';

interface ScoreDisplayProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, level, linesCleared, nextPiece }) => {
  const cellSize = '16px'; // Smaller cell size for preview

  return (
    <div className="p-4 space-y-4 text-foreground bg-card rounded-lg shadow-xl border" style={{borderColor: BORDER_COLOR}}>
      <div>
        <h3 className="text-lg font-semibold">Pontuação</h3>
        <p className="text-2xl text-accent font-bold">{score}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Nível</h3>
        <p className="text-2xl text-accent font-bold">{level}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Linhas</h3>
        <p className="text-2xl text-accent font-bold">{linesCleared}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Próximo</h3>
        {nextPiece && (
          <div
            className="grid border rounded"
            style={{
              gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, ${cellSize})`,
              gridTemplateRows: `repeat(${nextPiece.matrix.length}, ${cellSize})`,
              width: `calc(${nextPiece.matrix[0].length} * ${cellSize} + 2px)`,
              height: `calc(${nextPiece.matrix.length} * ${cellSize} + 2px)`,
              borderColor: BORDER_COLOR,
              backgroundColor: EMPTY_CELL_COLOR,
              marginTop: '0.5rem'
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
                    boxShadow: cell ? 'inset 1px 1px 2px rgba(0,0,0,0.2)' : 'none',
                    borderRadius: '1px',
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
