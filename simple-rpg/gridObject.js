class GridObject {
    constructor(name, grid, statsDiv, options) {
        this.name = name;
        this.grid = grid;
        this.statsDiv = statsDiv;

        this.height = options.height;
        this.width = options.width;
        this.imageUrl = options.imageUrl;
        this.image = new Image();
        this.image.src = this.imageUrl;
        this.selected = false;
        this.highlighted = false;
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
        if (this.image === null) return;
        
        this.grid.ctx.drawImage(
            this.image,
            this.x * this.grid.cellSize, this.y * this.grid.cellSize,
            this.width * this.grid.cellSize, this.height * this.grid.cellSize
        );

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