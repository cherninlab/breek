# @break/svg-creator

SVG generation logic for the Breek project.

## Usage

```typescript
import { createBreakoutSVG } from '@break/svg-creator';

const svg = createBreakoutSVG(contributionData, options);
```

## API

- [x] `createBreakoutSVG(data, options)`: Generate SVG string with breakout animation

## Development

```bash
bun install
bun run test
```