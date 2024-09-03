import { expect, test } from "bun:test";
import { createGameBoard } from "./gameBoard";
import type { ContributionData } from '@breek/types';

test("createGameBoard", () => {
    const mockContributionData: ContributionData = [
        { date: "2023-01-01", contributionCount: 1, color: "#9be9a8" },
        { date: "2023-01-02", contributionCount: 2, color: "#40c463" },
        { date: "2023-01-03", contributionCount: 3, color: "#30a14e" },
        { date: "2023-01-04", contributionCount: 4, color: "#216e39" },
    ];

    const gameBoard = createGameBoard(mockContributionData);

    expect(gameBoard.width).toBe(52);
    expect(gameBoard.height).toBe(7);
    expect(gameBoard.blocks.length).toBe(mockContributionData.length);

    gameBoard.blocks.forEach((block, index) => {
        expect(block.x).toBe(index % 52);
        expect(block.y).toBe(Math.floor(index / 52));
        expect(block.health).toBe(mockContributionData[index].contributionCount);
    });
});