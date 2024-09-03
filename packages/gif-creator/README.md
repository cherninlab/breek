# @break/gif-creator

GIF generation logic for the Breek project.

## Usage

```typescript
import { createBreakoutGIF } from '@break/gif-creator';

const gif = await createBreakoutGIF(svgFrames, options);
```

## API

- [x] `createBreakoutGIF(frames, options)`: Generate GIF buffer
- [ ] `optimizeGIF(gifBuffer)`: Optimize existing GIF

## Development

```bash
bun install
bun run test
```

Note: This package requires additional system libraries for GIF manipulation.