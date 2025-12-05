import React from 'react';

interface CapturedPiecesProps {
  pieces: string[]; // Array of piece codes like 'p', 'n', 'b', 'r', 'q'
  color: 'w' | 'b';
}

const pieceMap: Record<string, string> = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚', // Black unicode
  P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔', // White unicode
};

// We will use images or unicode. For simplicity and reliability without assets, let's use high-quality unicode or letters styled nicely. 
// Actually, let's just map the codes to standard chess piece names and render them with a nice font or SVG if we had them.
// Let's use simple text representation styled to look like pieces.

const getPieceSymbol = (piece: string, color: 'w' | 'b') => {
    const p = piece.toLowerCase();
    // Use white piece symbols for captured white pieces (displayed on black's side)
    // Use black piece symbols for captured black pieces (displayed on white's side)
    if (color === 'w') {
        // Captured white pieces
        switch (p) {
            case 'p': return '♙';
            case 'n': return '♘';
            case 'b': return '♗';
            case 'r': return '♖';
            case 'q': return '♕';
            case 'k': return '♔';
            default: return '';
        }
    } else {
        // Captured black pieces
        switch (p) {
            case 'p': return '♟';
            case 'n': return '♞';
            case 'b': return '♝';
            case 'r': return '♜';
            case 'q': return '♛';
            case 'k': return '♚';
            default: return '';
        }
    }
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  return (
    <div className={`flex flex-wrap gap-1 h-8 items-center px-2 rounded ${color === 'w' ? 'bg-slate-700/30' : 'bg-slate-700/30'}`}>
        {pieces.map((p, idx) => (
            <span key={idx} className={`text-2xl leading-none ${color === 'w' ? 'text-slate-300' : 'text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'}`}>
                {getPieceSymbol(p, color)}
            </span>
        ))}
        {pieces.length === 0 && <span className="text-slate-600 text-xs italic">No captures</span>}
    </div>
  );
};