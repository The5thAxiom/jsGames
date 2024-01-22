class Grid {
    constructor(canvas, {height, width, cellSize, frameRate}, {lineColor, fillColor, mapUrl}) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.onItemSelect = 

        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.frameRate = frameRate;
        this.lineColor = lineColor;
        this.fillColor = fillColor;

        this.ctx.fillStyle = '#000000';
        this.canvas.height = this.cellSize * this.height;
        this.canvas.width = this.cellSize * this.width;
        this.canvas.style.height = this.cellSize * this.height;
        this.canvas.style.width = this.cellSize * this.width;

        this.setMap(mapUrl)

        this.reset()

        this.canvas.addEventListener('click', e => this.onGridClick(e))
        this.canvas.addEventListener('mousemove', e => this.onGridHover(e))
    }

    setMap(mapUrl) {
        this.mapUrl = mapUrl;
        this.map = new Image();
        this.map.src = this.mapUrl;
    }

    onGridClick(e) {
        for (let placedItem of this.items) {
            placedItem.unSelect();
        }
        const { x, y } = this._getCurrentCell(e);
        const clickedItem = this.occupiedBy[y][x];
        if (clickedItem !== null) {
            clickedItem.select()
        }
    }

    onGridHover(e) {
        for (let placedItem of this.items) {
            placedItem.unHighlight();
        }
        const { x, y } = this._getCurrentCell(e);
        const clickedItem = this.occupiedBy[y][x];
        if (clickedItem !== null) {
            clickedItem.highlight()
        }
    }

    resetCellColors() {
        this.cellColors = [];
            for (let i = 0; i < this.height; i++) {
                let temp = [];
                for (let j = 0; j < this.width; j++) {
                    temp.push(null);
                }
                this.cellColors.push(temp);
            }
    }

    _getCurrentCell(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Number.parseInt((e.clientX - rect.left) / this.cellSize);
        const y = Number.parseInt((e.clientY - rect.top) / this.cellSize);
        return { x, y };
    }

    reset() {
        this.items = [];
        this.loc = [];
        for (let yi = 0; yi < this.height; yi++) {
            let temp = [];
            for (let xi = 0; xi < this.width; xi++) {
                temp.push(null);
            }
            this.loc.push(temp);
        }
        this.occupiedBy = [];
        for (let yi = 0; yi < this.height; yi++) {
            let temp = [];
            for (let xi = 0; xi < this.width; xi++) {
                temp.push(null);
            }
            this.occupiedBy.push(temp);
        }
    this.resetCellColors();
    }

    canPlace(item, x, y) {
        const isInGrid = (
            x + item.width <= this.width
            && x >= 0
            && y + item.height <= this.height
            && y >= 0
        );
        if (!isInGrid) return false;

        let isInFreeSpace = true;
        for (let yi = y; yi < y + item.height; yi++) {
            for (let xi = x; xi < x + item.width; xi++) {
                isInFreeSpace &= this.occupiedBy[yi][xi] === null || this.occupiedBy[yi][xi] === item;
                if (!isInFreeSpace) return false;
            }
        }
        return true;
    }

    // item of type 'GridObject'
    place(item, x, y) {
        // console.log(`placing at ${x}, ${y}: ${item}`);
        if (!this.canPlace(item, x, y)) {
            return;
        }
        this.items.push(item);
        item.setPosition(x, y)
        this.loc[y][x] = item;
        for (let yi = y; yi < y + item.height; yi++) {
            for (let xi = x; xi < x + item.width; xi++) {
                this.occupiedBy[yi][xi] = item;
            }
        }
    }

    remove(item) {
        // console.log(item);
        this.items = this.items.filter(i => i !== item);
        this.loc[item.y][item.x] = null;
        for (let yi = item.y; yi < item.y + item.height; yi++) {
            for (let xi = item.x; xi < item.x + item.width; xi++) {
                this.occupiedBy[yi][xi] = null;
            }
        }
    }

    setCellFillColor(x, y, color) {
        this.cellColors[y][x] = color;
    }

    draw() {
        // console.log(this.loc)
        // draw the map
        if (this.mapUrl) {
            this.ctx.drawImage(
                this.map,
                0, 0,
                this.cellSize * this.width, this.cellSize * this.height
            );
        }

        // drawing the boxes
        for (let yi = 0; yi < this.height; yi++) {
            for (let xi = 0; xi < this.width; xi++) {
                this.ctx.save();
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.strokeRect(
                    xi * this.cellSize,
                    yi * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                if (this.mapUrl) this.ctx.globalAlpha = 0.2;

                this.ctx.fillStyle = this.cellColors[yi][xi];
                this.ctx.fillRect(
                    xi * this.cellSize,
                    yi * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                this.ctx.restore();
            }
        }

        // drawing the items
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const item = this.loc[i][j];
                if (item !== null) {
                    item.draw();
                }
            }
        }
    }
}

export default Grid;