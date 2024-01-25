import Grid from "./grid.js";
import { id } from "./utils.js";

class Level {
    constructor(name, canvas, controlsDiv, {mapUrl, width, height, cellSize, walls}) {
        this.name = name;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.mapUrl = mapUrl;
        this.walls = walls;

        this.grid = new Grid(this.canvas, {
            height: this.height,
            width: this.width,
            cellSize: this.cellSize,
            frameRate: 60,
            walls: this.walls
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
        <h1 id="game-title"><img src="assets/icon.png" /> Simple-RPG</h1>
        <hr />
        <h2>Round ${this.roundCount}: ${this.playersTurn ? "Players'" : "Enemies'"} turn <br />
        </h2>
        <button id="end-turn">End Turn</button>
        `;
        let textToAdd = '';
        textToAdd += `
            <hr />
            <h3>Players</h3>
            <div class="characters">
                ${this.players.reduce((val, player) => val + `
                    <div class="character">
                        <img src="${player.imageUrl}" />
                        <div class="info" >
                            <div>${player.name}</div>
                            ${player.currentHP > 0 ? `
                                ${player.maxArmor ? `<div>Armor: <progress class='armor-bar' value=${player.currentArmor} max=${player.maxArmor}></progress></div>` : ''}
                                <div>HP: <progress class='hp-bar' value=${player.currentHP} max=${player.maxHP}></div></progress>
                            ` : 'Dead'}
                        </div>
                    </div>
                `, '')}
            </div>
        `;

        textToAdd += `
            <hr />
            <h3>Enemies</h3>
            <div class="characters">
                ${this.enemies.reduce((val, player) => val + `
                    <div class="character">
                        <img src="${player.imageUrl}" />
                        <div class="info" >
                            <div>${player.name}</div>
                            ${player.currentHP > 0 ? `
                                ${player.maxArmor ? `<div>Armor: <progress class='armor-bar' value=${player.currentArmor} max=${player.maxArmor}></progress></div>` : ''}
                                <div>HP: <progress class='hp-bar' value=${player.currentHP} max=${player.maxHP}></div></progress>
                            ` : 'Dead'}
                        </div>
                    </div>
                `, '')}
            </div>
        `;

        this.turnDiv.innerHTML += textToAdd;

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