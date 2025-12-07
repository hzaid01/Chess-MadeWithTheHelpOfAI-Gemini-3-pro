import React, { useEffect, useRef } from 'react';
import { Sparkles, ThumbsUp, Check, AlertTriangle, X, Skull } from 'lucide-react';

export type MoveRating = 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'book' | null;

export interface MoveWithRating {
  san: string;
  rating: MoveRating;
}

interface MoveHistoryProps {
  history: string[];
  moveRatings?: MoveRating[];
}

const getRatingStyle = (rating: MoveRating): { bg: string; text: string; icon: React.ReactNode; label: string } => {
  switch (rating) {
    case 'brilliant':
      return {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        icon: <Sparkles size={10} />,
        label: '!!'
      };
    case 'great':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        icon: <ThumbsUp size={10} />,
        label: '!'
      };
    case 'good':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        icon: <Check size={10} />,
        label: '✓'
      };
    case 'inaccuracy':
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        icon: <AlertTriangle size={10} />,
        label: '?!'
      };
    case 'mistake':
      return {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        icon: <X size={10} />,
        label: '?'
      };
    case 'blunder':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        icon: <Skull size={10} />,
        label: '??'
      };
    case 'book':
      return {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        icon: null,
        label: ''
      };
    default:
      return { bg: '', text: '', icon: null, label: '' };
  }
};

const MoveCell: React.FC<{ move: string; rating?: MoveRating }> = ({ move, rating }) => {
  if (!move) return <td className="py-1"></td>;

  const style = rating ? getRatingStyle(rating) : null;

  return (
    <td className="py-1">
      <div className="flex items-center gap-1">
        <span className="text-slate-200 font-medium">{move}</span>
        {style && style.label && (
          <span
            className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold ${style.bg} ${style.text}`}
            title={rating || ''}
          >
            {style.icon}
            {style.label}
          </span>
        )}
      </div>
    </td>
  );
};

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, moveRatings = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Group moves into pairs (White, Black)
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      whiteRating: moveRatings[i] || null,
      black: history[i + 1] || '',
      blackRating: moveRatings[i + 1] || null,
    });
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-600 pb-2">Move History</h3>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2"
      >
        {movePairs.length === 0 ? (
          <p className="text-slate-500 text-sm italic text-center mt-10">Game hasn't started</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-400">
                <th className="py-1 w-10">#</th>
                <th className="py-1">White</th>
                <th className="py-1">Black</th>
              </tr>
            </thead>
            <tbody>
              {movePairs.map((pair) => (
                <tr key={pair.number} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-1 text-slate-500 font-mono">{pair.number}.</td>
                  <MoveCell move={pair.white} rating={pair.whiteRating} />
                  <MoveCell move={pair.black} rating={pair.blackRating} />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};