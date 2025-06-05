
import type { Board, Piece } from '@/lib/game';
import { BOARD_WIDTH, BOARD_HEIGHT, EMPTY_CELL_COLOR, BORDER_COLOR } from '@/lib/constants';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  // Create a display board that includes the current piece
  const displayBoard = board.map(row => [...row]);

  if (currentPiece) {
    const { matrix, x, y, color } = currentPiece;
    matrix.forEach((rowArr, rIdx) => {
      rowArr.forEach((cell, cIdx) => {
        if (cell) {
          const boardY = y + rIdx;
          const boardX = x + cIdx;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = color;
          }
        }
      });
    });
  }

  const cellSize = 'min(5vw, 20px)'; // Responsive cell size: 5vw or 20px, whichever is smaller

  return (
    <div
      className="grid border-2 rounded-md shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${cellSize})`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${cellSize})`,
        width: `calc(${BOARD_WIDTH} * ${cellSize} + 4px)`, // + border
        height: `calc(${BOARD_HEIGHT} * ${cellSize} + 4px)`, // + border
        borderColor: BORDER_COLOR,
        backgroundColor: EMPTY_CELL_COLOR,
        // Add a subtle inner shadow to give depth
        boxShadow: `inset 0 0 10px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.1)`, 
      }}
    >
      {displayBoard.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className="border" // Adds a subtle border between cells for "big margin" feel
            style={{
              backgroundColor: cell ? cell : EMPTY_CELL_COLOR,
              borderColor: cell ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)', // Darker border for filled, lighter for empty
              // Add a slight inset shadow to blocks for 3D feel
              boxShadow: cell ? 'inset 1px 1px 2px rgba(0,0,0,0.15), inset -0.5px -0.5px 1px rgba(255,255,255,0.05)' : 'none',
              borderRadius: '1px', // Slightly rounded corners for blocks
            }}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
