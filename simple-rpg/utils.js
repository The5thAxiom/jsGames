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
    const textPadding = 2;
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

async function attackNearestPlayer(enemy) {
    const grid = enemy.grid;
    const originalPos = { x: enemy.x, y: enemy.y };
    let target = null;
    let targetPos = {x: -1, y: -1}
    for (let yi = Math.max(0, enemy.y - enemy.speed); yi <= Math.min(grid.height, enemy.y + enemy.speed); yi++) {
        if (target) break;
        for (let xi = Math.max(0, enemy.x - enemy.speed); xi <= Math.min(grid.width, enemy.x + enemy.speed); xi++) {// for each cell in the 
            if (target) break;
            // console.log(`${enemy.name} (speed ${enemy.speed}) searching at: ${xi}, ${yi}`);
            if (!grid.occupiedBy[yi][xi] || grid.occupiedBy[yi][xi] === enemy) {
                for (let i = Math.max(0, yi - 1); i <= Math.min(grid.height, yi + 1); i++) {
                    if (target) break;
                    for (let j = Math.max(0, xi - 1); j <= Math.min(grid.width, xi + 1); j++) {
                        if (target) break;
                        const tempTarget = grid.occupiedBy[i][j];
                        // console.log(`${this.name} checking if ${tempTarget ? tempTarget.name : 'null'} at ${j}, ${i}`);
                        if (tempTarget && tempTarget instanceof Player && tempTarget.currentHP > 0) {
                            target = tempTarget;
                            targetPos.x = xi;
                            targetPos.y = yi;
                            // console.log('P.S. it was')
                        }
                    }
                }
            }
        }
    }
    if (target) {
        grid.moveTo(enemy, targetPos.x, targetPos.y);
        enemy.remainingMovement -= gridDistance(targetPos.x, targetPos.y, originalPos.x, originalPos.y);
        await sleep(250);
        enemy.remainingActions--;
        enemy.actions[0].effect(target);
        console.log(enemy.actions[0].audioUrl)
        await enemy.actions[0].audio.play();
        console.log(`${enemy.name} used ${enemy.actions[0].name} on ${target.name}`);
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

export { id, gridDistance, gridDistanceBetweenBoxes, drawTextWithBox, sizeToBlocks, attackNearestPlayer, sleep };