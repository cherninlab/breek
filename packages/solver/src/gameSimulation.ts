import type { GameBoard, GameState, SimulationOptions } from "@breek/commons";
import {
  BALL_RADIUS,
  CELL_SIZE,
  EXTRA_SPACE,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "@breek/commons";

const MAX_BALL_SPEED = 16;
const MIN_BALL_SPEED = 8;

interface PaddleHitPoint {
  frame: number;
  x: number;
}

export function createInitialState(board: GameBoard): GameState {
  const paddleY = board.height + EXTRA_SPACE - PADDLE_HEIGHT - 5;
  const paddle = {
    x: board.width / 2 - PADDLE_WIDTH / 2,
    y: paddleY,
    width: PADDLE_WIDTH,
  };

  const ball = {
    x: board.width / 2,
    y: board.height + EXTRA_SPACE - PADDLE_HEIGHT - BALL_RADIUS - 1,
    dx: 8 * (Math.random() > 0.5 ? 1 : -1),
    dy: -8,
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

export function simulateGame(
  board: GameBoard,
  options: SimulationOptions,
  onProgress?: (progress: number) => void
): GameState[] {
  const states: GameState[] = [];
  let currentState = createInitialState(board);
  const maxFrames = Math.floor(options.totalDuration / options.frameDuration);
  const bottomY = board.height + EXTRA_SPACE - PADDLE_HEIGHT - BALL_RADIUS;
  const paddleHitPoints: PaddleHitPoint[] = [];

  // First phase: Simulate ball movement
  for (let frame = 0; frame < maxFrames; frame++) {
    const previousBallY = currentState.ball.y;

    // Update ball position
    currentState.ball.x += currentState.ball.dx;
    currentState.ball.y += currentState.ball.dy;

    // Wall collisions
    if (
      currentState.ball.x <= BALL_RADIUS ||
      currentState.ball.x >= board.width - BALL_RADIUS
    ) {
      currentState.ball.dx = -currentState.ball.dx;
      currentState.ball.x = Math.max(
        BALL_RADIUS,
        Math.min(currentState.ball.x, board.width - BALL_RADIUS)
      );
    }

    // Ceiling collision
    if (currentState.ball.y <= BALL_RADIUS) {
      currentState.ball.dy = -currentState.ball.dy;
      currentState.ball.y = BALL_RADIUS;
    }

    // Record paddle hit points
    if (
      currentState.ball.dy > 0 &&
      currentState.ball.y >= bottomY &&
      previousBallY < bottomY
    ) {
      paddleHitPoints.push({
        frame,
        x: Math.max(
          PADDLE_WIDTH / 2,
          Math.min(currentState.ball.x, board.width - PADDLE_WIDTH / 2)
        ),
      });

      // Bounce ball
      currentState.ball.dy = -Math.abs(currentState.ball.dy);

      // Add slight variation to dx
      currentState.ball.dx += (Math.random() - 0.5) * 2;

      // Normalize speed
      const speed = Math.sqrt(
        currentState.ball.dx ** 2 + currentState.ball.dy ** 2
      );
      if (speed !== 0) {
        const targetSpeed = Math.min(
          Math.max(speed, MIN_BALL_SPEED),
          MAX_BALL_SPEED
        );
        const factor = targetSpeed / speed;
        currentState.ball.dx *= factor;
        currentState.ball.dy *= factor;
      }
    }

    // Block collisions
    for (let block of currentState.board.blocks) {
      if (!block.visible) continue;

      if (
        currentState.ball.x + BALL_RADIUS > block.x &&
        currentState.ball.x - BALL_RADIUS < block.x + CELL_SIZE &&
        currentState.ball.y + BALL_RADIUS > block.y &&
        currentState.ball.y - BALL_RADIUS < block.y + CELL_SIZE
      ) {
        const dx = currentState.ball.x - (block.x + CELL_SIZE / 2);
        const dy = currentState.ball.y - (block.y + CELL_SIZE / 2);

        if (Math.abs(dx) > Math.abs(dy)) {
          currentState.ball.dx = -currentState.ball.dx;
        } else {
          currentState.ball.dy = -currentState.ball.dy;
        }

        block.lives--;
        if (block.lives <= 0) {
          block.visible = false;
          currentState.score++;
        }
        break;
      }
    }

    // Store state
    states.push(JSON.parse(JSON.stringify(currentState)));

    if (onProgress && frame % 100 === 0) {
      onProgress(frame / maxFrames);
    }

    // Check if game is complete
    if (currentState.board.blocks.every((block) => !block.visible)) {
      break;
    }
  }

  // Second phase: Simple linear interpolation for paddle movement
  if (paddleHitPoints.length > 0) {
    let currentHitPointIndex = 0;
    const lastHitPoint = paddleHitPoints[paddleHitPoints.length - 1];

    for (let i = 0; i < states.length; i++) {
      if (i < paddleHitPoints[0].frame) {
        // Before first hit, move to first hit position
        const progress = i / paddleHitPoints[0].frame;
        states[i].paddle.x =
          states[0].paddle.x +
          (paddleHitPoints[0].x - PADDLE_WIDTH / 2 - states[0].paddle.x) *
            progress;
      } else if (i > lastHitPoint.frame) {
        // After last hit, keep last position
        states[i].paddle.x = lastHitPoint.x - PADDLE_WIDTH / 2;
      } else {
        // Between hit points
        while (
          currentHitPointIndex < paddleHitPoints.length - 1 &&
          paddleHitPoints[currentHitPointIndex + 1].frame <= i
        ) {
          currentHitPointIndex++;
        }

        const currentHit = paddleHitPoints[currentHitPointIndex];
        const nextHit = paddleHitPoints[currentHitPointIndex + 1];

        if (nextHit) {
          const progress =
            (i - currentHit.frame) / (nextHit.frame - currentHit.frame);
          states[i].paddle.x =
            currentHit.x -
            PADDLE_WIDTH / 2 +
            (nextHit.x - currentHit.x) * progress;
        } else {
          states[i].paddle.x = currentHit.x - PADDLE_WIDTH / 2;
        }
      }

      // Clamp paddle position
      states[i].paddle.x = Math.max(
        0,
        Math.min(states[i].paddle.x, board.width - PADDLE_WIDTH)
      );
    }
  }

  return states;
}
