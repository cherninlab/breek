import { GameBoard, GameState, Paddle, Ball, SimulationOptions } from './types';
import { System, Circle, Box, Body } from 'detect-collisions';

const INITIAL_BALL_SPEED = 2;
const BALL_RADIUS = 0.5;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 1;
const PADDLE_SPEED = 2;

function createInitialState(board: GameBoard): GameState {
    const paddle: Paddle = {
        x: board.width / 2 - PADDLE_WIDTH / 2,
        width: PADDLE_WIDTH,
    };
    const ball: Ball = {
        x: board.width / 2,
        y: board.height - 2,
        dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        dy: -INITIAL_BALL_SPEED,
    };
    return {
        board,
        ball,
        paddle,
        score: 0,
    };
}

function createCollisionBodies(state: GameState, system: System) {
    const ballBody = new Circle({ x: state.ball.x, y: state.ball.y }, BALL_RADIUS);
    const paddleBody = new Box({ x: state.paddle.x, y: state.board.height - 1 }, PADDLE_WIDTH, PADDLE_HEIGHT);

    system.insert(ballBody);
    system.insert(paddleBody);

    const blockBodies: Body[] = state.board.blocks.map((block) => {
        const blockBody = new Box({ x: block.x, y: block.y }, 1, 1);
        system.insert(blockBody);
        return blockBody;
    });

    const blockIndexMap = new Map(blockBodies.map((body, index) => [body, index]));

    return { ballBody, paddleBody, blockBodies, blockIndexMap };
}

function updatePaddlePosition(state: GameState, paddleBody: Box) {
    const { ball, paddle, board } = state;

    const paddleCenter = paddle.x + paddle.width / 2;
    const moveDirection = ball.x > paddleCenter ? 1 : -1;

    paddle.x += PADDLE_SPEED * moveDirection;
    paddle.x = Math.max(0, Math.min(paddle.x, board.width - paddle.width));
    paddleBody.setPosition(paddle.x, board.height - 1);
}

function updateBallPosition(state: GameState, ballBody: Circle, paddleBody: Box, blockBodies: Body[], blockIndexMap: Map<Body, number>, system: System) {
    const { ball, board } = state;

    ballBody.setPosition(ball.x, ball.y);
    system.updateBody(ballBody);

    let collided = false;

    system.checkOne(ballBody, (response) => {
        collided = true;
        if (response.b === paddleBody) {
            ball.dy = -Math.abs(ball.dy);
            // Add some randomness to horizontal direction after paddle hit
            ball.dx += (Math.random() - 0.5) * 0.5;
        } else {
            // Assume it's a block
            const blockIndex = blockIndexMap.get(response.b);
            if (blockIndex !== undefined) {
                board.blocks[blockIndex].health--;
                if (board.blocks[blockIndex].health <= 0) {
                    board.blocks.splice(blockIndex, 1);
                    system.remove(blockBodies[blockIndex]);
                    blockBodies.splice(blockIndex, 1);
                    blockIndexMap.delete(response.b);
                    state.score++;
                }
            }

            // Determine which side of the block was hit
            if (Math.abs(response.overlapV.x) > Math.abs(response.overlapV.y)) {
                ball.dx = -ball.dx;
            } else {
                ball.dy = -ball.dy;
            }
        }
    });

    if (!collided) {
        // Update ball position
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Check collision with walls
        if (ball.x - BALL_RADIUS <= 0 || ball.x + BALL_RADIUS >= board.width) {
            ball.dx = -ball.dx;
        }
        if (ball.y - BALL_RADIUS <= 0) {
            ball.dy = -ball.dy;
        }
    }

    const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (currentSpeed < INITIAL_BALL_SPEED) {
        const factor = INITIAL_BALL_SPEED / currentSpeed;
        ball.dx *= factor;
        ball.dy *= factor;
    }

    if (Math.abs(ball.dx) > 10 * Math.abs(ball.dy)) {
        ball.dy = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dx) / 2;
    }
}

export function simulateGame(board: GameBoard, options: SimulationOptions): GameState[] {
    const states: GameState[] = [];
    let currentState = createInitialState(board);
    const totalFrames = Math.floor(options.totalDuration / options.frameDuration);
    const collisionSystem = new System();

    const { ballBody, paddleBody, blockBodies, blockIndexMap } = createCollisionBodies(currentState, collisionSystem);

    for (let frame = 0; frame < totalFrames; frame++) {
        updatePaddlePosition(currentState, paddleBody);
        updateBallPosition(currentState, ballBody, paddleBody, blockBodies, blockIndexMap, collisionSystem);

        // Update collision bodies positions
        ballBody.setPosition(currentState.ball.x, currentState.ball.y);
        paddleBody.setPosition(currentState.paddle.x, currentState.board.height - 1);
        currentState.board.blocks.forEach((block, index) => {
            blockBodies[index].setPosition(block.x, block.y);
        });

        states.push(JSON.parse(JSON.stringify(currentState))); // Deep clone the state

        // End the game if all blocks are destroyed
        if (currentState.board.blocks.length === 0) {
            console.log("All blocks destroyed");
            break;
        }

        // End the game if the ball goes below the paddle
        if (currentState.ball.y > currentState.board.height) {
            console.log("Ball went out of bounds");
            break;
        }
    }

    console.log(`Simulation ended. Frames: ${states.length}, Remaining blocks: ${currentState.board.blocks.length}`);

    return states;
}