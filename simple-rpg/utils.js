import Action from './action.js';
import Enemy from './gridObjects/enemy.js';
import Player from './gridObjects/player.js';

const id = id => document.getElementById(id);


function gridDistance(x1, y1, x2, y2) {
    const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    return distance;
}

function gridDistanceBetweenBoxes(x1, y1, w1, h1, x2, y2, w2, h2) {
    return gridDistance(x1, y1, x2, y2);
    // let minDist = 1000;
    // for (let x1i = x1; x1i < x1 + w1; x1i++) {
    //     for (let y1i = y1; y1i < y1 + h1; y1i++) {
    //         for (let x2i = x2; x2i < x2 + w2; x2i++) {
    //             for (let y2i = y2; y2i < y2 + h2; y2i++) {
    //                 const dist = gridDistance(x1i, y1i, x2i, y2i)
    //                 // console.log(dist);
    //                 minDist = Math.min(minDist, dist);
    //             }
    //         }
    //     }
    // }
    // console.log(minDist);
    // return minDist;
}

function drawTextWithBox(ctx, text, x, y, {font, textFill, textStroke, boxFill, boxStroke}) {
    if (!textFill) textFill = 'white';
    if (!textStroke) textStroke = 'white';
    if (!boxFill) boxFill = 'grey';
    if (!boxStroke) boxStroke = 'grey';

    ctx.save();
    ctx.font = font;

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const textPadding = 3;
    // draw box
    ctx.fillStyle = boxFill;
    ctx.strokeStyle = boxStroke;
    ctx.beginPath();
    ctx.roundRect(
        x - textWidth / 2 - textPadding, y - textHeight / 2 - textPadding,
        textWidth + textPadding, textHeight + textPadding,
        3
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // draw text
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = textFill;
    ctx.strokeStyle = textStroke;
    ctx.fillText(text, x, y);
    
    ctx.restore();
}

/**
 * 
 * @param {Enemy} enemy 
 * @param {number} x 
 * @param {number} y 
 * @param {Action} action 
 * @returns {Player}
 */
function playerInRange(enemy, x, y, action) {
    const grid = enemy.grid;
    let target = null;
    
    for (let i = Math.max(0, y - action.range); i <= Math.min(grid.height, y + (enemy.height - 1) + action.range); i++) {
        for (let j = Math.max(0, x - action.range); j <= Math.min(grid.width, x + (enemy.width - 1) + action.range); j++) {
            const tempTarget = grid.occupiedBy[i][j];
            if (tempTarget && tempTarget instanceof Player && tempTarget.currentHP > 0) {
                target = tempTarget;
            }
        }
    }
    return target;
}

/**
 * 
 * @param {Enemy} enemy 
 * @returns {Promise<void>}
 */
async function attackNearestPlayer(enemy) {
    const grid = enemy.grid;
    const originalPos = { x: enemy.x, y: enemy.y };
    let newPos = null;
    
    let target = playerInRange(enemy, enemy.x, enemy.y, enemy.actions[0]);
    if (!target) {
        for (let yi = Math.max(0, enemy.y - enemy.speed); yi <= Math.min(grid.height, enemy.y + enemy.speed); yi++) {
            if (target) break;
            for (let xi = Math.max(0, enemy.x - enemy.speed); xi <= Math.min(grid.width, enemy.x + enemy.speed); xi++) {
                if (target) break;
                if (grid.canPlace(enemy, xi, yi)) {
                    target = playerInRange(enemy, xi, yi, enemy.actions[0]);
                    if (target) {
                        newPos = { x: xi, y: yi };
                    }
                }
            }
        }
    }
    if (target) {
        if (newPos && !(newPos.x === originalPos.x && newPos.y === originalPos.y)) {
            console.log(`${this.name} moved from (${this.x},${this.y}) to (${newPos.x}, ${newPos.y})`);
            grid.moveTo(enemy, newPos.x, newPos.y);
            await playAudio(Enemy.footstepsSound);
            enemy.remainingMovement -= gridDistance(newPos.x, newPos.y, originalPos.x, originalPos.y);
        }
        await sleep(250);
        await playAudio(enemy.actions[0].audio);
        enemy.actions[0].effect(target);
        console.log(`${enemy.name} used ${enemy.actions[0].name} on ${target.name}`);
        enemy.remainingActions--;
        enemy.updateStatsDiv();
    }
}

const sizeToBlocks = {
    "tiny": 0.5,
    "small": 1,
    "medium": 1,
    "large": 2,
    "huge": 3
}

/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * 
 * @param {HTMLAudioElement} audio 
 * @returns {Promise<void>}
 */
const playAudio = audio => new Promise(r => {
    audio.play();
    audio.onended = r;
})

export { id, gridDistance, gridDistanceBetweenBoxes, drawTextWithBox, sizeToBlocks, attackNearestPlayer, sleep, playAudio };