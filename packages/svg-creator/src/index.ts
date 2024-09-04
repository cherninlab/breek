import {
  GameBoard,
  DrawOptions,
  AnimationFrame,
  PADDLE_WIDTH,
} from "@breek/commons";
import {
  DOT_SIZE,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  EXTRA_SPACE,
} from "@breek/commons";

const TRAIL_LENGTH = 5;

export const createSvg = (
  initialBoard: GameBoard,
  frames: AnimationFrame[],
  options: DrawOptions,
): string => {
  const width = initialBoard.width;
  const height = initialBoard.height + EXTRA_SPACE; // Add extra space for the paddle and ball
  const animationDuration = frames.length / 60; // 60 fps

  let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Define gradients and filters
  svg += `
    <defs>
      <radialGradient id="ballGradient">
        <stop offset="10%" stop-color="#FFF" />
        <stop offset="90%" stop-color="#FF0" />
      </radialGradient>
      <filter id="ballGlow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
    </defs>
  `;

  // Define styles
  svg += `<style>
    .dot {
        shape-rendering: geometricPrecision;
        stroke-width: 1px;
        width: 12px;
        height: 12px;
      }
      #paddle {
            transition: all .1s ease-out;
      }
    </style>`;

  // Blocks
  initialBoard.blocks.forEach((block, index) => {
    svg += `<rect id="block-${index}" x="${block.x + 1}" y="${block.y + 1}" width="${DOT_SIZE - 1}" height="${DOT_SIZE - 1}" fill="${options.colorDots[block.lives - 1]}" class="dot" rx="2" ry="2">`;
    svg += `<animate attributeName="fill" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
      .map((frame) => {
        const blockState = frame.board.blocks[index];
        return blockState && blockState.visible
          ? options.colorDots[blockState.lives - 1]
          : "none";
      })
      .join(";")}" />`;
    svg += `<animate attributeName="opacity" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
      .map((frame) => {
        const blockState = frame.board.blocks[index];
        return blockState && blockState.visible ? "1" : "0";
      })
      .join(";")}" />`;
    svg += `</rect>`;
  });

  // Paddle
  svg += `<rect id="paddle" width="${PADDLE_WIDTH}" height="${PADDLE_HEIGHT}"  fill="${options.colorPaddle}" rx="2" ry="2" x="${frames[0].paddle.x}" y="${height - PADDLE_HEIGHT - 5}">`;
  svg += `<animate attributeName="x" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
    .map((frame) => frame.paddle.x)
    .join(";")}" />`;
  svg += `</rect>`;

  // Ball trail
  for (let i = 1; i <= TRAIL_LENGTH; i++) {
    svg += `<circle class="trail" r="${BALL_RADIUS - i + 1}" fill="rgba(255, ${255 - i * 50}, 0, ${1 - i / TRAIL_LENGTH})" cx="${frames[0].ball.x}" cy="${frames[0].ball.y}">`;
    svg += `<animate attributeName="cx" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
      .map((_, frameIndex) => {
        const prevFrame = frames[Math.max(0, frameIndex - i)];
        return prevFrame.ball.x;
      })
      .join(";")}" />`;
    svg += `<animate attributeName="cy" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
      .map((_, frameIndex) => {
        const prevFrame = frames[Math.max(0, frameIndex - i)];
        return prevFrame.ball.y;
      })
      .join(";")}" />`;
    svg += `</circle>`;
  }

  // Ball
  svg += `<circle id="ball" r="${BALL_RADIUS}" fill="url(#ballGradient)" filter="url(#ballGlow)" cx="${frames[0].ball.x}" cy="${frames[0].ball.y}">`;
  svg += `<animate attributeName="cx" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
    .map((frame) => frame.ball.x)
    .join(";")}" />`;
  svg += `<animate attributeName="cy" dur="${animationDuration}s" repeatCount="indefinite" values="${frames
    .map((frame) => frame.ball.y)
    .join(";")}" />`;
  svg += `</circle>`;

  // Victory text
  svg += `<text id="victory" x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#FFF" font-size="24" opacity="0">Victory!`;
  svg += `<animate attributeName="opacity" dur="${animationDuration}s" repeatCount="1" values="${frames
    .map((frame) =>
      frame.board.blocks.every((block) => !block.visible) ? "1" : "0",
    )
    .join(";")}" />`;
  svg += `</text>`;

  svg += "</svg>";
  return svg;
};
