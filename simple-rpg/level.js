import Grid from "./grid.js";

class Level {
    constructor(name, container, {mapUrl, width, height, cellSize, statsDiv, isOccupied}) {
        this.name = name;
        this.container = container;
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.mapUrl = mapUrl;
        this.statsDiv = statsDiv;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.grid = new Grid(this.canvas, {
            height: this.height,
            width: this.width,
            cellSize: this.cellSize,
            frameRate: 60,
        }, {
            lineColor: 'black',
            mapUrl: this.mapUrl
        });
    }

    show() {
        this.grid.draw();
    }
}

export default Level;