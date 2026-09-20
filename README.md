# RONIN X ///

A premium procedural 2D/2.5D Web3 loot-box and equipment collection game. The complete experience works in mock mode with no wallet, blockchain, remote images, video, 3D models, or external art assets.

## Installation

```bash
npm install
npm run generate-assets
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Game modes

Copy `.env.example` to `.env.local`. Mock mode is the default:

```env
NEXT_PUBLIC_GAME_MODE=mock
```

Mock mode supports wallet simulation, crates, randomized drops, inventory persistence, equipment, forging, burning, and marketplace purchases. Player state is stored in localStorage.

For future contract integration, set `NEXT_PUBLIC_GAME_MODE=web3`, configure WalletConnect, and implement the `BlockchainService` interface in `lib/web3.ts`. Its methods cover crate opening, minting, equipping, forging, burning, listing, buying, and transfers. The current app never fakes an on-chain confirmation.

## Asset generation

`npm run generate-assets` recreates crate SVGs, equipment symbols, rarity badges, and the industrial background motif under `public/assets/generated/`. The main character, crates, equipment art, particles, HUD rings, fog, scanlines, and forge effects are rendered procedurally at runtime.

## Configuration

- Equipment and stats: `data/items.ts`
- Crate catalog and probabilities: `data/crates.ts`
- Central drop logic: `lib/dropEngine.ts`
- Forge and burn economy: `lib/economy.ts`
- Persistent player state: `store/playerStore.ts`
- Future Web3 adapter: `lib/web3.ts`

Do not duplicate drop rates in UI code. The crate interface reads the central `dropRates` object directly.

## Structure

- `app/` — home, crates, character, inventory, forge, market, and profile routes
- `components/art/` — configurable ronin, crate, and equipment SVG renderers
- `components/crates/` — cinematic opening and reward reveal
- `components/effects/` — background and particle systems
- `components/ui/` — shell, cards, boot screen, and notifications
- `data/` — items, crates, and rarity metadata
- `lib/` — drop engine, economy, and blockchain interfaces
- `store/` — Zustand player store with persistence
- `scripts/` — deterministic local SVG asset generation
- `public/assets/` — generated and authored local artwork

## Notes

- No Three.js, React Three Fiber, GLB, or remote art dependencies.
- Reduced-motion preferences disable ambient animation and particles.
- Particle count is reduced on mobile and pauses when the tab is hidden.
- Audio event architecture is represented by the global mute state and safe no-audio behavior; adding local files later does not affect gameplay.
