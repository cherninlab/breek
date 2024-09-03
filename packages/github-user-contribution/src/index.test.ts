import { expect, test, beforeAll } from "bun:test";
import { fetchUserContributions, parseContributionData } from "./index";
import { config } from 'dotenv';

beforeAll(() => {
    config({ path: __dirname + "/../../../.env" });
});

test("fetchUserContributions", async () => {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
        throw new Error("GITHUB_TOKEN is not set in the environment variables");
    }

    const contributions = await fetchUserContributions("cherninlab", githubToken);

    expect(Array.isArray(contributions)).toBe(true);
    expect(contributions.length).toBeGreaterThan(0);

    contributions.forEach(contribution => {
        expect(contribution).toHaveProperty('date');
        expect(contribution).toHaveProperty('contributionCount');
        expect(contribution).toHaveProperty('color');

        expect(typeof contribution.date).toBe('string');
        expect(typeof contribution.contributionCount).toBe('number');
        expect(typeof contribution.color).toBe('string');
    });
});

test("parseContributionData", () => {
    const testData = [
        { date: "2023-01-01", contributionCount: 5, color: "#216e39" },
        { date: "2023-01-02", contributionCount: 2, color: "#9be9a8" },
        { date: "2023-01-03", contributionCount: 0, color: "#ebedf0" },
        { date: "2023-01-04", contributionCount: 3, color: "#40c463" },
        { date: "2023-01-05", contributionCount: 1, color: "#9be9a8" },
        { date: "2023-01-06", contributionCount: 4, color: "#30a14e" },
        { date: "2023-01-07", contributionCount: 6, color: "#216e39" },
        { date: "2023-01-08", contributionCount: 1, color: "#9be9a8" },
    ];

    const result = parseContributionData(testData);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    result.forEach(week => {
        expect(Array.isArray(week)).toBe(true);
        expect(week.length).toBeGreaterThan(0);
        week.forEach(day => {
            expect(typeof day).toBe('number');
        });
    });
});