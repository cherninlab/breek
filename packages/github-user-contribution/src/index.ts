import { graphql } from "@octokit/graphql";
import type { ContributionDay, UserContributions } from '@breek/types';

export async function fetchUserContributions(username: string, token: string): Promise<ContributionDay[]> {
    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

    try {
        const { user } = await graphql<UserContributions>(query, {
            username,
            headers: {
                authorization: `token ${token}`,
            },
        });

        return user.contributionsCollection.contributionCalendar.weeks
            .flatMap(week => week.contributionDays);
    } catch (error) {
        console.error("Error fetching user contributions:", error);
        throw new Error("Failed to fetch user contributions");
    }
}

export function parseContributionData(data: ContributionDay[]): number[][] {
    const contributionGrid: number[][] = [];
    let currentWeek: number[] = [];

    data.forEach((day, index) => {
        currentWeek.push(day.contributionCount);

        if ((index + 1) % 7 === 0 || index === data.length - 1) {
            contributionGrid.push(currentWeek);
            currentWeek = [];
        }
    });

    return contributionGrid;
}
