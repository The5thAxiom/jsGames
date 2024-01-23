import GridObject from "./gridObject.js";
import {id, gridDistance, gridDistanceBetweenBoxes } from "./utils.js";

class Character extends GridObject{
    constructor(name, level, options) {
        super(name, level, options);
        this.speed = options.speed;
        this.maxHP = options.maxHP;
        this.currentHP = options.currentHP || options.maxHP;
        this.maxArmor = options.maxArmor;
        this.currentArmor = options.currentArmor || options.maxArmor;
        this.actions = options.actions;
        this.maxActions = options.maxActions || 1;
        this.remainingActions = options.remainingActions || this.maxActions;
        this.conditions = [];
        this.turnStartHandlers = [];
        this.turnEndHandlers = [];
        this.newTurn();

        this.enabled = false;
    }

    enable() {
        this.enabled = true;
        this.updateStatsDiv();
    }

    disable() {
        this.enabled = false;
        this.updateStatsDiv();
    }

    newTurn() {
        for (let handler of this.turnStartHandlers) {
            handler(this)
        }
        this.remainingActions = this.maxActions;
        this.remainingMovement = this.speed;
        for (let handler of this.turnStartHandlers) {
            handler(this)
        }
    }

    updateStatsDiv() {
        super.updateStatsDiv();
        this.statsDiv.innerHTML += `
        Speed: ${this.remainingMovement}/${this.speed} blocks <br />
        HP: ${this.currentHP}/${this.maxHP} <br />
        ${!!this.maxArmor ? `Armor: ${this.currentArmor}/${this.maxArmor}` : ''} <br />`
        
        // show action and movement options only if enabled
        if (this.enabled) {
            this.statsDiv.innerHTML += `
            <button id="move">Move</button> <br />
            Actions: ${this.remainingActions}/${this.maxActions}<br />
            <ul>
            `;
            for (let i in this.actions) {
                const action = this.actions[i];
                this.statsDiv.innerHTML += `<li><button id="action-${i}">${action.name}</button>: ${action.description}</li>`
            }
            this.statsDiv.innerHTML += '</u>';
            id('move').addEventListener('click', e => this.moveToSelectedCells(e));
            for (let i in this.actions) {
                const action = this.actions[i];
                id(`action-${i}`).addEventListener('click', () => this.performAction(i));
            }
        }

        this.level.updateTurnDiv();
    }

    damage(type, value) {
        this.currentHP -= value;
        if (this.currentHP <= 0) this.grid.remove(this)
    }
    
    heal(type, value) {
        if (type == 'HP') {
            this.currentHP = Math.min(this.maxHP, this.currentHP + value);
        } else if (type == 'Armor') {
            this.currentArmor = Math.min(this.maxArmor, this.currentArmor + value);
        }
    }

    async performAction(i) {
        const action = this.actions[i];

        const { x, y, canceled } = await this.grid.getBox(1, 1, (x, y, w, h) => {
            return gridDistance(this.x, this.y, x, y) <= action.range && this.grid.occupiedBy[y][x] instanceof Character;
        })
        if (canceled) return;
        
        const target = this.grid.occupiedBy[y][x];
        console.log(`${this.name} used ${action.name} on ${target.name}`);

        action.effect(target);

        this.remainingActions--;
        this.updateStatsDiv();
    }

    async moveToSelectedCells(e) {
        const { x, y, w, h, canceled } = await this.grid.getBox(this.width, this.height, (x, y, w, h) => {
            const distance = gridDistanceBetweenBoxes(this.x, this.y, this.width, this.height, x, y, w, h);
            return this.grid.canPlace(this, x, y) && distance <= this.remainingMovement;
        })
        if (canceled) return;
        // console.log({x, y})
        this.remainingMovement -= gridDistanceBetweenBoxes(this.x, this.y, this.width, this.height, x, y, w, h);
        this.grid.remove(this);
        this.grid.place(this, x, y);
    }

    unSelect() {
        super.unSelect();
    }

    draw() {
        super.draw();

        // show the name
        
        this.grid.ctx.save();
        this.grid.ctx.textAlign = 'center';
        this.grid.fill = 'red';
        this.grid.ctx.font = '15px sans-serif';
        this.grid.ctx.fillText(
            this.name,
            this.x * this.grid.cellSize + this.grid.cellSize / 2, // center horizontally
            this.y * this.grid.cellSize + this.grid.cellSize, // below the icon
        );
        this.grid.ctx.restore();

        if (this.highlighted) {
            this.grid.ctx.save();
            this.grid.ctx.textAlign = 'center';
            this.grid.fill = 'red';
            this.grid.ctx.font = '15px sans-serif';
            this.grid.ctx.fillText(
                `HP: ${this.currentHP}/${this.maxHP}${!!this.maxArmor ? ` | Armor: ${this.currentArmor}/${this.maxArmor}` : ''}`,
                this.x * this.grid.cellSize + this.grid.cellSize / 2, // center horizontally
                this.y * this.grid.cellSize,
            );
            this.grid.ctx.restore();
        }

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
                        this.grid.setCellFillColor(xi, yi, 'green');
                    }
                }
            }
        }
    }
}

export default Character;