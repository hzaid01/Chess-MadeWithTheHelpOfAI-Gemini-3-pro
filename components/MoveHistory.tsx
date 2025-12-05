import React, { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
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
      black: history[i + 1] || '',
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
                <th className="py-1 w-12">#</th>
                <th className="py-1">White</th>
                <th className="py-1">Black</th>
              </tr>
            </thead>
            <tbody>
              {movePairs.map((pair) => (
                <tr key={pair.number} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-1 text-slate-500 font-mono">{pair.number}.</td>
                  <td className="py-1 text-slate-200 font-medium">{pair.white}</td>
                  <td className="py-1 text-slate-200 font-medium">{pair.black}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};