export type DrawOptions = {
    colorDots: Record<number, string>;
    colorEmpty: string;
    colorBall: string;
    colorPaddle: string;
    sizeCell: number;
    sizeDot: number;
    paddleWidth: number;
    paddleHeight: number;
    ballRadius: number;
};

export type AnimationFrame = {
    ballX: number;
    ballY: number;
    paddleX: number;
    grid: {
        width: number;
        height: number;
        getColor: (x: number, y: number) => number;
    };
};

const createSvgElement = (tag: string, attrs: Record<string, string | number>): string => {
    const attributes = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<${tag} ${attributes}/>`;
};

export const createSvg = (
    initialGrid: AnimationFrame['grid'],
    frames: AnimationFrame[],
    options: DrawOptions
): string => {
    const width = (initialGrid.width + 2) * options.sizeCell;
    const height = (initialGrid.height + 4) * options.sizeCell;

    let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Add initial grid
    for (let x = 0; x < initialGrid.width; x++) {
        for (let y = 0; y < initialGrid.height; y++) {
            const color = initialGrid.getColor(x, y);
            svg += createSvgElement('rect', {
                x: (x + 1) * options.sizeCell,
                y: (y + 1) * options.sizeCell,
                width: options.sizeDot,
                height: options.sizeDot,
                fill: color === 0 ? options.colorEmpty : options.colorDots[color],
            });
        }
    }

    // Add paddle
    svg += createSvgElement('rect', {
        width: options.paddleWidth,
        height: options.paddleHeight,
        fill: options.colorPaddle,
        y: height - options.sizeCell - options.paddleHeight,
    });

    // Add ball
    svg += `<circle r="${options.ballRadius}" fill="${options.colorBall}">`;
    svg += `<animateMotion dur="${frames.length / 60}s" repeatCount="indefinite" path="`;
    svg += frames.map(frame => `M${(frame.ballX + 1) * options.sizeCell} ${(frame.ballY + 1) * options.sizeCell}`).join(' ');
    svg += `"/>`;
    svg += `</circle>`;

    // Add paddle animation
    svg += `<animate xlink:href="rect:last-of-type" attributeName="x" dur="${frames.length / 60}s" repeatCount="indefinite" values="`;
    svg += frames.map(frame => (frame.paddleX + 1) * options.sizeCell).join(';');
    svg += `"/>`;

    // Add block disappearing animations
    for (let x = 0; x < initialGrid.width; x++) {
        for (let y = 0; y < initialGrid.height; y++) {
            if (initialGrid.getColor(x, y) !== 0) {
                svg += `<animate xlink:href="rect:nth-of-type(${x * initialGrid.height + y + 1})" attributeName="opacity" dur="${frames.length / 60}s" repeatCount="indefinite" values="`;
                svg += frames.map(frame => frame.grid.getColor(x, y) === 0 ? '0' : '1').join(';');
                svg += `"/>`;
            }
        }
    }

    svg += '</svg>';
    return svg;
};