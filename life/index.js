class Grid {
    constructor(canvas, height, width, cellSize, frameRate = 250) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.frameRate = frameRate;
        this.isEmpty = true;

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
    checkIsEmpty() {
        this.isEmpty = !this.loc.some(y => y.some(x => x));
    }
    place(x, y, item) {
        for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < item[i].length; j++) {
                this.loc[i + y][j + x] = item[i][j];
                if (this.isEmpty && item[i][j]) this.isEmpty = false;
            }
        }
    }
    set(x, y) {
        this.loc[y][x] = true;
        if (this.isEmpty) this.isEmpty = false;
    }
    unset(x, y) {
        this.loc[y][x] = false;
        this.checkIsEmpty();
    }
    toggle(x, y) {
        this.loc[y][x] = !this.loc[y][x];
        if (this.isEmpty) {
            if (this.loc[y][x]) this.isEmpty = false;
        } else this.checkIsEmpty();
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
        this.loc = [];
        for (let i = 0; i < this.height; i++) {
            let temp = [];
            for (let j = 0; j < this.width; j++) temp.push(false);
            this.loc.push(temp);
        }
        this.draw();
        this.isEmpty = true;
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
        this.checkIsEmpty();
    }
    draw() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.ctx.fillStyle = this.loc[i][j] ? 'white' : 'darkred';
                this.ctx.strokeStyle = 'gray';
                this.ctx.strokeRect(
                    j * this.cellSize,
                    i * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
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

const frameRate = document.getElementById('frame-rate').valueAsNumber;
const grid = new Grid('game-canvas-1', 30, 40, 20, frameRate);

const toggleGame = () => {
    const toggleGameButton = document.getElementById('play-pause-game');
    const stepGameButton = document.getElementById('step-game');
    if (grid.isOn) {
        // stopping the game
        toggleGameButton.innerHTML = 'Play';
        grid.stop();
        stepGameButton.style.display = 'inline';
    } else {
        // starting the game
        toggleGameButton.innerHTML = 'Pause';
        grid.start();
        stepGameButton.style.display = 'none';
        showClearButtonIfNeeded();
    }
};

const stepGame = () => {
    if (!grid.isOn) {
        grid.step();
        grid.draw();
    }
};

const clearGame = () => {
    if (grid.isOn) toggleGame();
    grid.stop();
    grid.clear();
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

let mouseIsOverCanvas = false;
canvas.addEventListener('mouseenter', () => {
    mouseIsOverCanvas = true;
});
canvas.addEventListener('mouseleave', () => {
    mouseIsOverCanvas = false;
});

const getCurrentCell = e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellX = Number.parseInt(x / grid.cellSize);
    const cellY = Number.parseInt(y / grid.cellSize);
    return { x: cellX, y: cellY };
};

let prevLoc = { x: 0, y: 0 };
let beingClicked = false;

canvas.addEventListener('mousemove', e => {
    if (!mouseIsOverCanvas) return;
    const currentLoc = getCurrentCell(e);
    const isLeftClick = e.buttons === 1;
    if (
        prevLoc.x !== currentLoc.x ||
        prevLoc.y !== currentLoc.y ||
        !beingClicked
    ) {
        if (isLeftClick) {
            if (grid.isOn) toggleGame();
            grid.set(currentLoc.x, currentLoc.y);
            grid.draw();
            beingClicked = true;
        } else {
            beingClicked = false;
        }
    }
    prevLoc = currentLoc;
});

canvas.addEventListener('click', e => {
    if (beingClicked) return;
    if (grid.isOn) toggleGame();
    const currentLoc = getCurrentCell(e);
    grid.toggle(currentLoc.x, currentLoc.y);
    grid.draw();
});

const isEmptyWatcher = () => {
    const clearGameButton = document.getElementById('clear-game');
    if (grid.isEmpty) {
        clearGameButton.style.display = 'none';
        if (grid.isOn) toggleGame();
    } else {
        clearGameButton.style.display = 'inline';
        setTimeout(showClearButtonIfNeeded, 0);
    }
};

isEmptyWatcher();

