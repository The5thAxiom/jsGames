import Grid from "../grid.js";
import Level from "../level.js";
import { sizeToBlocks } from "../utils.js";

class GridObject {
    /**
     * 
     * @param {string} name 
     * @param {Level} level 
     * @param {*} options 
     */
    constructor(name, level, options) {
        this.name = name;
        /**
         * @type {Level}
         */
        this.level = level;
        /**
         * @type {Grid}
         */
        this.grid = level.grid;
        this.statsDiv = level.statsDiv;

        if (options.size) {
            this.height = sizeToBlocks[options.size];
            this.width = sizeToBlocks[options.size];
        } else {
            this.height = options.height;
            this.width = options.width;
        }
        this.imageUrl = options.imageUrl;
        this.image = new Image();
        if (this.imageUrl) this.image.src = this.imageUrl;
        this.selected = false;
        this.highlighted = false;

        if (options.defaultLocation) {
            this.grid.place(this, options.defaultLocation.x, options.defaultLocation.y)
        }
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }

    updateStatsDiv() {
        this.statsDiv.innerHTML = `
            <h2>${this.name}</h2>
        `;
    }

    select() {
        this.selected = true;
        this.updateStatsDiv();
    }

    unSelect() {
        this.selected = false;
        this.statsDiv.innerHTML = '';
        this.grid.resetCellColors()
    }

    highlight() {
        this.highlighted = true;
    }

    unHighlight() {
        this.highlighted = false;
    }

    draw() {
        if (this.imageUrl) {
            this.grid.ctx.drawImage(
                this.image,
                this.x * this.grid.cellSize, this.y * this.grid.cellSize,
                this.width * this.grid.cellSize, this.height * this.grid.cellSize
            );
        }

        if (this.selected) {
            this.drawBorder('red');
        } else if (this.highlighted) {
            this.drawBorder('blue')
        }
    }

    drawBorder(color) {
        this.grid.ctx.strokeStyle = color;
        this.grid.ctx.strokeRect(
            this.x * this.grid.cellSize, this.y * this.grid.cellSize,
            this.width * this.grid.cellSize, this.height * this.grid.cellSize
        );
    }
}

export default GridObject;