FROM oven/bun:latest AS base

WORKDIR /usr/src/app

FROM base AS prerelease

COPY . .

RUN bun install

RUN bun build:action


FROM base AS release

WORKDIR /action-release

COPY --from=prerelease /usr/src/app/packages/action/dist/ /action-release/

CMD ["bun", "/action-release/index.js"]
