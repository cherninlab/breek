# @break/github-user-contribution

Fetch and process GitHub user contribution data.

## Usage

```typescript
import { fetchUserContributions } from "@break/github-user-contribution";

const data = await fetchUserContributions("username", token);
```

## API

- `fetchUserContributions(username, token)`: Fetch user contribution data
- `parseContributionData(rawData)`: Parse raw API response

## Development

```bash
bun install
bun run test
```

Note: You need to set up a GitHub token with appropriate permissions to use this package.
