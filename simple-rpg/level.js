import Grid from "./grid.js";
import { id } from "./utils.js";

class Level {
    constructor(name, canvas, controlsDiv, {mapUrl, width, height, cellSize, environmentObjects, monsters, players}) {
        this.name = name;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.mapUrl = mapUrl;

        this.grid = new Grid(this.canvas, {
            height: this.height,
            width: this.width,
            cellSize: this.cellSize,
            frameRate: 60,
        }, {
            lineColor: 'black',
            mapUrl: this.mapUrl
        });

        this.controlsDiv = controlsDiv;
        this.turnDiv = document.createElement('div');
        this.turnDiv.id = 'turn-div';
        this.statsDiv = document.createElement('div');
        this.statsDiv.id = 'stats-div';
        this.controlsDiv.appendChild(this.turnDiv);
        this.controlsDiv.appendChild(this.statsDiv);

        this.playersTurn = true;
        this.roundCount = 1;
    }

    updateTurnDiv() {
        this.turnDiv.innerHTML = `
        <h2>Round ${this.roundCount}</h2>
        ${this.playersTurn ? "Players'" : "Enemies'"} turn <br />
        <button id="end-turn">End Turn</button>
        <hr />
        <h3>Players</h3>
        <ul>
        `;
        for (let player of this.players) {
            this.turnDiv.innerHTML += `<li>${player.name}: `;
            if (player.currentHP > 0) {
                this.turnDiv.innerHTML += `HP: ${player.currentHP}/${player.maxHP}`;
                if (player.maxArmor) {
                    this.turnDiv.innerHTML += ` | Armor: ${player.currentArmor}/${player.maxArmor}`;
                }
            } else {
                this.turnDiv.innerHTML += 'Dead';
            }
            this.turnDiv.innerHTML += '</li>';
        }
        this.turnDiv.innerHTML += '</ul>';

        this.turnDiv.innerHTML += `
        <h3>Players</h3>
        <ul>
        `;
        for (let player of this.enemies) {
            this.turnDiv.innerHTML += `<li>${player.name}: `;
            if (player.currentHP > 0) {
                this.turnDiv.innerHTML += `HP: ${player.currentHP}/${player.maxHP}`;
                if (player.maxArmor) {
                    this.turnDiv.innerHTML += ` | Armor: ${player.currentArmor}/${player.maxArmor}`;
                }
            } else {
                this.turnDiv.innerHTML += 'Dead';
            }
            this.turnDiv.innerHTML += '</li>';
        }
            this.turnDiv.innerHTML += '</ul>';

        id('end-turn').addEventListener('click', () => {
            this.playersTurn = !this.playersTurn;
            if (this.playersTurn) this.roundCount++;
            this.newTurn();
        })
    }

    init() {
        if (this.players && this.enemies) {
            this.updateTurnDiv();
            this.newTurn();
        }
    }

    setPlayers(players) {
        this.players = players
    }

    setEnemies(enemies) {
        this.enemies = enemies
    }

    setEnvironmentObjects(environmentObjects) {
        this.environmentObjects = environmentObjects;
    }

    newTurn() {
        if (this.playersTurn) {
            for (let player of this.players) {
                player.enable();
                player.newTurn();
            }
            for (let enemy of this.enemies) {
                enemy.disable();
            }
        } else {
            for (let enemy of this.enemies) {
                enemy.enable();
                enemy.newTurn();
            }
            for (let player of this.players) {
                player.disable();
            }
        }
        this.updateTurnDiv();
    }

    show() {
        this.grid.draw();
    }
}

export default Level;