import Level from "../level.js";
import Character from "../gridObjects/character.js";
import GridObject from "../gridObjects/gridObject.js";
import Enemy from "../gridObjects/enemy.js";
import Player from "../gridObjects/player.js";
import Action from "../action.js"
import { gridDistance } from "../utils.js";

function biteNearestPlayer(enemy) {
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
        enemy.remainingActions--;
        enemy.actions[0].effect(target);
        console.log(`${enemy.name} used ${enemy.actions[0].name} on ${target.name}`);
        enemy.updateStatsDiv();
    }
}

function getLevel1(canvas, controlsDiv) {
    const level = new Level('Level 1', canvas, controlsDiv, {
        mapUrl: 'https://shacknews-ugc.s3.us-east-2.amazonaws.com/user/196763/article-inline/2020-12/Laboratory.png',
        height: 14,
        width: 18,
        cellSize: 100,
        walls: [
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true], // 0
            [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true], //1
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 2
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 3
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 4
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 5
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 6
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 7
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 8
            [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],// 9
            [true, true, false, false, false, false, false, true, true, true, true, false, false, false, false, false, true, true],// 10
            [true, true, false, false, false, false, false, true, true, true, true, false, false, false, false, false, true, true],// 11
            [true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true],// 12
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] // 13
        ],
        winCondition: level => {return level.enemies.every(e => e.currentHP === 0)},
        loseCondition: level => {return level.players.every(p => p.currentHP === 0)}
    });

    level.setEnvironmentObjects([
        new GridObject('pillar 1', level, {
            height: 1,
            width: 1,
            defaultLocation: { x: 5, y: 4 }
        }),
        new GridObject('pillar 2', level, {
            height: 1,
            width: 1,
            defaultLocation: { x: 12, y: 4 }
        }),
        new GridObject('pillar 3', level, {
            height: 1,
            width: 1,
            defaultLocation: { x: 12, y: 8 }
        }),
        new GridObject('pillar 4', level, {
            height: 1,
            width: 1,
            defaultLocation: { x: 5, y: 8 }
        })
    ]);
    level.setPlayers([
        new Player('Knight', level, {
            imageUrl: "./assets/knight.png",
            speed: 2,
            size: 'medium',
            maxHP: 15,
            maxArmor: 15,
            defaultLocation: { x: 8, y: 7 },
            actions: [
                new Action('Sword', {
                    description: 'Slashes a sword at the target to deal 3 points of slashing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('slashing', 3),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ]
        }),
        new Player('Mage', level, {
            imageUrl: "./assets/mage.png",
            speed: 3,
            size: 'medium',
            maxHP: 10,
            defaultLocation: { x: 9, y: 9 },
            actions: [
                new Action('Arcane Bolt', {
                    description: 'Shoots a bolt of arcane energy at the target upto 4 blocks away to do 2 points of magical damage',
                    type: 'rangedSingleTarget',
                    range: 4,
                    effect: target => target.damage('magical', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                }),
                new Action('Arcane Blast', {
                    description: 'Shoots a blast of arcane energy at a 2x2 area upto 5 blocks away to do 4 points of magical damage',
                    type: 'rangedAOE',
                    range: 5,
                    targetSize: 2,
                    maxUses: 1,
                    effect: target => target.damage('magical', 4),
                })
            ]
        }),
        new Player('Cleric', level, {
            imageUrl: "./assets/cleric.png",
            speed: 4,
            size: 'medium',
            maxHP: 15,
            defaultLocation: { x: 8, y: 9 },
            actions: [
                new Action('Bow', {
                    description: 'Shoots an arrow at the target upto 3 blocks away to do 1 piercing damage',
                    type: 'rangedSingleTarget',
                    range: 3,
                    effect: target => target.damage('peircing', 1),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                }), new Action('Prayer', {
                    description: 'Sings a soothing prayer for one target upto 4 blocks away, healing them by 2 points of HP',
                    type: 'rangedSingleTarget',
                    range: 4,
                    effect: target => target.heal('HP', 2)
                })
            ]
        }),
    ]);
    level.setEnemies([
        new Enemy('Bug A', level, {
            imageUrl: "./assets/bug.png",
            speed: 3,
            size: 'small',
            maxHP: 5,
            defaultLocation: { x: 10, y: 3 },
            actions: [
                new Action('Bite', {
                    description: 'Bites the target to do 2 points fo piercing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('piercing', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ],
            turnFunction: biteNearestPlayer
        }),
        new Enemy('Bug B', level, {
            imageUrl: "./assets/bug.png",
            speed: 3,
            size: 'small',
            maxHP: 5,
            defaultLocation: { x: 7, y: 3 },
            actions: [
                new Action('Bite', {
                    description: 'Bites the target to do 2 points fo piercing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('piercing', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ],
            turnFunction: biteNearestPlayer
        }),
        new Enemy('Bug C', level, {
            imageUrl: "./assets/bug.png",
            speed: 3,
            size: 'small',
            maxHP: 5,
            defaultLocation: { x: 8, y: 4 },
            actions: [
                new Action('Bite', {
                    description: 'Bites the target to do 2 points fo piercing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('piercing', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ],
            turnFunction: biteNearestPlayer
        }),
        new Enemy('Bug D', level, {
            imageUrl: "./assets/bug.png",
            speed: 3,
            size: 'small',
            maxHP: 5,
            defaultLocation: { x: 9, y: 4 },
            actions: [
                new Action('Bite', {
                    description: 'Bites the target to do 2 points fo piercing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('piercing', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ],
            turnFunction: biteNearestPlayer
        }),
        new Enemy('Bug E', level, {
            imageUrl: "./assets/bug.png",
            speed: 3,
            size: 'small',
            maxHP: 5,
            defaultLocation: { x: 10, y: 4 },
            actions: [
                new Action('Bite', {
                    description: 'Bites the target to do 2 points fo piercing damage',
                    type: 'melee',
                    range: 1,
                    effect: target => target.damage('piercing', 2),
                    isValidTarget: (character, target) => character !== target && target instanceof Character
                })
            ],
            turnFunction: biteNearestPlayer
        }),
        // new Enemy('Armour Devourer', level, {
        //     imageUrl: "./assets/armour-devourer.png",
        //     speed: 4,
        //     size: 'medium',
        //     maxHP: 20,
        //     defaultLocation: { x: 8, y: 2 },
        //     actions: [
        //         new Action('Bite', {
        //             description: 'Bites the target fiercely to do 5 points of piercing damage and removes 3 points of armor',
        //             type: 'melee',
        //             range: 1,
        //             effect: target => {
        //                 target.damage('piercing', 5);
        //                 if (target.currentArmor && target.currentArmor > 0) target.currentArmor = Math.max(0, target.currentArmor - 3);
        //             },
        //             isValidTarget: (character, target) => character !== target && target instanceof Character
        //         })
        //     ]
        // }),
    ])

    return level
}

export default getLevel1;