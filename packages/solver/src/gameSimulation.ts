import type {
  GameBoard,
  GameState,
  Paddle,
  Ball,
  SimulationOptions,
} from "@breek/commons";
import {
  CELL_SIZE,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  EXTRA_SPACE,
  PADDLE_WIDTH,
} from "@breek/commons";

const PADDLE_SPEED = 8;
const MAX_BALL_SPEED = 32;
const MIN_BALL_SPEED = 8;

export function createInitialState(board: GameBoard): GameState {
  const paddle: Paddle = {
    x: board.width / 2 - PADDLE_WIDTH / 2,
    width: PADDLE_WIDTH,
  };
  const ball: Ball = {
    x: board.width / 2,
    y: board.height + 50 - PADDLE_HEIGHT - BALL_RADIUS - 1, // Position the ball above the paddle
    dx: 6 * (Math.random() > 0.5 ? 1 : -1),
    dy: -6,
  };
  return {
    board: {
      ...board,
      blocks: board.blocks.map((block) => ({ ...block, visible: true })),
    },
    ball,
    paddle,
    score: 0,
  };
}

function predictBallPosition(state: GameState): number {
  let { x, y, dx, dy } = state.ball;
  const { width, height, blocks } = state.board;
  const maxIterations = 1000;
  let iterations = 0;

  while (
    y < height + EXTRA_SPACE - PADDLE_HEIGHT &&
    iterations < maxIterations
  ) {
    x += dx;
    y += dy;

    if (x <= BALL_RADIUS || x >= width - BALL_RADIUS) dx = -dx;
    if (y <= BALL_RADIUS) dy = -dy;

    for (let block of blocks) {
      if (
        block.visible &&
        x > block.x &&
        x < block.x + CELL_SIZE &&
        y > block.y &&
        y < block.y + CELL_SIZE
      ) {
        dy = -dy;
        break;
      }
    }

    iterations++;
  }

  return x;
}

function movePaddleAI(state: GameState) {
  const predictedX = predictBallPosition(state);
  const paddleCenter = state.paddle.x + state.paddle.width / 2;
  const distanceY =
    state.board.height + EXTRA_SPACE - PADDLE_HEIGHT - state.ball.y;
  const moveFactor = Math.max(1, 10 / distanceY);

  if (paddleCenter < predictedX - 10) {
    state.paddle.x += PADDLE_SPEED * moveFactor;
  } else if (paddleCenter > predictedX + 10) {
    state.paddle.x -= PADDLE_SPEED * moveFactor;
  }

  state.paddle.x = Math.max(
    0,
    Math.min(state.board.width - state.paddle.width, state.paddle.x),
  );
}

function updateBallPosition(state: GameState) {
  const { ball, board, paddle } = state;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions
  if (ball.x <= BALL_RADIUS || ball.x >= board.width - BALL_RADIUS) {
    ball.dx = -ball.dx;
    ball.x = Math.max(BALL_RADIUS, Math.min(ball.x, board.width - BALL_RADIUS));
  }
  if (ball.y <= BALL_RADIUS) {
    ball.dy = -ball.dy;
    ball.y = BALL_RADIUS;
  }

  // Paddle collision
  if (
    ball.y >= board.height + EXTRA_SPACE - PADDLE_HEIGHT - BALL_RADIUS &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy = -Math.abs(ball.dy);
    ball.dx += (ball.x - (paddle.x + paddle.width / 2)) / 10;
  }

  // Adjust ball speed
  const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
  if (speed > MAX_BALL_SPEED) {
    const factor = MAX_BALL_SPEED / speed;
    ball.dx *= factor;
    ball.dy *= factor;
  } else if (speed < MIN_BALL_SPEED) {
    const factor = MIN_BALL_SPEED / speed;
    ball.dx *= factor;
    ball.dy *= factor;
  }

  // Reset ball if it goes out of bounds
  if (ball.y > board.height + EXTRA_SPACE) {
    ball.x = board.width / 2;
    ball.y = board.height + 50 - PADDLE_HEIGHT - BALL_RADIUS - 1;
    ball.dx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -6;
  }

  // Block collisions
  for (let block of board.blocks) {
    if (
      block.visible &&
      ball.x > block.x &&
      ball.x < block.x + CELL_SIZE &&
      ball.y > block.y &&
      ball.y < block.y + CELL_SIZE
    ) {
      const dx = ball.x - (block.x + CELL_SIZE / 2);
      const dy = ball.y - (block.y + CELL_SIZE / 2);
      if (Math.abs(dx) > Math.abs(dy)) {
        ball.dx = -ball.dx;
      } else {
        ball.dy = -ball.dy;
      }

      block.lives--;
      if (block.lives <= 0) {
        block.visible = false;
        state.score++;
      }
      break;
    }
  }
}

export function simulateGame(
  board: GameBoard,
  options: SimulationOptions,
): GameState[] {
  const states: GameState[] = [];
  let currentState = createInitialState(board);
  const maxFrames = Math.floor(options.totalDuration / options.frameDuration);

  for (let frame = 0; frame < maxFrames; frame++) {
    movePaddleAI(currentState);
    updateBallPosition(currentState);

    states.push(JSON.parse(JSON.stringify(currentState))); // Deep clone the state

    // End the game if all blocks are destroyed
    if (currentState.board.blocks.every((block) => !block.visible)) {
      console.log("All blocks destroyed");
      break;
    }
  }

  console.log(
    `Simulation ended. Frames: ${states.length}, Remaining blocks: ${currentState.board.blocks.filter((b) => b.visible).length}, Score: ${currentState.score}`,
  );

  return states;
}
