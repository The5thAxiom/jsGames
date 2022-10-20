class Grid {
    constructor(canvas, height, width, cellSize, frameRate = 250) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.frameRate = frameRate;

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

        this.clear();
        this.draw();
    }
    place(x, y, item) {
        // let startLater = false;
        // if (this.isOn) {
        //     this.stop();
        //     startLater = true;
        // }
        for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < item[i].length; j++) {
                this.loc[i + y][j + x] = item[i][j];
            }
        }
        // if (startLater) this.start();
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
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
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
    stop() {
        this.isOn = false;
    }
    start() {
        this.isOn = true;
        this.draw();
        setTimeout(() => {
            if (this.isOn) {
                requestAnimationFrame(this.start.bind(this));
                this.step();
            }
        }, this.frameRate);
    }
}

let gameStarted = false;
let grid;

const newgame = () => {
    if (gameStarted) grid.stop();
    gameStarted = true;
    const frameRate = document.getElementById('frame-rate').valueAsNumber;
    grid = new Grid('game-canvas-1', 50, 50, 10, frameRate);
    document.getElementById('play-pause-game').style.display = 'inline';
};

const toggleGame = () => {
    const toggleGameButton = document.getElementById('play-pause-game');
    const stepGameButton = document.getElementById('step-game');

    if (grid.isOn) {
        toggleGameButton.innerHTML = 'Play';
        grid.stop();
        stepGameButton.style.display = 'inline';
    } else {
        toggleGameButton.innerHTML = 'Pause';
        grid.start();
        stepGameButton.style.display = 'none';
    }
};
const stopGame = () => grid.isOn && grid.stop();
const startGame = () => {
    !grid.isOn && grid.start();
};

const stepGame = () => {
    if (!grid.isOn) {
        grid.step();
        grid.draw();
    }
};

const handleFrameRateChange = () => {
    const setFrameRateButton = document.getElementById('set-framerate-button');
    const frameRate = document.getElementById('frame-rate').valueAsNumber;
    if (frameRate !== grid.frameRate)
        setFrameRateButton.style.display = 'inline';
};
const setFrameRate = () => {
    const frameRate = document.getElementById('frame-rate').valueAsNumber;
    grid.frameRate = frameRate;
    const setFrameRateButton = document.getElementById('set-framerate-button');
    setFrameRateButton.style.display = 'none';
};

const canvas = document.getElementById('game-canvas-1');
canvas.addEventListener('click', e => {
    if (grid.isOn) toggleGame();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellX = Number.parseInt(x / grid.cellSize);
    const cellY = Number.parseInt(y / grid.cellSize);
    grid.place(cellX, cellY, [[!grid.loc[cellY][cellX]]]);
    grid.draw();
});

let mouseIsOverCanvas = false;
canvas.addEventListener('mouseenter', () => (mouseIsOverCanvas = true));
canvas.addEventListener('mouseleave', () => (mouseIsOverCanvas = false));

let prevLoc = { x: 0, y: 0 };
canvas.addEventListener('mousemove', e => {
    if (!gameStarted || !mouseIsOverCanvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellX = Number.parseInt(x / grid.cellSize);
    const cellY = Number.parseInt(y / grid.cellSize);
    if (prevLoc.x !== cellX || prevLoc.y != cellY)
        if (e.buttons === 1) {
            if (grid.isOn) toggleGame();
            grid.place(cellX, cellY, [[true]]);
            grid.draw();
        }
    prevLoc = { x: cellX, y: cellY };
});

