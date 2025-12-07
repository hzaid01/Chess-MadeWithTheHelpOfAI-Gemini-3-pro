<div align="center">
<img width="1200" height="475" alt="Zenith Chess Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zenith Chess AI

A high-performance chess application powered by **Stockfish 16** chess engine (~3200 ELO). Play against one of the strongest chess engines in the world, right in your browser!

## Features

- 🎮 **Two Engine Modes**:
  - **Stockfish** (~3200 ELO) - Maximum strength, runs in browser via WebAssembly
  - **EnitChess** - Lighter local minimax engine
- ♟️ Drag-and-drop or click-to-move piece interaction
- 🔊 Sound effects for moves, captures, and checks
- 📊 Real-time engine evaluation and analysis
- 🔄 Undo moves and swap sides
- 📱 Responsive design for all devices

## Engine: Stockfish

The AI uses **Stockfish 16** loaded as WebAssembly. No installation required - it runs entirely in your browser just like chess.com's analysis feature.

### Configuration

The engine is configured for maximum strength:
- **Depth**: 20 moves ahead
- **Skill Level**: 20 (maximum)
- **Move Time**: 3 seconds per move
- **Estimated ELO**: ~3200

> **Note**: Engine strength is limited by browser performance. On slower devices, the engine may not reach full depth.

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to play!

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── App.tsx                    # Main app with engine mode selector
├── components/
│   ├── ChessBoard.tsx        # Chess game logic and UI
│   ├── MoveHistory.tsx       # Move notation display
│   └── CapturedPieces.tsx    # Captured pieces display
├── services/
│   ├── stockfishService.ts   # Stockfish WASM integration
│   └── enitService.ts        # Local minimax engine
└── types.ts                  # TypeScript types
```

## How It Works

1. **Stockfish WASM** loads when the page opens
2. When it's the AI's turn, the current position (FEN) is sent to the engine
3. The engine calculates the best move using alpha-beta search
4. The response includes:
   - Best move in algebraic notation
   - Position evaluation (centipawns)
   - Principal variation (best line)
   - Search depth achieved

## Evaluation Scores

- Scores are in **centipawns** (1 pawn = 100 centipawns)
- Positive = White advantage
- Negative = Black advantage
- `Mate in X` = Checkmate is forced

## Deployment

The app is deployed on GitHub Pages:

**Live Demo**: https://hzaid01.github.io/Chess-MadeWithTheHelpOfAI-Gemini-3-pro/

```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

---

Built with React, TypeScript & Stockfish Engine
