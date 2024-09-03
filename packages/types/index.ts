export type ContributionData = {
    date: string;
    contributionCount: number;
    color: string;
}[];

export type ContributionDay = {
    date: string;
    contributionCount: number;
    color: string;
};

export type UserContributions = {
    user: {
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number;
                weeks: {
                    contributionDays: ContributionDay[];
                }[];
            };
        };
    };
};

