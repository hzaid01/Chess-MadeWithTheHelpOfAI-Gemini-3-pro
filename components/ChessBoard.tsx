import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { GameStatus } from '../types';
import { getBestChessMove } from '../services/stockfishService';
import { getBestMoveEnit } from '../services/enitService';
import { MoveHistory } from './MoveHistory';
import { CapturedPieces } from './CapturedPieces';
import { BrainCircuit, RefreshCw, RotateCcw, Cpu, ArrowLeftRight } from 'lucide-react';

interface ChessGameProps {
  engineMode: 'stockfish' | 'enit';
}

export const ChessGame: React.FC<ChessGameProps> = ({ engineMode }) => {
  // Initialize gameRef with a new game instance
  const gameRef = useRef<Chess>(new Chess());

  // State
  const [fen, setFen] = useState(gameRef.current.fen());
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
  const [userColor, setUserColor] = useState<'w' | 'b'>('w'); // Default: User is White
  const [aiThinking, setAiThinking] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [gameOutcomeMessage, setGameOutcomeMessage] = useState<string>('');

  // Visual hints state
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [lastMoveSquares, setLastMoveSquares] = useState<Record<string, any>>({});
  const [checkSquare, setCheckSquare] = useState<Record<string, any>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Sounds
  const moveSound = useMemo(() => new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_common/move-self.mp3'), []);
  const captureSound = useMemo(() => new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_common/capture.mp3'), []);
  const checkSound = useMemo(() => new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_common/move-check.mp3'), []);
  const notifySound = useMemo(() => new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_common/notify.mp3'), []);

  const playSound = (move: Move | null, isCheck: boolean) => {
    if (isCheck) {
      checkSound.play().catch(() => { });
      return;
    }
    if (move && (move.captured || move.flags.includes('e'))) {
      captureSound.play().catch(() => { });
    } else {
      moveSound.play().catch(() => { });
    }
  };

  const checkGameStatus = (game: Chess) => {
    if (game.isCheckmate()) {
      setGameStatus(GameStatus.CHECKMATE);
      setGameOutcomeMessage(game.turn() === userColor ? 'Zenith AI wins by Checkmate!' : 'You win by Checkmate!');
      notifySound.play().catch(() => { });
    } else if (game.isDraw()) {
      setGameStatus(GameStatus.DRAW);
      setGameOutcomeMessage('Game drawn.');
    } else if (game.isStalemate()) {
      setGameStatus(GameStatus.STALEMATE);
      setGameOutcomeMessage('Game drawn by Stalemate.');
    } else if (game.isInsufficientMaterial()) {
      setGameStatus(GameStatus.INSUFFICIENT_MATERIAL);
      setGameOutcomeMessage('Draw by Insufficient Material.');
    } else {
      setGameStatus(GameStatus.IN_PROGRESS);
      setGameOutcomeMessage('');
    }
  };

  const makeMove = useCallback((moveInput: string | { from: string; to: string; promotion?: string }) => {
    const game = gameRef.current;
    let result: Move | null = null;

    try {
      // 1. Try move as provided
      try {
        result = game.move(moveInput);
      } catch (e) {
        // 2. If it fails and is a robust object, try enforcing promotion to Queen
        if (typeof moveInput === 'object' && 'from' in moveInput && 'to' in moveInput) {
          result = game.move({ ...moveInput, promotion: 'q' });
        } else {
          throw e;
        }
      }
    } catch (e) {
      // console.warn("Move failed:", moveInput, e);
      result = null;
    }

    if (result) {
      playSound(result, game.isCheck());
      setFen(game.fen());

      // Highlight move
      setLastMoveSquares({
        [result.from]: { background: 'rgba(255, 255, 0, 0.4)' },
        [result.to]: { background: 'rgba(255, 255, 0, 0.4)' }
      });

      // Highlight Check
      if (game.isCheck()) {
        const board = game.board();
        let kingSquare = '';
        board.forEach((row, rowIndex) => {
          row.forEach((piece, colIndex) => {
            if (piece && piece.type === 'k' && piece.color === game.turn()) {
              const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
              const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
              kingSquare = `${files[colIndex]}${ranks[rowIndex]}`;
            }
          });
        });
        if (kingSquare) {
          setCheckSquare({ [kingSquare]: { background: 'radial-gradient(circle, rgba(255,0,0,0.8) 40%, transparent 80%)' } });
        }
      } else {
        setCheckSquare({});
      }

      checkGameStatus(game);

      return true;
    }

    return false;
  }, [checkSound, captureSound, moveSound, notifySound, userColor]);

  // Handle piece drag start - simplified
  const onPieceDragBegin = useCallback((piece: string, sourceSquare: string) => {
    console.log("Drag started", piece, sourceSquare);
    // if (gameStatus !== GameStatus.IN_PROGRESS || aiThinking) return;

    // const game = gameRef.current;

    // // Only show options if it's user's turn and piece belongs to user
    // if (game.turn() !== userColor || !piece || piece[0] !== userColor) return;

    // // Get all legal moves for this piece (like SwiftUI's getDropLegalState)
    // const moves = game.moves({ square: sourceSquare as any, verbose: true }) as Move[];
    // if (moves.length === 0) {
    //   setOptionSquares({});
    //   return;
    // }

    // const sourcePiece = game.get(sourceSquare as any);
    // const newOptionSquares: Record<string, any> = {};

    // // Mark all legal drop targets (like SwiftUI's green border for accepted drops)
    // moves.forEach((move) => {
    //   const targetPiece = game.get(move.to as any);
    //   newOptionSquares[move.to] = {
    //     background: targetPiece && targetPiece.color !== sourcePiece?.color
    //       ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // Capture indicator
    //       : 'radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)', // Regular move indicator
    //     borderRadius: '50%',
    //   };
    // });

    // newOptionSquares[sourceSquare] = {
    //   background: 'rgba(255, 255, 0, 0.4)',
    // };

    // setOptionSquares(newOptionSquares);
  }, []);

  // Handle drag end - clear option squares
  const onPieceDragEnd = useCallback(() => {
    setOptionSquares({});
  }, []);

  // Handle piece drop - simplified for robustness
  const onDrop = useCallback((sourceSquare: string, targetSquare: string, piece: string) => {
    // Early exit: prevent drops if game is over
    if (gameStatus !== GameStatus.IN_PROGRESS) {
      console.warn("Drop rejected: Game over");
      return false;
    }

    const game = gameRef.current;

    // Defensive check: If AI is thinking, we block move
    if (aiThinking) {
      console.warn("Drop rejected: AI is thinking");
      return false;
    }

    console.log(`Attempting drop: ${sourceSquare} -> ${targetSquare} (${piece})`);
    console.log(`Current Turn: ${game.turn()} | User Color: ${userColor}`);

    // Try to make the move
    // Note: react-chessboard calls onPieceDrop(source, target, piece)
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // Always promote to queen for simplicity
    });

    // If move is null, it was illegal
    if (move === null) {
      console.warn("Drop rejected: Illegal move according to chess.js");
      // Debug legal moves
      // console.log("Legal moves:", game.moves());
      return false;
    }

    console.log("Move successful:", move);

    // Move was successful - update FEN state immediately
    setFen(game.fen());

    // Play sound feedback
    playSound(move, game.isCheck());

    // Highlight the move (visual feedback)
    setLastMoveSquares({
      [move.from]: { background: 'rgba(255, 255, 0, 0.4)' },
      [move.to]: { background: 'rgba(255, 255, 0, 0.4)' }
    });

    // Highlight check if applicable
    if (game.isCheck()) {
      // ... (existing check highlight logic can remain or be simplified)
      // For robustness, lets keeping "setCheckSquare({})" if no check
      const board = game.board();
      let kingSquare = '';
      board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
          if (piece && piece.type === 'k' && piece.color === game.turn()) {
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
            kingSquare = `${files[colIndex]}${ranks[rowIndex]}`;
          }
        });
      });
      if (kingSquare) {
        setCheckSquare({ [kingSquare]: { background: 'radial-gradient(circle, rgba(255,0,0,0.8) 40%, transparent 80%)' } });
      }
    } else {
      setCheckSquare({});
    }

    // Check game status (checkmate, draw, etc.)
    checkGameStatus(game);

    // Clear visual selection state
    setOptionSquares({});
    setSelectedSquare(null);

    return true;
  }, [gameStatus, aiThinking, checkSound, captureSound, moveSound, notifySound]);

  // Click-to-move handler for better mobile support (unchanged)
  const onSquareClick = (square: string) => {
    if (gameStatus !== GameStatus.IN_PROGRESS || aiThinking) return;
    if (gameRef.current.turn() !== userColor) return;

    const game = gameRef.current;
    const piece = game.get(square as any);

    // If a square is already selected
    if (selectedSquare) {
      // Try to make a move from selected square to clicked square
      const moveSuccess = makeMove({
        from: selectedSquare,
        to: square,
        promotion: 'q'
      });

      if (moveSuccess) {
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }

      // If move failed but clicked on own piece, select new piece
      if (piece && piece.color === userColor) {
        setSelectedSquare(square);
        showMoveOptions(square);
        return;
      }

      // Otherwise deselect
      setSelectedSquare(null);
      setOptionSquares({});
      return;
    }

    // No square selected - select this piece if it's ours
    if (piece && piece.color === userColor) {
      setSelectedSquare(square);
      showMoveOptions(square);
    }
  };

  const showMoveOptions = (sourceSquare: string) => {
    const game = gameRef.current;
    const moves = game.moves({ square: sourceSquare as any, verbose: true }) as Move[];

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newOptionSquares: Record<string, any> = {};
    moves.forEach((move) => {
      newOptionSquares[move.to] = {
        background:
          game.get(move.to as any) && game.get(move.to as any).color !== game.get(sourceSquare as any).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });

    newOptionSquares[sourceSquare] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };

    setOptionSquares(newOptionSquares);
  };

  // AI Turn Logic (unchanged except it relies on makeMove which now is robust)
  useEffect(() => {
    const game = gameRef.current;
    console.log('[AI Effect] Triggered. turn:', game.turn(), 'userColor:', userColor, 'gameStatus:', gameStatus, 'aiThinking:', aiThinking);
    // AI moves if it's NOT the user's turn and game is active
    if (game.turn() !== userColor && gameStatus === GameStatus.IN_PROGRESS) {
      console.log('[AI Effect] Starting AI turn...');
      const playAiTurn = async () => {
        setAiThinking(true);
        // No artificial delay - Stockfish calculates instantly

        try {
          const legalMoves = game.moves();
          const pgn = game.pgn();
          const currentFen = game.fen();

          if (legalMoves.length === 0) {
            checkGameStatus(game);
            setAiThinking(false);
            return;
          }

          let bestMove, reasoning;

          if (engineMode === 'stockfish') {
            // Stockfish Mode (Maximum strength ~3200 ELO)
            const response = await getBestChessMove(currentFen, legalMoves, game.turn());
            bestMove = response.bestMove;
            reasoning = response.reasoning;
          } else {
            // EnitChess Mode (Local minimax)
            const response = await getBestMoveEnit(currentFen, 4);
            bestMove = response.bestMove;
            reasoning = response.reasoning;
          }

          setAiReasoning(reasoning);

          const success = makeMove(bestMove);

          if (!success) {
            console.warn("AI Best Move failed validation, using fallback");
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            makeMove(randomMove);
            setAiReasoning("Recalculating tactical fallback...");
          }

        } catch (error) {
          console.error("AI Error", error);
          const legalMoves = game.moves();
          if (legalMoves.length > 0) {
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            makeMove(randomMove);
          }
        } finally {
          setAiThinking(false);
        }
      };

      playAiTurn();
    }
  }, [fen, gameStatus, userColor, makeMove, engineMode]);

  // Handle window resize to ensure board remains interactive
  useEffect(() => {
    const handleResize = () => setFen(gameRef.current.fen()); // Force re-render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const resetGame = () => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setGameStatus(GameStatus.IN_PROGRESS);
    setAiThinking(false);
    setAiReasoning(null);
    setGameOutcomeMessage('');
    setLastMoveSquares({});
    setCheckSquare({});
    setOptionSquares({});
    setSelectedSquare(null);
  };

  const swapSides = () => {
    setUserColor(prev => prev === 'w' ? 'b' : 'w');
    setSelectedSquare(null);
    setOptionSquares({});
    // If we swap mid-game, the AI will immediately pick up if it becomes its turn
  };

  const undoMove = () => {
    const game = gameRef.current;
    if (game.history().length < 2 || aiThinking) return;

    // Undo 2 moves (AI + User)
    game.undo();
    game.undo();
    setFen(game.fen());
    setGameStatus(GameStatus.IN_PROGRESS);
    setAiThinking(false);
    setLastMoveSquares({});
    setCheckSquare({});
    setOptionSquares({});
    setSelectedSquare(null);
  };

  // Data for rendering
  const history = gameRef.current.history();
  const historyVerbose = gameRef.current.history({ verbose: true });
  const capturedWhite = historyVerbose.filter(m => m.color === 'w' && m.captured).map(m => m.captured as string);
  const capturedBlack = historyVerbose.filter(m => m.color === 'b' && m.captured).map(m => m.captured as string);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full px-2 sm:px-4">
      {/* Left Column: Board Area */}
      <div className="flex-1 flex flex-col items-center gap-4 w-full">

        {/* Opponent (AI) */}
        <div className="w-full flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-full flex items-center justify-center relative overflow-hidden shadow-lg border-2 border-purple-500/30 ${aiThinking ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800' : ''}`}>
              <Cpu size={20} className="text-white z-10" />
              {aiThinking && <div className="absolute inset-0 bg-purple-400 opacity-30 animate-ping"></div>}
            </div>
            <div>
              <h2 className="font-bold text-slate-100 flex flex-wrap items-center gap-2 text-sm sm:text-lg">
                Zenith AI
                <span className="text-[10px] bg-red-500/20 text-red-200 px-2 py-0.5 rounded border border-red-500/50 font-bold tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.3)]">UNBEATABLE</span>
              </h2>
              <div className="flex items-center gap-2">
                {aiThinking ? (
                  <><span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span><p className="text-xs text-slate-400">Thinking...</p></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-slate-600"></span><p className="text-xs text-slate-400">Waiting</p></>
                )}
              </div>
            </div>
          </div>
          {/* Show pieces captured by AI (User's pieces) */}
          <CapturedPieces pieces={userColor === 'w' ? capturedWhite : capturedBlack} color={userColor} />
        </div>

        {/* Board */}
        <div
          className="relative w-full max-w-[600px] aspect-square shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border-4 border-slate-700 bg-slate-900 mx-auto"
        >
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDragEnd={onPieceDragEnd}
            onSquareClick={onSquareClick}
            boardOrientation={userColor === 'w' ? 'white' : 'black'}
            customDarkSquareStyle={{ backgroundColor: '#334155' }}
            customLightSquareStyle={{ backgroundColor: '#94a3b8' }}
            animationDuration={300}
            arePiecesDraggable={true}
          />

          {/* Game Over Overlay */}
          {gameStatus !== GameStatus.IN_PROGRESS && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 animate-in fade-in p-4">
              <div className="bg-slate-900/95 p-6 sm:p-8 rounded-2xl shadow-2xl border border-purple-500/30 text-center transform scale-100 max-w-sm w-full">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight uppercase drop-shadow-lg">Game Over</h2>
                <p className="text-lg sm:text-xl text-purple-300 mb-8 font-medium">{gameOutcomeMessage}</p>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-purple-500/60 flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw size={20} /> Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Player Info (Human) */}
        <div className="w-full flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-full flex items-center justify-center shadow-inner border border-slate-600 relative">
              <span className="font-bold text-white text-[10px] sm:text-xs">YOU</span>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 flex items-center justify-center ${userColor === 'w' ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white'}`}>
                <span className="text-[8px] font-bold">{userColor === 'w' ? 'W' : 'B'}</span>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm sm:text-lg">Challenger</h2>
              <p className={`text-xs ${gameRef.current.turn() === userColor ? 'text-green-400 font-bold' : 'text-slate-500'}`}>
                {gameRef.current.turn() === userColor ? 'Your turn' : '...'}
              </p>
            </div>
          </div>
          {/* Show pieces captured by Human (AI's pieces) */}
          <CapturedPieces pieces={userColor === 'w' ? capturedBlack : capturedWhite} color={userColor === 'w' ? 'b' : 'w'} />
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full justify-center mt-2 mb-4 lg:mb-0">
          <button
            onClick={resetGame}
            disabled={aiThinking}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-900 shadow-sm text-sm"
          >
            <RefreshCw size={18} /> New Game
          </button>
          <button
            onClick={undoMove}
            disabled={aiThinking || history.length === 0 || gameStatus !== GameStatus.IN_PROGRESS}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-900 shadow-sm text-sm"
          >
            <RotateCcw size={18} /> Undo
          </button>
          <button
            onClick={swapSides}
            disabled={aiThinking || gameStatus !== GameStatus.IN_PROGRESS}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-900 shadow-sm text-sm"
            title="Swap Sides (AI will move immediately if it becomes its turn)"
          >
            <ArrowLeftRight size={18} /> Swap
          </button>
        </div>

      </div>

      {/* Right Column: Info Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* AI Thought Process */}
        <div className="bg-slate-800 rounded-xl p-5 shadow-xl border border-slate-700 flex-shrink-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BrainCircuit size={80} className="text-purple-500" />
          </div>
          <h3 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-purple-500/20 pb-2">
            <BrainCircuit size={16} /> Zenith Logic
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed max-h-[150px] overflow-y-auto pr-2 custom-scrollbar min-h-[100px]">
            {aiReasoning ? (
              <div className="animate-in fade-in duration-500">
                <p className="italic border-l-2 border-purple-500 pl-3 py-1 bg-purple-500/5 rounded-r">"{aiReasoning}"</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                <span className="text-xs uppercase tracking-widest opacity-50">System Standby</span>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-hidden h-[300px] lg:h-auto lg:min-h-[400px] bg-slate-800 rounded-xl border border-slate-700 shadow-lg mb-8 lg:mb-0">
          <MoveHistory history={history} />
        </div>
      </div>
    </div>
  );
};