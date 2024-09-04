import type { GameBoard, Block, Cell } from "@breek/commons";
import { CELL_SIZE } from "@breek/commons";

const BLOCKS_PER_ROW = 52; // One year has 52 weeks
const BLOCK_ROWS = 7; // 7 days in a week

export function createGameBoard(contributionData: Cell[]): GameBoard {
  const width = BLOCKS_PER_ROW * CELL_SIZE;
  const height = BLOCK_ROWS * CELL_SIZE;

  const blocks: Block[] = [];

  // Create a 2D array to represent the contribution graph
  const contributionGrid: number[][] = Array(BLOCK_ROWS)
    .fill(null)
    .map(() => Array(BLOCKS_PER_ROW).fill(0));

  // Fill the contributionGrid with the actual data
  contributionData.forEach((cell) => {
    if (cell.x < BLOCKS_PER_ROW && cell.y < BLOCK_ROWS) {
      contributionGrid[cell.y][cell.x] = cell.level;
    }
  });

  // Create blocks based on the contributionGrid
  for (let y = 0; y < BLOCK_ROWS; y++) {
    for (let x = 0; x < BLOCKS_PER_ROW; x++) {
      const level = contributionGrid[y][x];
      blocks.push({
        x: x * CELL_SIZE,
        y: y * CELL_SIZE,
        lives: level === 0 ? 1 : level + 1, // 0 level (gray) has 1 life, others have level + 1
        visible: true,
      });
    }
  }

  const getColor = (x: number, y: number): number => {
    const block = blocks.find(
      (b) => b.x === x * CELL_SIZE && b.y === y * CELL_SIZE,
    );
    return block && block.visible ? block.lives : 0;
  };

  return {
    width,
    height,
    blocks,
    getColor,
  };
}
