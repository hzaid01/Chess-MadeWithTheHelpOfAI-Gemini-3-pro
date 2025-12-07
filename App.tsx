import React from 'react';
import { ChessGame } from './components/ChessBoard';
import { Bot } from 'lucide-react';

function App() {
  const [engineMode, setEngineMode] = React.useState<'stockfish' | 'enit'>('stockfish');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-950/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-1.5 sm:p-2 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <Bot className="text-white w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Zenith Chess
              </h1>
              <p className="hidden sm:block text-xs text-slate-400 font-medium tracking-wide">
                POWERED BY STOCKFISH ENGINE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 mr-4">
            <button
              onClick={() => setEngineMode('stockfish')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${engineMode === 'stockfish' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Stockfish
            </button>
            <button
              onClick={() => setEngineMode('enit')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${engineMode === 'enit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              EnitChess
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${engineMode === 'stockfish' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${engineMode === 'stockfish' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
            </span>
            <span className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide uppercase">
              {engineMode === 'stockfish' ? '~3200 ELO' : 'Engine Mode'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-0 sm:p-4 md:p-8 flex items-start justify-center overflow-x-hidden w-full">
        <ChessGame engineMode={engineMode} />
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-slate-600 text-xs sm:text-sm border-t border-slate-800/50 mt-auto">
        <p>Built with React, TypeScript & Stockfish Engine</p>
      </footer>
    </div>
  );
}

export default App;