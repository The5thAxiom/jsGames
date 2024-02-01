import { drawTextWithBox } from "./utils.js";

class Effect {
    constructor(name, level, {startingCell, type, imageUrl, text, textBoxOptions, animate}) {
        this.name = name;
        this.level = level;
        this.grid = this.level.grid;
        this.startingCell = startingCell;
        this.type = type;
        if (this.type === 'text') {
            this.text = text;
            this.textBoxOptions = textBoxOptions;
        } else if (this.type === 'image') {
            this.imageUrl = imageUrl;
        }
        this.animate = animate;
        this.startingLocation = {
            x: this.startingCell.x * this.grid.cellSize + this.grid.cellSize / 2,
            y: this.startingCell.y * this.grid.cellSize + this.grid.cellSize / 2
        };
        this.currentLocation = {
            x: this.startingCell.x * this.grid.cellSize + this.grid.cellSize / 2,
            y: this.startingCell.y * this.grid.cellSize + this.grid.cellSize / 2
        };
        this.startingMs = Date.now();
        this.completed = false;
    }

    isCompleted() {
        this.completed = true;
    }

    draw() {
        if (this.type === 'text') {
            console.log(this.text)
            drawTextWithBox(this.grid.ctx, this.text, this.currentLocation.x, this.currentLocation.y, this.textBoxOptions);
        } else if (this.type === 'image') {
            // this.grid.ctx.save();
            // this.grid.
            // this.grid.ctx.restore();
        }
        this.animate(this);
    }
}

export default Effect;