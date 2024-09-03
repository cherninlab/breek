export type Block = {
    x: number;
    y: number;
    health: number;
};

export type Ball = {
    x: number;
    y: number;
    dx: number;
    dy: number;
};

export type Paddle = {
    x: number;
    width: number;
};

export type GameBoard = {
    width: number;
    height: number;
    blocks: Block[];
};

export type GameState = {
    board: GameBoard;
    ball: Ball;
    paddle: Paddle;
    score: number;
};

export type SimulationOptions = {
    frameDuration: number;
    totalDuration: number;
};