import GridObject from "./gridObject.js";
import {id, gridDistance, sizeToBlocks } from "./utils.js";

class Character extends GridObject{
    constructor(name, grid, statsDiv, options) {
        super(name, grid, statsDiv, options)
        this.height = sizeToBlocks[options.size];
        this.width = sizeToBlocks[options.size];
        this.speed = options.speed;
        this.remainingMovement = options.speed;
        this.maxHP = options.maxHP;
        this.currentHP = options.currentHP || options.maxHP;
    }

    updateStatsDiv() {
        super.updateStatsDiv();
        this.statsDiv.innerHTML += `
        Speed: ${this.remainingMovement}/${this.speed} blocks <br />
        HP: ${this.currentHP}/${this.maxHP} <br />
        <button id="go-7">↖</button> <button id="go-8">↑</button> <button id="go-9">↗</button><br />
        <button id="go-4">←</button> <button id="go-5">.</button> <button id="go-6">→</button><br />
        <button id="go-1">↙</button><button id="go-2">↓</button><button id="go-3">↘</button>
        `;
        this.listeners = [];
        for (let i = 1; i <= 9; i++) {
            const listener = this.moveCharacter.bind(this, event, i);
            id(`go-${i}`).addEventListener('click', listener);
            this.listeners.push(listener);
        }
    }

    unSelect() {
        super.unSelect();

        for (let i in this.buttonListeners) {
            id(`go-${i}`).removeEventListener('click', this.listeners[i]);
        }
    }

    moveCharacter(e, dir) {
        if (this.remainingMovement <= 0) return;

        if (dir == 5) {
            // this.unSelect();
            return;
        }

        const x = this.x;
        const y = this.y;
        // console.log(this.grid);
        let newX, newY;
        if (dir == 1) {
            newX = x - 1;
            newY = y + 1;
        } else if (dir == 2) {
            newX = x;
            newY = y + 1;
        } else if (dir == 3) {
            newX = x + 1;
            newY = y + 1;
        } else if (dir == 4) {
            newX = x - 1;
            newY = y;
        } else if (dir == 6) {
            newX = x + 1;
            newY = y;
        } else if (dir == 7) {
            newX = x - 1;
            newY = y - 1;
        } else if (dir == 8) {
            newX = x;
            newY = y - 1;
        } else if (dir == 9) {
            newX = x + 1;
            newY = y - 1;
        }

        // check if the new location is okay
        // console.log({
        //     x, y,
        //     w: this.width, h: this.height,
        //     gw: this.grid.width, gh: this.grid.height
        // })
        if (this.grid.canPlace(this, newX, newY)) {
            this.grid.remove(this);
            this.grid.place(this, newX, newY);
            this.remainingMovement -= 1;
            this.updateStatsDiv();
        }
    }

    draw(x, y, width, height) {
        super.draw(x, y, width, height);

        if (this.selected) {
            this.grid.resetCellColors()
            for (let yi = 0; yi < this.grid.height; yi++) {
                for (let xi = 0; xi < this.grid.width; xi++) {
                    if (yi == this.y && xi == this.x) continue;
                    if (
                        (
                            gridDistance(xi, yi, this.x, this.y) <= this.remainingMovement
                            || gridDistance(xi, yi, this.x + this.width - 1, this.y + this.height - 1) <= this.remainingMovement
                            || gridDistance(xi, yi, this.x, this.y + this.height - 1) <= this.remainingMovement
                            || gridDistance(xi, yi, this.x + this.width - 1, this.y) <= this.remainingMovement
                        )
                        && this.grid.occupiedBy[yi][xi] === null
                        // && this.grid.canPlace(this, xi, yi)
                    ) {
                        // the condition to be used above needs to be more complex (add it later)
                        this.grid.setCellFillColor(xi, yi, 'lightgreen');
                    }
                }
            }
        }
    }
}

export default Character;