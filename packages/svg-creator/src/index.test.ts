import { expect, test } from "bun:test";
import { createSvg } from "./index";
import type { GameBoard, DrawOptions, AnimationFrame } from "@breek/commons";

test("createSvg should generate a valid SVG", () => {
  const initialBoard: GameBoard = {
    width: 832,
    height: 112,
    blocks: Array(52 * 7)
      .fill(null)
      .map((_, index) => ({
        x: (index % 52) * 16,
        y: Math.floor(index / 52) * 16,
        lives: 1,
        visible: true,
      })),
    getColor: (x: number, y: number) => {
      const block = initialBoard.blocks.find(
        (b) => b.x === x * 16 && b.y === y * 16,
      );
      return block ? block.lives : 0;
    },
  };

  const frames: AnimationFrame[] = [
    {
      ball: { x: 416, y: 300, dx: 5, dy: -5 },
      paddle: { x: 366, width: 100 },
      board: initialBoard,
    },
    {
      ball: { x: 421, y: 295, dx: 5, dy: -5 },
      paddle: { x: 371, width: 100 },
      board: initialBoard,
    },
    {
      ball: { x: 426, y: 290, dx: 5, dy: -5 },
      paddle: { x: 376, width: 100 },
      board: initialBoard,
    },
  ];

  const options: DrawOptions = {
    colorDots: {
      0: "#ebedf0",
      1: "#9be9a8",
      2: "#40c463",
      3: "#30a14e",
      4: "#216e39",
    },
    colorEmpty: "#ebedf0",
    colorPaddle: "purple",
  };

  const svg = createSvg(initialBoard, frames, options);

  expect(svg).toContain("<svg");
  expect(svg).toContain("</svg>");
  expect(svg).toContain("<rect");
  expect(svg).toContain("<circle");
  expect(svg).toContain("<animate");
});
