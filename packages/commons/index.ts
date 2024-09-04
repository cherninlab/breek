export type ContributionLevel =
  | "FOURTH_QUARTILE"
  | "THIRD_QUARTILE"
  | "SECOND_QUARTILE"
  | "FIRST_QUARTILE"
  | "NONE";

export type Cell = {
  x: number;
  y: number;
  date: string;
  count: number;
  level: number;
};

export type GraphQLRes = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: {
          contributionDays: {
            contributionCount: number;
            contributionLevel: ContributionLevel;
            date: string;
            weekday: number;
          }[];
        }[];
      };
    };
  };
};

export type Paddle = {
  x: number;
  width: number;
};

export type GameBoard = {
  width: number;
  height: number;
  blocks: Block[];
  getColor: (x: number, y: number) => number;
};

export type GameState = {
  board: GameBoard;
  ball: Ball;
  paddle: Paddle;
  score: number;
};

export type SimulationOptions = {
  frameDuration: number;
  totalDuration: number;
};

export type DrawOptions = {
  colorDots: Record<number, string>;
  colorEmpty: string;
  colorPaddle: string;
};

export type Block = {
  x: number;
  y: number;
  lives: number;
  visible?: boolean;
};

export type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export type AnimationFrame = {
  ball: Ball;
  paddle: Paddle;
  board: GameBoard;
};

export const basePalettes: Record<
  string,
  Pick<DrawOptions, "colorEmpty" | "colorDots">
> = {
  "github-light": {
    colorDots: {
      0: "#ebedf0",
      1: "#9be9a8",
      2: "#40c463",
      3: "#30a14e",
      4: "#216e39",
    },
    colorEmpty: "#ebedf0",
  },
  "github-dark": {
    colorEmpty: "#161b22",
    colorDots: {
      0: "#161b22",
      1: "#01311f",
      2: "#034525",
      3: "#0f6d31",
      4: "#00c647",
    },
  },
};

export const palettes = { ...basePalettes };
palettes["github"] = palettes["github-light"];
palettes["default"] = palettes["github"];

export const DOT_SIZE = 12;
export const CELL_SIZE = DOT_SIZE + 4;
export const PADDLE_HEIGHT = 10;
export const BALL_RADIUS = 5;
export const EXTRA_SPACE = 200;
export const PADDLE_WIDTH = 100;

export const defaultSimulationOptions = {
  frameDuration: 16, // ~60 fps
  totalDuration: 360000, // 6 minutes
};
