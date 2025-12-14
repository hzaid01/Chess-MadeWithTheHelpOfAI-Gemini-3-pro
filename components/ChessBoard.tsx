import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { GameStatus } from '../types';
import { getBestChessMove, evaluatePosition, getMoveRating, MoveQuality } from '../services/stockfishService';
import { getBestMoveEnit } from '../services/enitService';
import { MoveHistory, MoveRating } from './MoveHistory';
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

  // Move accuracy tracking
  const [moveRatings, setMoveRatings] = useState<MoveRating[]>([]);
  const lastEvalRef = useRef<number>(0); // Track evaluation for rating moves

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

  // Handle piece drag start - show legal move hints while dragging
  const onPieceDragBegin = useCallback((piece: string, sourceSquare: string) => {
    // Only show if it's the player's turn and the piece is theirs
    if (gameStatus !== GameStatus.IN_PROGRESS || aiThinking) return;
    const game = gameRef.current;
    if (!piece || game.turn() !== userColor || piece[0] !== userColor) return;

    setSelectedSquare(sourceSquare);
    const moves = game.moves({ square: sourceSquare as any, verbose: true }) as Move[];
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newOptionSquares: Record<string, any> = {};
    moves.forEach((m) => {
      const isCapture = (m.flags || '').includes('c') || !!game.get(m.to as any);
      newOptionSquares[m.to] = isCapture
        ? {
          background:
            'radial-gradient(circle at center, rgba(255,0,0,0) 56%, rgba(255,0,0,0.85) 57%, rgba(255,0,0,0) 60%)',
          borderRadius: '50%',
        }
        : {
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0) 19%)',
          borderRadius: '50%',
        };
    });

    newOptionSquares[sourceSquare] = {
      boxShadow: 'inset 0 0 0 3px rgba(102,102,255,0.9)',
      background: 'rgba(255, 255, 0, 0.18)',
    };

    setOptionSquares(newOptionSquares);
  }, [aiThinking, gameStatus, userColor]);

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

    // Store evaluation before move for rating
    const evalBefore = lastEvalRef.current;

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

    // Evaluate move quality asynchronously (don't block the UI)
    const isPlayerMove = piece[0] === userColor;
    if (isPlayerMove && engineMode === 'stockfish') {
      // Async evaluation - add rating after calculation
      evaluatePosition(game.fen()).then((evalAfter) => {
        // Flip eval for black's perspective
        const normalizedBefore = userColor === 'w' ? evalBefore : -evalBefore;
        const normalizedAfter = userColor === 'w' ? evalAfter : -evalAfter;
        const rating = getMoveRating(normalizedBefore, normalizedAfter, true);

        lastEvalRef.current = evalAfter;
        setMoveRatings(prev => [...prev, rating]);
      }).catch(() => {
        // If evaluation fails, just add null rating
        setMoveRatings(prev => [...prev, null]);
      });
    } else {
      // For non-stockfish or AI moves during player turn, add null
      setMoveRatings(prev => [...prev, null]);
    }

    return true;
  }, [gameStatus, aiThinking, userColor, engineMode, checkSound, captureSound, moveSound, notifySound]);

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
      const isCapture = (move.flags || '').includes('c') || !!game.get(move.to as any);
      newOptionSquares[move.to] = isCapture
        ? {
          // Capture: red ring
          background:
            'radial-gradient(circle at center, rgba(255,0,0,0) 56%, rgba(255,0,0,0.85) 57%, rgba(255,0,0,0) 60%)',
          borderRadius: '50%',
        }
        : {
          // Quiet: dark dot
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0) 19%)',
          borderRadius: '50%',
        };
    });

    newOptionSquares[sourceSquare] = {
      // Selected square highlight
      boxShadow: 'inset 0 0 0 3px rgba(102,102,255,0.9)',
      background: 'rgba(255, 255, 0, 0.18)',
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

          let bestMove, reasoning, evalScore;

          if (engineMode === 'stockfish') {
            // Stockfish Mode (Maximum strength ~3200 ELO)
            const response = await getBestChessMove(currentFen, legalMoves, game.turn());
            bestMove = response.bestMove;
            reasoning = response.reasoning;
            evalScore = response.score;
          } else {
            // EnitChess Mode (Local minimax)
            const response = await getBestMoveEnit(currentFen, 4);
            bestMove = response.bestMove;
            reasoning = response.reasoning;
          }

          setAiReasoning(reasoning);

          const success = makeMove(bestMove);

          if (success) {
            // Update evaluation reference for next move rating
            if (evalScore !== undefined) {
              lastEvalRef.current = evalScore;
            }
            // Add AI move rating (AI moves are typically 'good' or better)
            setMoveRatings(prev => [...prev, 'good']);
          } else {
            console.warn("AI Best Move failed validation, using fallback");
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            makeMove(randomMove);
            setAiReasoning("Recalculating tactical fallback...");
            setMoveRatings(prev => [...prev, null]);
          }

        } catch (error) {
          console.error("AI Error", error);
          const legalMoves = game.moves();
          if (legalMoves.length > 0) {
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            makeMove(randomMove);
            setMoveRatings(prev => [...prev, null]);
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
    setMoveRatings([]);
    lastEvalRef.current = 0;
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
    <div className="flex flex-col gap-4 w-full">
      {/* Opponent (AI) Player Card */}
      <div className="bg-zenith-card border border-zenith-border rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`bg-gradient-to-br from-purple-700 to-indigo-900 rounded-xl h-12 w-12 border border-zenith-border shadow-inner flex items-center justify-center ${aiThinking ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-zenith-card' : ''}`}>
              <Cpu size={22} className="text-white" />
              {aiThinking && <div className="absolute inset-0 bg-purple-400 opacity-30 animate-ping rounded-xl"></div>}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-zenith-bg rounded-full p-0.5 border border-zenith-border">
              <span className="material-symbols-outlined text-zenith-primary text-[10px]">smart_toy</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-bold">Zenith AI</p>
              <span className="bg-red-500/20 text-red-200 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-500/50 uppercase tracking-wider">
                {engineMode === 'stockfish' ? '~3200' : 'Enit'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-xs font-mono">
                {aiThinking ? 'Thinking...' : 'Waiting'}
              </p>
              <CapturedPieces pieces={userColor === 'w' ? capturedWhite : capturedBlack} color={userColor} />
            </div>
          </div>
        </div>
        <div className="bg-zenith-bg px-4 py-2 rounded-lg border border-zenith-border flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-600 text-sm">timer</span>
          <p className="text-gray-400 text-lg font-mono font-bold tracking-widest opacity-80">--:--</p>
        </div>
      </div>

      {/* Chess Board */}
      <div className="w-full aspect-square bg-zenith-card rounded-xl p-1 shadow-2xl shadow-zenith-bg border border-zenith-border relative select-none">
        <div className="absolute left-1.5 top-1.5 text-[0.6rem] text-gray-600 font-bold z-10 pointer-events-none">
          {userColor === 'w' ? '8' : '1'}
        </div>
        <div className="absolute right-1.5 bottom-0.5 text-[0.6rem] text-gray-600 font-bold z-10 pointer-events-none">
          {userColor === 'w' ? 'H' : 'A'}
        </div>
        <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700/30">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDragEnd={onPieceDragEnd}
            onSquareClick={onSquareClick}
            boardOrientation={userColor === 'w' ? 'white' : 'black'}
            customDarkSquareStyle={{ backgroundColor: '#475569' }}
            customLightSquareStyle={{ backgroundColor: '#cbd5e1' }}
            customSquareStyles={{
              ...optionSquares,
              ...lastMoveSquares,
              ...checkSquare,
            }}
            animationDuration={300}
            arePiecesDraggable={true}
          />
        </div>

        {/* Game Over Overlay */}
        {gameStatus !== GameStatus.IN_PROGRESS && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 animate-in fade-in p-4 rounded-xl">
            <div className="bg-zenith-card p-6 sm:p-8 rounded-2xl shadow-2xl border border-zenith-primary/30 text-center transform scale-100 max-w-sm w-full">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight uppercase drop-shadow-lg">Game Over</h2>
              <p className="text-lg sm:text-xl text-zenith-accent mb-8 font-medium">{gameOutcomeMessage}</p>
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-zenith-primary to-indigo-600 hover:from-zenith-accent hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-glow hover:shadow-zenith-primary/60 flex items-center justify-center gap-2 active:scale-95"
              >
                <RefreshCw size={20} /> Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Player (Human) Card */}
      <div className="bg-zenith-card border border-zenith-border rounded-2xl p-3 flex items-center justify-between shadow-glow ring-1 ring-zenith-primary/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-slate-700 rounded-xl h-12 w-12 border-2 border-zenith-primary flex items-center justify-center">
              <span className="font-bold text-white text-xs">YOU</span>
            </div>
            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-zenith-card shadow-[0_0_8px_rgba(99,102,241,0.8)] ${userColor === 'w' ? 'bg-white' : 'bg-gray-800'}`}></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-bold">Challenger</p>
              {gameRef.current.turn() === userColor && gameStatus === GameStatus.IN_PROGRESS && (
                <span className="bg-zenith-primary/10 text-zenith-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-zenith-primary/20 tracking-wider">Turn</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-xs font-mono">Playing as {userColor === 'w' ? 'White' : 'Black'}</p>
              <CapturedPieces pieces={userColor === 'w' ? capturedBlack : capturedWhite} color={userColor === 'w' ? 'b' : 'w'} />
            </div>
          </div>
        </div>
        <div className={`bg-zenith-bg px-4 py-2 rounded-lg border flex items-center gap-2 relative overflow-hidden group ${gameRef.current.turn() === userColor ? 'border-zenith-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-zenith-border'}`}>
          {gameRef.current.turn() === userColor && <div className="absolute inset-0 bg-zenith-primary/5 group-hover:bg-zenith-primary/10 transition-colors"></div>}
          <span className={`material-symbols-outlined text-sm relative z-10 ${gameRef.current.turn() === userColor ? 'text-zenith-primary' : 'text-gray-600'}`}>timer</span>
          <p className={`text-lg font-mono font-bold tracking-widest relative z-10 ${gameRef.current.turn() === userColor ? 'text-white' : 'text-gray-400'}`}>--:--</p>
        </div>
      </div>

      {/* Move History Panel */}
      <div className="bg-zenith-card border border-zenith-border rounded-xl p-3 flex flex-col gap-2 shadow-sm">
        <div className="flex justify-between items-center border-b border-zenith-border pb-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500 text-sm">history</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Move History</span>
          </div>
          <span className="text-[10px] text-gray-600 font-mono">
            {engineMode === 'stockfish' ? 'Stockfish 17' : 'EnitChess'}
          </span>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar text-sm font-mono scroll-smooth">
          {history.length === 0 ? (
            <span className="text-gray-600 text-xs">No moves yet</span>
          ) : (
            history.reduce((acc: React.ReactNode[], move, index) => {
              const moveNumber = Math.floor(index / 2) + 1;
              const isWhiteMove = index % 2 === 0;
              const isLatest = index === history.length - 1;

              if (isWhiteMove) {
                acc.push(
                  <div key={moveNumber} className={`flex-shrink-0 flex items-center gap-2 ${isLatest ? 'bg-zenith-primary/10 px-2 py-0.5 rounded border border-zenith-primary/20' : 'text-gray-500'}`}>
                    <span className="text-gray-600 w-5">{moveNumber}.</span>
                    <span className={isLatest ? 'text-white font-bold' : ''}>{move}</span>
                    {!isLatest && history[index + 1] && <span>{history[index + 1]}</span>}
                    {isLatest && !history[index + 1] && aiThinking && <span className="animate-pulse text-zenith-primary">...</span>}
                  </div>
                );
              }
              return acc;
            }, [])
          )}
        </div>
      </div>

      {/* AI Reasoning Panel */}
      {aiReasoning && (
        <div className="bg-zenith-card rounded-xl p-4 shadow-lg border border-zenith-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BrainCircuit size={60} className="text-zenith-primary" />
          </div>
          <h3 className="text-xs font-bold text-zenith-accent mb-3 flex items-center gap-2 uppercase tracking-wider border-b border-zenith-primary/20 pb-2">
            <BrainCircuit size={14} /> Zenith Logic
          </h3>
          <div className="text-gray-300 text-sm leading-relaxed max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
            <p className="italic border-l-2 border-zenith-primary pl-3 py-1 bg-zenith-primary/5 rounded-r">"{aiReasoning}"</p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <button
          onClick={resetGame}
          disabled={aiThinking}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zenith-border bg-zenith-card hover:bg-white/5 text-gray-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wide group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className="group-hover:scale-110 transition-transform" /> New Game
        </button>
        <button
          onClick={undoMove}
          disabled={aiThinking || history.length === 0 || gameStatus !== GameStatus.IN_PROGRESS}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zenith-border bg-zenith-card hover:bg-white/5 text-gray-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wide group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} className="group-hover:-rotate-45 transition-transform" /> Undo
        </button>
        <button
          onClick={swapSides}
          disabled={aiThinking || gameStatus !== GameStatus.IN_PROGRESS}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zenith-border bg-zenith-card hover:bg-white/5 text-gray-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wide group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftRight size={16} className="group-hover:rotate-180 transition-transform" /> Swap
        </button>
      </div>
    </div>
  );
};