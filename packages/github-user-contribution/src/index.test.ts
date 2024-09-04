import { expect, test, beforeAll } from "bun:test";
import { getGithubUserContribution, userContributionToGrid } from "./index";
import { config } from "dotenv";

beforeAll(() => {
  config({ path: __dirname + "/../../../.env" });
});

test("getGithubUserContribution", async () => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not set in the environment variables");
  }

  const contributions = await getGithubUserContribution(
    "cherninlab",
    githubToken,
  );

  expect(Array.isArray(contributions)).toBe(true);
  expect(contributions.length).toBeGreaterThan(0);

  contributions.forEach((contribution) => {
    expect(contribution).toHaveProperty("date");
    expect(contribution).toHaveProperty("count");

    expect(typeof contribution.date).toBe("string");
    expect(typeof contribution.count).toBe("number");
  });
});

test("userContributionToGrid", () => {
  const testData = [
    { x: 0, y: 0, date: "2023-01-01", count: 5, level: 4 },
    { x: 1, y: 0, date: "2023-01-02", count: 2, level: 2 },
    { x: 0, y: 1, date: "2023-01-08", count: 1, level: 1 },
  ];

  const result = userContributionToGrid(testData);

  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0][0]).toBe(4);
  expect(result[0][1]).toBe(2);
  expect(result[1][0]).toBe(1);
});
