# @breek/solver

Game logic solver for the Breek project.

## Usage

```typescript
import { createGameBoard, simulateGame } from '@breek/solver';

// Create a game board from GitHub contribution data
const gameBoard = createGameBoard(contributionData);

// Simulate the game
const gameStates = simulateGame(gameBoard, {
  frameDuration: 100,
  totalDuration: 10000
});
```

## API

- `createGameBoard(contributionData: ContributionData): GameBoard`
  Creates a game board from GitHub contribution data.

- `simulateGame(gameBoard: GameBoard, options: SimulationOptions): GameState[]`
  Simulates a full game and returns an array of game states for each frame.

## Development

```bash
bun install
bun run test
```
