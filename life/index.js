class Grid {
    constructor(canvas, height, width, cellSize) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;

        this.loc = [];
        for (let i = 0; i < height; i++) {
            let temp = [];
            for (let j = 0; j < width; j++) temp.push(false);
            this.loc.push(temp);
        }

        this.ctx.fillStyle = '#000000';
        this.canvas.height = this.cellSize * this.height;
        this.canvas.width = this.cellSize * this.width;
        this.canvas.style.height = this.cellSize * this.height;
        this.canvas.style.width = this.cellSize * this.width;
    }
    place(x, y, item) {
        for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < item[i].length; j++) {
                this.loc[i + y][j + x] = item[i][j];
            }
        }
    }
    getLiveNeighbours(x, y) {
        let count = 0;
        for (let i of [y - 1, y, y + 1]) {
            for (let j of [x - 1, x, x + 1]) {
                if (i == y && j == x) continue;
                else if (i < 0 || i > this.height - 1) continue;
                else if (j < 0 || j > this.width - 1) continue;
                else if (this.loc[i][j]) count++;
            }
        }
        return count;
    }
    step() {
        let newLoc = [];
        for (let i = 0; i < this.height; i++) {
            let temp = [];
            for (let j = 0; j < this.width; j++) temp.push(false);
            newLoc.push(temp);
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const liveNeighbours = this.getLiveNeighbours(x, y);
                // if (liveNeighbours > 0) console.log({ x, y, liveNeighbours });
                if (
                    this.loc[y][x] &&
                    (liveNeighbours === 2 || liveNeighbours === 3)
                )
                    newLoc[y][x] = true;
                else if (!this.loc[y][x] && liveNeighbours === 3)
                    newLoc[y][x] = true;
            }
        }
        this.loc = newLoc;
    }
    draw() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.ctx.fillStyle = this.loc[i][j] ? 'white' : 'darkred';
                this.ctx.fillRect(
                    j * this.cellSize,
                    i * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }
    start() {
        this.draw();
        setTimeout(() => {
            requestAnimationFrame(this.start.bind(this));
            this.step();
        }, 250);
    }
}

const newgame = () => {
    const grid = new Grid('game-canvas-1', 50, 50, 10);
    grid.place(0, 20, [
        [true, true],
        [true, true]
    ]);
    grid.place(20, 10, [[true, true, true]]);
    grid.place(1, 1, [
        [false, true, false],
        [false, false, true],
        [true, true, true]
    ]);
    grid.place(30, 30, [
        [false, true, false],
        [false, true, false],
        [true, false, true],
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [true, false, true],
        [false, true, false],
        [false, true, false]
    ]);
    grid.start();
};
