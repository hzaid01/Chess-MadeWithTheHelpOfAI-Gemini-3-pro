import React from 'react';
import { ChessGame } from './components/ChessBoard';
import { Login } from './components/Login';
import { MainMenu } from './components/MainMenu';
import { Profile } from './components/Profile';
import Settings from './components/Settings';
import { Bot } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showMainMenu, setShowMainMenu] = React.useState(true);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [engineMode, setEngineMode] = React.useState<'stockfish' | 'enit'>('stockfish');

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Show profile page
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  // Show settings page
  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  // Show main menu after login
  if (showMainMenu) {
    return (
      <MainMenu
        onStartAIMatch={() => setShowMainMenu(false)}
        onPlayOnline={() => alert('Play Online coming soon!')}
        onJoinFriend={() => alert('Join Friend coming soon!')}
        onSolvePuzzles={() => alert('Puzzles coming soon!')}
        onTournaments={() => alert('Tournaments coming soon!')}
        onProfile={() => setShowProfile(true)}
        onSettings={() => setShowSettings(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zenith-bg font-display text-white flex flex-col overflow-x-hidden selection:bg-zenith-primary selection:text-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 justify-between sticky top-0 z-20 backdrop-blur-md bg-zenith-bg/90 border-b border-zenith-border">
        <div
          onClick={() => setShowMainMenu(true)}
          className="text-gray-400 flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-zenith-card hover:text-white transition-colors cursor-pointer border border-transparent hover:border-zenith-border"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-zenith-primary text-xl">smart_toy</span>
            <h2 className="text-white text-base font-bold tracking-wide uppercase">Zenith Chess</h2>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
              {engineMode === 'stockfish' ? 'Ranked • ~3200 ELO' : 'EnitChess Mode'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zenith-card rounded-lg p-1 border border-zenith-border">
            <button
              onClick={() => setEngineMode('stockfish')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${engineMode === 'stockfish' ? 'bg-zenith-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Stockfish
            </button>
            <button
              onClick={() => setEngineMode('enit')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${engineMode === 'enit' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Enit
            </button>
          </div>
          <div
            onClick={() => setShowSettings(true)}
            className="flex size-10 items-center justify-center rounded-lg bg-zenith-card border border-zenith-border text-zenith-accent cursor-pointer hover:bg-zenith-border transition-colors"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4 justify-center">
        <ChessGame engineMode={engineMode} />
      </main>

      {/* Footer */}
      <footer className="bg-zenith-bg pb-8 pt-2 px-4 flex flex-col gap-4 border-t border-zenith-border">
        <div className="max-w-lg mx-auto w-full text-center">
          <p className="text-gray-600 text-xs">Built with React, TypeScript & Stockfish Engine</p>
        </div>
      </footer>
    </div>
  );
}

export default App;