import { Chess, Move } from 'chess.js';

// Piece Values (from EnitChess piece.h/cpp classes)
// Pawn: 1, Knight: 4, Bishop: 3, Rook: 5, Queen: 10, King: 999
const PIECE_VALUES: Record<string, number> = {
    p: 1,
    n: 4,
    b: 3,
    r: 5,
    q: 10,
    k: 999,
};

interface EnitMoveResponse {
    bestMove: string | { from: string; to: string; promotion?: string };
    reasoning: string;
}

// Evaluate the board from the perspective of the current turn's player
// Ported from Ai::scoreChessboard in player.h
const scoreChessboard = (game: Chess, playerColor: 'w' | 'b'): number => {
    let score = 0;
    const board = game.board();

    // EnitChess iterates 0-7, 0-7. chess.js board is 8x8 array.
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = board[rank][file];
            if (piece) {
                if (piece.color === playerColor) {
                    score += PIECE_VALUES[piece.type] || 0;
                } else {
                    score -= PIECE_VALUES[piece.type] || 0;
                }
            }
        }
    }
    return score;
};

// Alpha-Beta Minimax implementation
// Ported from Ai::ABminimax / ABfindMin / ABfindMax in player.cpp
// Note: EnitChess uses separate functions for Min and Max. We can combine or keep separate.
// Keeping separate to stay true to source structure for easier comparison.

const MAX_DEPTH_HARD = 4; // Corresponding to difficulty >= 4 in EnitChess
const MAX_DEPTH_EASY = 2; // For weaker settings if needed

const abFindMin = (game: Chess, depth: number, alpha: number, beta: number, playerColor: 'w' | 'b'): number => {
    // Min node: Opponent's turn. We want to minimize score.
    // If we are checkmated here (previous move by AI caused checkmate), AI wins.
    if (game.isCheckmate()) {
        return 10000 + depth;
    }
    if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
        return 0;
    }
    if (depth === 0 || game.isGameOver()) {
        return scoreChessboard(game, playerColor);
    }

    const moves = game.moves();
    // Fallback if no moves but not checkmate (stalemate is covered above)
    if (moves.length === 0) return 0;

    let bestScore = 15000;

    for (const move of moves) {
        game.move(move);
        // After move, it is opponent's turn. We want to find MAX for us (which is their Min?).
        // Wait, ABFindMin means it is OPPONENT'S turn (minimizing our score).
        // So next level is ABFindMax for US.

        const value = abFindMax(game, depth - 1, alpha, beta, playerColor);
        game.undo();

        if (value < bestScore) {
            bestScore = value;
            beta = Math.min(beta, value);
        }
        if (beta <= alpha) {
            return bestScore; // Pruning
        }
    }
    return bestScore;
};

const abFindMax = (game: Chess, depth: number, alpha: number, beta: number, playerColor: 'w' | 'b'): number => {
    // Max node: Our turn. We want to maximize score.
    // If we are checkmated here (previous move by Opponent caused checkmate), AI loses.
    if (game.isCheckmate()) {
        return -10000 - depth;
    }
    if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
        return 0;
    }
    if (depth === 0 || game.isGameOver()) {
        return scoreChessboard(game, playerColor);
    }

    const moves = game.moves();

    let bestScore = -15000;

    for (const move of moves) {
        game.move(move);
        const value = abFindMin(game, depth - 1, alpha, beta, playerColor);
        game.undo();

        if (value > bestScore) {
            bestScore = value;
            alpha = Math.max(alpha, value);
        }
        if (beta <= alpha) {
            return bestScore;
        }
    }
    return bestScore;
};


export const getBestMoveEnit = async (fen: string, depth: number = 3): Promise<EnitMoveResponse> => {
    // We use a new Chess instance to simulate moves without affecting UI state directly
    const game = new Chess(fen);
    const turn = game.turn();
    const moves = game.moves({ verbose: true });

    if (moves.length === 0) {
        return { bestMove: '', reasoning: 'No legal moves' };
    }

    let bestMove: Move | null = null;
    let bestScore = -20000;
    let alpha = -20000;
    let beta = 20000;

    console.log(`[EnitService] Starting Search Depth ${depth} for ${turn}`);
    const startTime = performance.now();

    // Shuffle moves for better pruning potential? Enit uses rand() % 6 == 2 to inject randomness for equal moves.
    // We will shuffle simply.
    moves.sort(() => Math.random() - 0.5);

    // Root Maximize
    for (const move of moves) {
        game.move(move);

        // We moved, now it is opponent turn (Min node)
        const value = abFindMin(game, depth - 1, alpha, beta, turn);

        game.undo();

        // Enit logic: if value > bestscore OR (value == bestscore && random chance)
        if (value > bestScore) {
            bestScore = value;
            bestMove = move;
            alpha = Math.max(alpha, value);
        }
    }

    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    // Format reasoning similar to Gemini but from engine stats
    const reasoning = `EnitChess Engine (Depth ${depth}): Evaluated position score ${bestScore}. Calculated in ${timeTaken}s.`;

    return {
        bestMove: bestMove || moves[0], // Fallback
        reasoning
    };
};
