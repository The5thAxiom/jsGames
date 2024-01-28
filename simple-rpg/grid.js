import GridObject from "./gridObjects/gridObject.js";

class Grid {
    constructor(canvas, {height, width, cellSize, frameRate, walls}, {lineColor, fillColor, mapUrl}) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.height = height;
        this.width = width;
        this.cellSize = window.innerWidth / this.width;

        this.walls = walls;
        this.wall = new GridObject('Wall', this, { size: 'medium'});

        this.canvasHeight = window.innerHeight;
        this.canvasWidth = window.innerWidth;

        this.mapHeight = this.cellSize * this.height;
        this.mapWidth = this.cellSize * this.width;

        this.canvas.height = this.canvasHeight;
        this.canvas.width = this.canvasWidth;

        this.frameRate = frameRate;
        this.lineColor = lineColor;
        this.fillColor = fillColor;

        this.ctx.fillStyle = '#000000';

        this.setMap(mapUrl)

        this.reset();

        // code to implement pan and zoom adapted from: https://codepen.io/chengarda/pen/wRxoyB?editors=0010
        this.cameraOffset = {
            x: 0,
            y: 0
        };
        this.maxZoom = 5;
        this.minZoom = 0.1;
        this.cameraZoom = 1;
        this.scrollSensitivity = 0.0005;

        /*
        free: can select/highlight object or zoom/pan
        panning: can pan the canvas
        select: can only highlight the squares below
        */
        this.mouseFunction = 'free';
        this.dragStart = { x: 0, y: 0 };

        this.canvas.addEventListener('click', e => this.onGridClick(e));
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', e => this.startPanning(e));
        this.canvas.addEventListener('mouseup', e => this.endPanning(e));
        this.canvas.addEventListener('mouseleave', e => this.endPanning(e));
        this.canvas.addEventListener('wheel', e => this.onScroll(e));
    }

    onScroll(e) {
        if (!this.isDragging) {
            const zoomAmount = e.deltaY * this.scrollSensitivity
            // console.log(`zooming: ${zoomAmount}`);
            if (zoomAmount) {
                this.cameraZoom -= zoomAmount;
            }
            // else if (zoomFactor) {
                // this.cameraZoom = this.zoomFactor * this.lastZoom;
            // }
            this.cameraZoom = Math.min(this.cameraZoom, this.maxZoom);
            this.cameraZoom = Math.max(this.cameraZoom, this.minZoom);
        }
    }

    startPanning(e) {
        // console.log('start dragging');
        if (this.mouseFunction == 'free') {
            this.mouseFunction = 'panning';
            this.dragStart.x = e.clientX / this.cameraZoom - this.cameraOffset.x;
            this.dragStart.y = e.clientY / this.cameraZoom - this.cameraOffset.y;
        }
    }

    endPanning(e) {
        // console.log('end dragging');
        if (this.mouseFunction == 'panning') {
            this.mouseFunction = 'free';
            this.lastZoom = this.cameraZoom;
        }
    }

    setMap(mapUrl) {
        this.mapUrl = mapUrl;
        this.map = new Image();
        this.map.src = this.mapUrl;
    }

    onGridClick(e) {
        // console.log('clicked')
        if (this.mouseFunction === 'free') {
            for (let placedItem of this.items) {
                placedItem.unSelect();
            }
            const { x, y, outOfBounds } = this.getCellUnderMouse(e);
            if (outOfBounds) return;
            const clickedItem = this.occupiedBy[y][x];
            if (clickedItem !== null) {
                clickedItem.select()
            }
        } else if (this.mouseFunction == 'select') {
            this.mouseFunction = 'free';
            const tempSelectBoxIsValid = !!this.tempSelectBox && this.selectBoxValidate(
                this.tempSelectBox.x,
                this.tempSelectBox.y,
                this.tempSelectBox.w,
                this.tempSelectBox.h,
            );
            // console.log('a', tempSelectBoxIsValid)
            if (tempSelectBoxIsValid) {
                this.selectBox = this.tempSelectBox;
            } else {
                for (let placedItem of this.items) {
                    placedItem.unSelect();
                }
            }
        }
    }

    onMouseMove(e) {
        const { x, y, outOfBounds } = this.getCellUnderMouse(e);
        if (this.mouseFunction === 'free' && !outOfBounds) {
            // unhighlight everything
            for (let placedItem of this.items) {
                placedItem.unHighlight();
            }
            // get the item over which the mouse is and highlight it
            const hoveredItem = this.occupiedBy[y][x];
            if (hoveredItem) {
                this.canvas.style.cursor = 'pointer';
                hoveredItem.highlight()
            }
            else this.canvas.style.cursor = 'move';
        } else if (this.mouseFunction === 'panning') {
            this.cameraOffset.x = e.clientX / this.cameraZoom - this.dragStart.x;
            this.cameraOffset.y = e.clientY / this.cameraZoom - this.dragStart.y;
            // console.log({xo: this.cameraOffset.x, yo: this.cameraOffset.y})
        } else if (this.mouseFunction === 'select') {
            const { x, y, w, h, outOfBounds } = this.getBoxUnderMouse(e, this.selectBoxDims.w, this.selectBoxDims.h);
            // console.log({ x, y, w, h, v: this.selectBoxValidate(x, y, w, h) });
            if (!outOfBounds && this.selectBoxValidate(x, y, w, h)) {
                this.tempSelectBox = { x, y, w, h };
            } else {
                this.tempSelectBox = null;
            }
            // console.log(this.tempSelectBox)
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

    getCellUnderMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const currentCellSize = this.cellSize * this.cameraZoom;
        const currentCanvasLeft = (rect.left + this.cameraOffset.x * this.cameraZoom);
        const currentCanvasTop = (rect.top + this.cameraOffset.y * this.cameraZoom);

        const x = Number.parseInt((e.clientX - currentCanvasLeft) / currentCellSize);
        const y = Number.parseInt((e.clientY - currentCanvasTop) / currentCellSize);

        const outOfBounds = x >= this.width || e.clientX < currentCanvasLeft || y >= this.height || e.clientY < currentCanvasTop;
        
        // don't remove this: debugging this function to account for the zoom and pan was tough, you may need this later
        // console.log({
        //     mx: e.clientX,
        //     my: e.clientY,
        //     // x, y,
        //     oob: outOfBounds,
        //     // ccs: currentCellSize,
        //     ccl: currentCanvasLeft, cct: currentCanvasTop,
        //     xo: this.cameraOffset.x, yo: this.cameraOffset.y, cz: this.cameraZoom
        // });
        return { x, y, outOfBounds};
    }

    getBoxUnderMouse(e, boxW, boxH) {
        const { x, y, outOfBounds } = this.getCellUnderMouse(e);
        if (outOfBounds) return { x: - 1, y: -1, outOfBounds };
        
        const leftCells = boxW % 2 === 0 ? boxW / 2 - 1: (boxW - 1) / 2;
        const rightCells = boxW % 2 === 0 ? boxW / 2: (boxW - 1) / 2;
        const topCells = boxH % 2 === 0 ? boxH / 2 - 1: (boxH - 1) / 2;
        const bottomCells = boxH % 2 === 0 ? boxH / 2 : (boxH - 1) / 2;
        // console.log({leftCells, rightCells, bottomCells, topCells})
        
        let answer = { x: x - leftCells, y: y - topCells, w: boxW, h: boxH, outOfBounds: false };
        // if the box touches any border
        if (x - leftCells < 0) answer.x = 0;
        if (x + rightCells >= this.width) answer.x = this.width - boxW;
        if (y - topCells < 0) answer.y = 0;
        if (y + bottomCells >= this.height) answer.y = this.height - boxH;
        return answer;
    }

    getBox(w, h, validate) {
        return new Promise((resolve, reject) => {
            this.mouseFunction = 'select';
            this.selectBoxDims = { w, h };
            this.selectBoxValidate = validate;
            // console.log(validate)
            this.selectBox = null;
            const keepChecking = setInterval(() => {
                // console.log(`checking: ${this.selectBox}`);
                if (this.mouseFunction === 'free') {
                    // console.log('end')
                    if (this.selectBox) {
                        this.selectBox.canceled = false;
                        resolve(this.selectBox)
                    } else {
                        resolve({x: -1, y: -1, h: -1, w: -1, canceled: true});
                    }
                    this.selectBoxDims = null;
                    this.selectBox = null;
                    this.selectBoxValidate = null;
                    this.tempSelectBox = null;
                    clearInterval(keepChecking);
                }
            }, 100);
        })
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
                if (this.walls[yi][xi]) temp.push(this.wall);
                else temp.push(null);
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

    moveTo(item, x, y) {
        this.remove(item);
        this.place(item, x, y);
    }

    setCellFillColor(x, y, color) {
        this.cellColors[y][x] = color;
    }

    draw() {
        // console.log(this.mouseFunction)
        // set canvas zoom/pan locations
        this.canvas.height = this.canvasHeight;
        this.canvas.width = this.canvasWidth;

        // this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.ctx.scale(this.cameraZoom, this.cameraZoom);
        this.ctx.translate(this.cameraOffset.x, this.cameraOffset.y)

        // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
                
                if (this.cellColors[yi][xi]) {
                    this.ctx.fillStyle = this.cellColors[yi][xi];
                    this.ctx.fillRect(
                        xi * this.cellSize,
                        yi * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
                this.ctx.restore();
            }
        }

        // drawing the select box
        if (this.tempSelectBox) {
            const { x, y, w, h } = this.tempSelectBox;
            this.ctx.save();
            this.ctx.strokeStyle = 'red';
            this.ctx.strokeRect(
                x * this.cellSize,
                y * this.cellSize,
                this.cellSize * w,
                this.cellSize * h);
            this.ctx.restore();
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
        // requestAnimationFrame(this.draw.bind(this))
    }
}

export default Grid;