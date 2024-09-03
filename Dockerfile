# Use Node.js as the base image (Bun currently doesn't have an official Docker image)
FROM node:20-slim as builder

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb (if you're using Bun's lockfile)
COPY package.json bun.lockb* ./

# Copy tsconfig.json
COPY tsconfig.json ./

# Copy packages directory
COPY packages packages

# Install dependencies
RUN bun install --frozen-lockfile

# Build the project
RUN bun run build:all

# Start a new stage for a smaller final image
FROM node:20-slim

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /action-release

# Copy built files from the builder stage
COPY --from=builder /app/packages/action/dist/ /action-release/

# Set the command to run the action
CMD ["bun", "/action-release/index.js"]