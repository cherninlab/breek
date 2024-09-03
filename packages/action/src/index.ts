import * as core from '@actions/core';
import { fetchUserContributions } from '@breek/github-user-contribution';
import { createGameBoard, simulateGame } from '@breek/solver';
import { createSvg, DrawOptions } from '@breek/svg-creator';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

async function run() {
    try {
        const userName = core.getInput('github_user_name');
        const outputFile = core.getInput('output');
        const githubToken = core.getInput('github_token');

        const contributionData = await fetchUserContributions(userName, githubToken);
        const gameBoard = createGameBoard(contributionData);

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

        mkdirSync(dirname(outputFile), { recursive: true });
        writeFileSync(outputFile, svgString);

        console.log(`SVG written to ${outputFile}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();