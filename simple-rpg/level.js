import Grid from "./grid.js";
import { id } from "./utils.js";

class Level {
    constructor(name, canvas, controlsDiv, {mapUrl, width, height, cellSize, walls, winCondition, loseCondition}) {
        this.name = name;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.mapUrl = mapUrl;
        this.walls = walls;

        this.winCondition = winCondition;
        this.loseCondition = loseCondition;

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

        this.showGrid = true;

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
        <div id="title-round">
            <h1 id="game-title"><img src="assets/icon.png" /> Simple-RPG</h1>
            <hr />
            <h2>Round ${this.roundCount}</h2>
            <span id="end-turn" class='button'>End Turn</span>
            <hr />
        </div>
        `;
        let textToAdd = '';
        textToAdd += `
            <h3>Players</h3>
            <div class="characters">
                ${this.players.reduce((val, player) => val + `
                    <div class="character">
                        <img src="${player.imageUrl}" />
                        <div class="info">
                            <div>${player.name}</div>
                            ${player.currentHP > 0 ? `
                                ${player.maxArmor ? `<div>
                                    Armor: ${player.currentArmor}/${player.maxArmor}
                                    <progress class='armor-bar' value=${player.currentArmor} max=${player.maxArmor}></progress>
                                </div>` : ''}
                                <div>
                                    HP: ${player.currentHP}/${player.maxHP}
                                    <progress class='hp-bar' value=${player.currentHP} max=${player.maxHP}></progress>
                                </div>
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
                        <div class="info">
                            <div>${player.name}</div>
                            ${player.currentHP > 0 ? `
                                ${player.maxArmor ? `<div>
                                    Armor: ${player.currentArmor}/${player.maxArmor}
                                    <progress class='armor-bar' value=${player.currentArmor} max=${player.maxArmor}></progress>
                                </div>` : ''}
                                <div>
                                    HP: ${player.currentHP}/${player.maxHP}
                                    <progress class='hp-bar' value=${player.currentHP} max=${player.maxHP}></progress>
                                </div>
                            ` : 'Dead'}
                        </div>
                    </div>
                `, '')}
            </div>
        `;

        this.turnDiv.innerHTML += textToAdd;

        id('end-turn').addEventListener('click', () => {
            this.playersTurn = false;
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
        this.players = players;
    }

    setEnemies(enemies) {
        this.enemies = enemies;
    }

    setEnvironmentObjects(environmentObjects) {
        this.environmentObjects = environmentObjects;
    }

    newTurn() {
        if (this.winCondition(this)) {
            // this.showGrid = false;
            this.turnDiv.innerHTML = '';
            this.statsDiv.innerHTML = '';
            alert(`The players have won ${this.name}`);
            return;
        }
        if (this.loseCondition(this)) {
            // this.showGrid = false;
            this.turnDiv.innerHTML = '';
            this.statsDiv.innerHTML = '';
            alert(`The enemies have won ${this.name}`);
            return;
        }
        if (this.playersTurn) {
            for (let player of this.players) {
                player.newTurn();
            }
        } else {
            for (let player of this.players) {
                player.disable();
            }
            for (let enemy of this.enemies) {
                if (enemy.currentHP > 0) {
                    enemy.newTurn();
                    enemy.takeTurn();
                }
            }
            for (let player of this.players) {
                player.enable();
            }
            this.playersTurn = true;
            this.roundCount++;
            this.newTurn();
        }
        this.updateTurnDiv();
    }

    show() {
        if (this.showGrid) {
            this.grid.draw();
        }
    }
}

export default Level;