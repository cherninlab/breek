import type { GameBoard, Block } from './types';
import type { ContributionData } from '@breek/types';

const BOARD_WIDTH = 52;
const BOARD_HEIGHT = 7;

export function createGameBoard(contributionData: ContributionData): GameBoard {
    const blocks: Block[] = [];

    contributionData.forEach((contribution, index) => {
        const x = index % BOARD_WIDTH;
        const y = Math.floor(index / BOARD_WIDTH);

        if (y < BOARD_HEIGHT) {
            blocks.push({
                x,
                y,
                health: contribution.contributionCount
            });
        }
    });

    return {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        blocks
    };
}