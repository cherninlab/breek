import * as core from "@actions/core";
import { getGithubUserContribution } from "@breek/github-user-contribution";
import { createGameBoard, simulateGame } from "@breek/solver";
import { createSvg } from "@breek/svg-creator";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import {
  basePalettes,
  defaultSimulationOptions,
  DrawOptions,
} from "@breek/commons";

async function run() {
  try {
    const userName = core.getInput("github_user_name");
    const githubToken = core.getInput("github_token");
    const svgOutPath = core.getInput("svg_out_path");
    const svgDarkOutPath = core.getInput("svg_dark_out_path");

    const contributionData = await getGithubUserContribution(
      userName,
      githubToken,
    );
    const gameBoard = createGameBoard(contributionData);

    const gameStates = simulateGame(gameBoard, defaultSimulationOptions);

    const lightPalette = basePalettes["github-light"];
    const darkPalette = basePalettes["github-dark"];

    const drawOptions: DrawOptions = {
      colorDots: lightPalette.colorDots,
      colorEmpty: lightPalette.colorEmpty,
      colorPaddle: "purple",
    };

    const darkDrawOptions: DrawOptions = {
      colorDots: darkPalette.colorDots,
      colorEmpty: darkPalette.colorEmpty,
      colorPaddle: "purple",
    };

    const frames = gameStates.map((state) => ({
      ball: state.ball,
      paddle: state.paddle,
      board: state.board,
    }));

    const svgString = createSvg(gameBoard, frames, drawOptions);
    const svgDarkString = createSvg(gameBoard, frames, darkDrawOptions);

    mkdirSync(dirname(svgOutPath), { recursive: true });
    writeFileSync(svgOutPath, svgString);
    console.log(`SVG written to ${svgOutPath}`);

    mkdirSync(dirname(svgDarkOutPath), { recursive: true });
    writeFileSync(svgDarkOutPath, svgDarkString);
    console.log(`Dark mode SVG written to ${svgDarkOutPath}`);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();
