export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CHECKMATE = 'CHECKMATE',
  DRAW = 'DRAW',
  STALEMATE = 'STALEMATE',
  INSUFFICIENT_MATERIAL = 'INSUFFICIENT_MATERIAL',
}

export enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI'
}

export interface AIMoveResponse {
  bestMove: string;
  reasoning: string;
}

export interface GameState {
  fen: string;
  history: string[];
  status: GameStatus;
  turn: 'w' | 'b';
  lastMove: string | null;
  capturedPieces: {
    w: string[];
    b: string[];
  };
}