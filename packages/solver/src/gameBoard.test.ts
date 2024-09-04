import { expect, test } from "bun:test";
import { createGameBoard } from "./gameBoard";
import type { Cell } from "@breek/commons";

test("createGameBoard", () => {
  const mockContributionData: Cell[] = [
    { x: 0, y: 0, date: "2023-01-01", count: 1, level: 1 },
    { x: 1, y: 0, date: "2023-01-02", count: 2, level: 2 },
    { x: 2, y: 0, date: "2023-01-03", count: 3, level: 3 },
    { x: 3, y: 0, date: "2023-01-04", count: 4, level: 4 },
    { x: 0, y: 1, date: "2023-01-05", count: 1, level: 1 },
    { x: 1, y: 1, date: "2023-01-06", count: 2, level: 2 },
    { x: 2, y: 1, date: "2023-01-07", count: 3, level: 3 },
    { x: 3, y: 1, date: "2023-01-08", count: 4, level: 4 },
  ];

  const gameBoard = createGameBoard(mockContributionData);

  expect(gameBoard.width).toBe(832); // 52 weeks * 16 pixels per block
  expect(gameBoard.height).toBe(112); // 7 days * 16 pixels per block
  expect(gameBoard.blocks.length).toBe(52 * 7); // 52 weeks * 7 days

  // Test getColor function
  expect(gameBoard.getColor(0, 0)).toBe(2); // level 1 + 1
  expect(gameBoard.getColor(1, 0)).toBe(3); // level 2 + 1
  expect(gameBoard.getColor(2, 0)).toBe(4); // level 3 + 1
  expect(gameBoard.getColor(3, 0)).toBe(5); // level 4 + 1
  expect(gameBoard.getColor(0, 1)).toBe(2); // level 1 + 1
  expect(gameBoard.getColor(1, 1)).toBe(3); // level 2 + 1
  expect(gameBoard.getColor(2, 1)).toBe(4); // level 3 + 1
  expect(gameBoard.getColor(3, 1)).toBe(5); // level 4 + 1
  expect(gameBoard.getColor(4, 0)).toBe(1); // Empty block has 1 life
});

test("createGameBoard with empty data", () => {
  const emptyContributionData: Cell[] = [];
  const gameBoard = createGameBoard(emptyContributionData);

  expect(gameBoard.width).toBe(832); // 52 weeks * 16 pixels per block
  expect(gameBoard.height).toBe(112); // 7 days * 16 pixels per block
  expect(gameBoard.blocks.length).toBe(52 * 7); // 52 weeks * 7 days
});

test("createGameBoard with partial data", () => {
  const partialContributionData: Cell[] = [
    { x: 0, y: 0, date: "2023-01-01", count: 1, level: 1 },
    { x: 1, y: 0, date: "2023-01-02", count: 2, level: 2 },
  ];
  const gameBoard = createGameBoard(partialContributionData);

  expect(gameBoard.width).toBe(832);
  expect(gameBoard.height).toBe(112);
  expect(gameBoard.blocks.length).toBe(52 * 7);
  expect(gameBoard.getColor(0, 0)).toBe(2); // level 1 + 1
  expect(gameBoard.getColor(1, 0)).toBe(3); // level 2 + 1
  expect(gameBoard.getColor(2, 0)).toBe(1); // Empty block has 1 life
});
