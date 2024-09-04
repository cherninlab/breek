import { Cell, GraphQLRes } from "@breek/commons";

export const getGithubUserContribution = async (
  userName: string,
  githubToken: string,
): Promise<Cell[]> => {
  const query = /* GraphQL */ `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                weekday
                date
              }
            }
          }
        }
      }
    }
  `;
  const variables = { login: userName };

  const res = await fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `bearer ${githubToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ variables, query }),
  });

  if (!res.ok) throw new Error(res.statusText);

  const { data, errors } = (await res.json()) as {
    data: GraphQLRes;
    errors?: { message: string }[];
  };

  if (errors?.[0]) throw errors[0];

  return data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week, x) =>
      week.contributionDays.map((d) => ({
        x,
        y: d.weekday,
        date: d.date,
        count: d.contributionCount,
        level:
          (d.contributionLevel === "FOURTH_QUARTILE" && 4) ||
          (d.contributionLevel === "THIRD_QUARTILE" && 3) ||
          (d.contributionLevel === "SECOND_QUARTILE" && 2) ||
          (d.contributionLevel === "FIRST_QUARTILE" && 1) ||
          0,
      })),
  );
};

export const userContributionToGrid = (cells: Cell[]) => {
  const width = Math.max(0, ...cells.map((c) => c.x)) + 1;
  const height = Math.max(0, ...cells.map((c) => c.y)) + 1;

  const grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(0));

  for (const c of cells) {
    if (c.level > 0) {
      grid[c.y][c.x] = c.level;
    }
  }

  return grid;
};
