import { expect, test } from "bun:test";
import { createSvg, DrawOptions, AnimationFrame } from "./index";
// import fs from 'fs';
// import path from 'path';

test("createSvg should generate a valid SVG", () => {
    const initialGrid: AnimationFrame['grid'] = {
        width: 5,
        height: 3,
        getColor: (x: number, y: number) => (x + y) % 4
    };

    const frames: AnimationFrame[] = [
        { ballX: 2, ballY: 2, paddleX: 1, grid: initialGrid },
        { ballX: 3, ballY: 1, paddleX: 2, grid: initialGrid },
        { ballX: 4, ballY: 2, paddleX: 3, grid: initialGrid },
    ];

    const options: DrawOptions = {
        colorDots: { 1: '#9be9a8', 2: '#40c463', 3: '#30a14e', 4: '#216e39' },
        colorEmpty: '#ebedf0',
        colorBall: 'white',
        colorPaddle: 'purple',
        sizeCell: 16,
        sizeDot: 12,
        paddleWidth: 32,
        paddleHeight: 8,
        ballRadius: 6,
    };

    const svg = createSvg(initialGrid, frames, options);

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('<rect');
    expect(svg).toContain('<circle');
    expect(svg).toContain('<animateMotion');
    expect(svg).toContain('<animate');

    // Save the SVG to a file for manual inspection
    /*
    const testOutputDir = path.join(__dirname, '..', 'test-output');
    if (!fs.existsSync(testOutputDir)) {
        fs.mkdirSync(testOutputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(testOutputDir, 'test-output.svg'), svg);

    console.log("SVG saved to:", path.join(testOutputDir, 'test-output.svg'));
    */
});