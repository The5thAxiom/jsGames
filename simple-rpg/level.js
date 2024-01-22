import Grid from "./grid.js";

class Level {
    constructor(name, canvas, statsDiv, {mapUrl, width, height, cellSize, isOccupied}) {
        this.name = name;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.mapUrl = mapUrl;
        this.statsDiv = statsDiv;

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