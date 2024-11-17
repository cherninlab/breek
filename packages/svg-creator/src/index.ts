// packages/svg-creator/src/index.ts

import {
  AnimationFrame,
  BALL_RADIUS,
  DOT_SIZE,
  DrawOptions,
  EXTRA_SPACE,
  GameBoard,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "@breek/commons";

export const createSvg = (
  initialBoard: GameBoard,
  frames: AnimationFrame[],
  options: DrawOptions
): string => {
  const width = initialBoard.width;
  const height = initialBoard.height + EXTRA_SPACE; // Add extra space for the paddle and ball

  const sampleRate = 1; // Include every frame
  const sampledFrames = frames.filter((_, index) => index % sampleRate === 0);

  const animationDuration = sampledFrames.length / 60; // Assuming 60 fps

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

  // Start style tag
  svg += `<style>`;

  // Base styles
  svg += `
    .dot {
      shape-rendering: geometricPrecision;
      stroke-width: 1px;
      width: ${DOT_SIZE - 1}px;
      height: ${DOT_SIZE - 1}px;
      opacity: 1;
      transition: opacity 0.5s;
    }
    #paddle {
      transform-origin: top left;
      animation: paddleMovement ${animationDuration}s linear forwards;
    }
    #ball {
      transform-origin: center;
      animation: ballMovement ${animationDuration}s linear forwards;
    }
  `;

  // Paddle Keyframes
  let paddleKeyframes = `@keyframes paddleMovement {`;
  sampledFrames.forEach((frame, frameIndex) => {
    const percentage = (frameIndex / (sampledFrames.length - 1)) * 100;
    paddleKeyframes += `
      ${percentage}% {
        transform: translate(${frame.paddle.x}px, 0);
      }
    `;
  });
  paddleKeyframes += "}";
  svg += paddleKeyframes;

  // Ball Keyframes
  let ballKeyframes = `@keyframes ballMovement {`;
  sampledFrames.forEach((frame, frameIndex) => {
    const percentage = (frameIndex / (sampledFrames.length - 1)) * 100;
    ballKeyframes += `
      ${percentage}% {
        transform: translate(${frame.ball.x}px, ${frame.ball.y}px);
      }
    `;
  });
  ballKeyframes += "}";
  svg += ballKeyframes;

  // Blocks (only animate when they disappear)
  initialBoard.blocks.forEach((_, index) => {
    const blockId = `block-${index}`;
    const keyframesName = `blockFade-${index}`;
    let hitFrameIndex = -1;

    // Find when the block is hit
    for (let frameIndex = 0; frameIndex < sampledFrames.length; frameIndex++) {
      const blockState = sampledFrames[frameIndex].board.blocks[index];
      if (blockState && !blockState.visible) {
        hitFrameIndex = frameIndex;
        break;
      }
    }

    if (hitFrameIndex !== -1) {
      const percentage = (hitFrameIndex / (sampledFrames.length - 1)) * 100;

      // Add animation to fade out block
      svg += `
        #${blockId} {
          animation: ${keyframesName} ${animationDuration}s linear forwards;
          animation-fill-mode: forwards;
        }
        @keyframes ${keyframesName} {
          0% {
            opacity: 1;
          }
          ${percentage}% {
            opacity: 1;
          }
          ${percentage + 0.1}% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `;
    }
  });

  // Close style tag
  svg += `</style>`;

  // Create block elements
  initialBoard.blocks.forEach((block, index) => {
    const blockId = `block-${index}`;
    const fillColor = options.colorDots[block.lives - 1] || options.colorEmpty;
    svg += `<rect id="${blockId}" x="${block.x + 1}" y="${block.y + 1}" width="${
      DOT_SIZE - 1
    }" height="${DOT_SIZE - 1}" fill="${fillColor}" class="dot" rx="2" ry="2" />`;
  });

  // Paddle
  svg += `<rect id="paddle" width="${PADDLE_WIDTH}" height="${PADDLE_HEIGHT}" fill="${
    options.colorPaddle
  }" rx="2" ry="2" x="0" y="${height - PADDLE_HEIGHT - 5}" />`;

  // Ball
  svg += `<circle id="ball" r="${BALL_RADIUS}" fill="url(#ballGradient)" filter="url(#ballGlow)" cx="0" cy="0" />`;

  // Close SVG tag
  svg += `</svg>`;
  return svg;
};
