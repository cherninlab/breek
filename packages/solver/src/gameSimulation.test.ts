import { expect, test } from "bun:test";
import { simulateGame } from "./gameSimulation";
import type { GameBoard, SimulationOptions } from "@breek/commons";

const createMockGameBoard = (): GameBoard => {
  const blocks = Array(52 * 7)
    .fill(null)
    .map((_, index) => ({
      x: (index % 52) * 16,
      y: Math.floor(index / 52) * 16,
      lives: 1,
      visible: true,
    }));

  return {
    width: 832,
    height: 112,
    blocks,
    getColor: (x: number, y: number) => {
      const block = blocks.find((b) => b.x === x * 16 && b.y === y * 16);
      return block ? block.lives : 0;
    },
  };
};

const mockOptions: SimulationOptions = {
  frameDuration: 16, // 60 fps
  totalDuration: 10000, // 10 seconds
};

test("simulateGame - initial state", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  expect(gameStates.length).toBeGreaterThan(1);
  expect(gameStates[0].board.blocks).toEqual(mockGameBoard.blocks);
  expect(gameStates[0].score).toBe(0);
});

test("simulateGame - ball movement", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  const initialBall = gameStates[0].ball;
  const finalBall = gameStates[gameStates.length - 1].ball;

  expect(finalBall.x).not.toBe(initialBall.x);
  expect(finalBall.y).not.toBe(initialBall.y);
});

test("simulateGame - paddle movement", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  const paddlePositions = new Set(gameStates.map((state) => state.paddle.x));
  expect(paddlePositions.size).toBeGreaterThan(1);
});

test("simulateGame - block destruction", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  const initialBlockCount = mockGameBoard.blocks.filter(
    (b) => b.lives > 0,
  ).length;
  const finalBlockCount = gameStates[gameStates.length - 1].board.blocks.filter(
    (b) => b.lives > 0,
  ).length;

  expect(finalBlockCount).toBeLessThan(initialBlockCount);
});

test("simulateGame - score increase", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  const initialScore = gameStates[0].score;
  const finalScore = gameStates[gameStates.length - 1].score;

  expect(finalScore).toBeGreaterThan(initialScore);
});

test("simulateGame - ball speed limits", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, mockOptions);

  gameStates.forEach((state) => {
    const speed = Math.sqrt(state.ball.dx ** 2 + state.ball.dy ** 2);
    expect(speed).toBeGreaterThanOrEqual(6); // MIN_BALL_SPEED
    expect(speed).toBeLessThanOrEqual(16); // MAX_BALL_SPEED
  });
});

test("simulateGame - game end condition", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, {
    frameDuration: 16,
    totalDuration: 1000000, // Very long duration to ensure game ends
  });

  const lastState = gameStates[gameStates.length - 1];
  const allBlocksDestroyed = lastState.board.blocks.every(
    (block) => block.lives <= 0,
  );

  expect(allBlocksDestroyed).toBe(true);
});

test("simulateGame - blocks remain in array when destroyed", () => {
  const mockGameBoard = createMockGameBoard();
  const gameStates = simulateGame(mockGameBoard, {
    frameDuration: 16,
    totalDuration: 1000000, // Very long duration to ensure game ends
  });

  const lastState = gameStates[gameStates.length - 1];
  expect(lastState.board.blocks.length).toBe(mockGameBoard.blocks.length);
  expect(lastState.board.blocks.every((block) => block.lives <= 0)).toBe(true);
});
