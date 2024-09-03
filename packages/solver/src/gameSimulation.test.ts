import { expect, test } from "bun:test";
import { simulateGame } from "./gameSimulation";
import type { GameBoard, SimulationOptions, GameState } from "./types";

const mockOptions: SimulationOptions = {
    frameDuration: 100,
    totalDuration: 60000 // 60 seconds
};

function createMockGameBoard(): GameBoard {
    return {
        width: 52,
        height: 30,
        blocks: [
            { x: 0, y: 0, health: 1 },
            { x: 10, y: 0, health: 1 },
            { x: 20, y: 0, health: 1 },
            { x: 30, y: 0, health: 1 },
            { x: 40, y: 0, health: 1 },
            { x: 50, y: 0, health: 1 },
            { x: 5, y: 5, health: 1 },
            { x: 15, y: 5, health: 1 },
            { x: 25, y: 5, health: 1 },
            { x: 35, y: 5, health: 1 },
            { x: 45, y: 5, health: 1 },
        ]
    };
}

function hasGameProgressed(initialState: GameState, finalState: GameState): boolean {
    return finalState.score > initialState.score ||
        finalState.board.blocks.length < initialState.board.blocks.length ||
        finalState.ball.x !== initialState.ball.x ||
        finalState.ball.y !== initialState.ball.y ||
        finalState.paddle.x !== initialState.paddle.x;
}

test("simulateGame - basic functionality", () => {
    const mockGameBoard = createMockGameBoard();
    const gameStates = simulateGame(mockGameBoard, mockOptions);

    expect(gameStates.length).toBeGreaterThan(1);
    expect(gameStates[0].board).toEqual(mockGameBoard);
    expect(gameStates[0].score).toBe(0);

    // Check that the game has progressed
    expect(hasGameProgressed(gameStates[0], gameStates[gameStates.length - 1])).toBe(true);

    // Check that the ball is moving
    expect(gameStates[1].ball).not.toEqual(gameStates[0].ball);

    // Check that the paddle is moving
    expect(gameStates[1].paddle).not.toEqual(gameStates[0].paddle);
});

test("simulateGame - ball movement", () => {
    const mockGameBoard = createMockGameBoard();
    const gameStates = simulateGame(mockGameBoard, mockOptions);

    // Check that the ball's position changes over time
    const ballPositions = new Set(gameStates.map(state => `${state.ball.x},${state.ball.y}`));
    expect(ballPositions.size).toBeGreaterThan(1);
});

test("simulateGame - paddle movement", () => {
    const mockGameBoard = createMockGameBoard();
    const gameStates = simulateGame(mockGameBoard, mockOptions);

    // Check that the paddle's position changes over time
    const paddlePositions = new Set(gameStates.map(state => state.paddle.x));
    expect(paddlePositions.size).toBeGreaterThan(1);
});

test("simulateGame - potential collisions", () => {
    const mockGameBoard = createMockGameBoard();
    const gameStates = simulateGame(mockGameBoard, mockOptions);

    // Check for potential collisions (changes in ball direction)
    const directionChanges = gameStates.filter((state, index) => {
        if (index === 0) return false;
        const prevState = gameStates[index - 1];
        return (prevState.ball.dx !== state.ball.dx || prevState.ball.dy !== state.ball.dy);
    });

    expect(directionChanges.length).toBeGreaterThan(0);
});

test("simulateGame - score and block changes", () => {
    const mockGameBoard = createMockGameBoard();
    const gameStates = simulateGame(mockGameBoard, mockOptions);

    const initialState = gameStates[0];
    const finalState = gameStates[gameStates.length - 1];

    console.log(`Initial blocks: ${initialState.board.blocks.length}, Final blocks: ${finalState.board.blocks.length}`);
    console.log(`Initial score: ${initialState.score}, Final score: ${finalState.score}`);

    // Check if either the score increased or the number of blocks decreased
    const scoreIncreased = finalState.score > initialState.score;
    const blocksDecreased = finalState.board.blocks.length < initialState.board.blocks.length;

    expect(scoreIncreased || blocksDecreased).toBe(true);
});
