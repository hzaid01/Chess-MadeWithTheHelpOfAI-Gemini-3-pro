<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1u1RJpN5AB6ZnpnKgshuGzPT1zuMLoYGt

## Run Locally

**Prerequisites:**  Node.js
<div align="center">
  <img alt="Project banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zenith Chess AI

Lightweight React + TypeScript frontend that integrates a C++ chess engine. This repository contains the web UI, service wrappers, and the original C++ engine source under `src/cpp/enitchess` (and a duplicate `temp_enitchess`).

**Quick links**
- Repository: `https://github.com/hzaid01/Chess-MadeWithTheHelpOfAI-Gemini-3-pro`

**Contents**
- `App.tsx`, `index.tsx`, `components/` — React UI and components
- `services/` — TypeScript services (Gemini integration helper)
- `src/cpp/enitchess` and `temp_enitchess` — C++ engine sources and assets
- `package.json` / `tsconfig.json` / `vite.config.ts` — project tooling

**Notes**
- The C++ folders were previously embedded git repositories; they have been converted to regular folders in this repo.
- Some assets and files live in both `src/cpp/enitchess` and `temp_enitchess` — keep only the one you need.

**Prerequisites**
- Node.js (recommended: 16+)
- npm (or yarn/pnpm)

## Development (Local)

1. Install dependencies

```pwsh
npm install
```

2. Set environment variables

- Copy `.env.local` if needed and set `GEMINI_API_KEY` to your Gemini API key.

3. Run the dev server

```pwsh
npm run dev
```

Open `http://localhost:5173` (or the port shown by Vite) to view the app.

## Build

```pwsh
npm run build
```

## C++ Engine

The C++ engine is included for reference. It is not built by the Node toolchain.
If you want to build the C++ part (Windows example):

```pwsh
# Use a suitable build environment (e.g., MSYS2/MinGW or Visual Studio)
# Example with g++ (MSYS2/MinGW):
g++ -std=c++17 -O2 -Isrc/cpp/enitchess/src src/cpp/enitchess/main.cpp -o enitchess.exe
```

## Git / Contribution notes
- The repository's `main` branch is already set to track `origin/main` at `https://github.com/hzaid01/Chess-MadeWithTheHelpOfAI-Gemini-3-pro.git`.
- If you want commit authorship corrected locally, run:

```pwsh
git config user.name "Your Real Name"
git config user.email "you@example.com"
git commit --amend --author="Your Real Name <you@example.com>" --no-edit
git push --force-with-lease
```

## Next steps / Suggestions
- Remove one of the duplicate C++ folders if not needed.
- Add a top-level `LICENSE` if you'd like to set a project license.
- Add CI (GitHub Actions) for build/lint checks.

---

If you want, I can: convert the remaining C++ duplicate into a single folder, add a license, or create a basic GitHub Actions workflow. Tell me which and I will proceed.
