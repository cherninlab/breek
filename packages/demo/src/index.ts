import { createGameBoard, simulateGame } from '@breek/solver';
import { createSvg, DrawOptions } from '@breek/svg-creator';

// Mock contribution data for demo purposes
const mockContributionData = Array.from({ length: 364 }, () => ({
    date: new Date().toISOString(),
    contributionCount: Math.floor(Math.random() * 5),
    color: '#9be9a8'
}));

const gameBoard = createGameBoard(mockContributionData);

const simulationOptions = {
    frameDuration: 100,
    totalDuration: 60000 // 60 seconds
};

const gameStates = simulateGame(gameBoard, simulationOptions);

const drawOptions: DrawOptions = {
    colorDots: { 1: '#9be9a8', 2: '#40c463', 3: '#30a14e', 4: '#216e39' },
    colorEmpty: '#ebedf0',
    colorBall: 'white',
    colorPaddle: 'purple',
    sizeCell: 16,
    sizeDot: 12,
    paddleWidth: 60,
    paddleHeight: 10,
    ballRadius: 5,
};

const frames = gameStates.map(state => ({
    ballX: state.ball.x,
    ballY: state.ball.y,
    paddleX: state.paddle.x,
    grid: state.board
}));

const svgString = createSvg(gameBoard, frames, drawOptions);

// Create a simple HTML page to display the SVG
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Breek Demo</title>
</head>
<body>
    <h1>Breek Demo</h1>
    ${svgString}
</body>
</html>
`;

// Write the HTML to a file
const fs = require('fs');
const path = require('path');
const outputDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'index.html'), html);

console.log('Demo page created at:', path.join(outputDir, 'index.html'));