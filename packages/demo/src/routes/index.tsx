import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { getGithubUserContribution } from "@breek/github-user-contribution";
import { createGameBoard, simulateGame } from "@breek/solver";
import { createSvg } from "@breek/svg-creator";
import {
  AnimationFrame,
  DrawOptions,
  Cell,
  defaultSimulationOptions,
  SimulationOptions,
} from "@breek/commons";
import { basePalettes } from "@breek/commons";

export default component$(() => {
  const username = useSignal("");
  const token = useSignal("");
  const output = useSignal("");
  const progressSignal = useSignal(0);

  const paletteType = "github-dark";

  const generateBreakout = $(async () => {
    if (!username.value || !token.value) {
      console.error("Username or token is missing");
      output.value = "Error: Please provide both username and token.";
      return;
    }

    try {
      const contributionData: Cell[] = await getGithubUserContribution(
        username.value,
        token.value,
      );

      if (!contributionData || contributionData.length === 0) {
        throw new Error("No contribution data received");
      }

      const gameBoard = createGameBoard(contributionData);

      const options: SimulationOptions = {
        ...defaultSimulationOptions,
        totalDuration: 100000,
      };

      const gameStates = simulateGame(gameBoard, options, (progress) => {
        progressSignal.value = progress;
      });

      if (!gameStates || gameStates.length === 0) {
        throw new Error("Game simulation failed");
      }

      const animationFrames: AnimationFrame[] = gameStates.map((state) => ({
        ball: state.ball,
        paddle: state.paddle,
        board: state.board,
      }));

      const palette = basePalettes[paletteType];

      const drawOptions: DrawOptions = {
        colorDots: palette.colorDots,
        colorEmpty: palette.colorEmpty,
        colorPaddle: "purple",
      };

      const svg = createSvg(gameBoard, animationFrames, drawOptions);
      output.value = svg;
    } catch (error) {
      console.error("Error:", error);
      output.value = `Error: ${(error as Error).message}`;
    }
  });

  useTask$(({ track }) => {
    track(() => username.value);
    track(() => token.value);

    generateBreakout();
  });

  const progressPercents = progressSignal.value * 100;

  return (
    <main>
      <div class="inner">
        <h1>Breek Demo</h1>

        <div>
          <label>
            GitHub Username
            <br />
            <input bind:value={username} type="text" />
          </label>
        </div>

        <div>
          <label>
            GitHub Token
            <br />
            <input bind:value={token} type="password" />
          </label>
        </div>

        {progressPercents > 0 && progressPercents < 90 && (
          <div>Progress: {progressPercents.toFixed(2)}%</div>
        )}

        <div>
          <div dangerouslySetInnerHTML={output.value} />
        </div>
      </div>
    </main>
  );
});
