import Character from "../character.js";
import GridObject from "../gridObject.js";
import Level from "../level.js";
import Action from "../action.js"

function getLevel1(canvas, statsDiv) {
    const level = new Level('Level 1', canvas, statsDiv, {
        mapUrl: 'https://shacknews-ugc.s3.us-east-2.amazonaws.com/user/196763/article-inline/2020-12/Laboratory.png',
        height: 14,
        width: 18,
        cellSize: 100
    });

    // setting up the environment
    new GridObject('pillar 1', level, {
        height: 1,
        width: 1,
        defaultLocation: { x: 5, y: 4 }
    });

    new GridObject('pillar 2', level, {
        height: 1,
        width: 1,
        defaultLocation: { x: 12, y: 4 }
    });

    new GridObject('pillar 3', level, {
        height: 1,
        width: 1,
        defaultLocation: { x: 12, y: 8 }
    });

    new GridObject('pillar 4', level, {
        height: 1,
        width: 1,
        defaultLocation: { x: 5, y: 8 }
    });

    // setting up the NPCs
    new Character('Bug A', level, {
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
                effect: target => target.damage('piercing', 2)
            })
        ]
    });

    new Character('Bug B', level, {
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
                effect: target => target.damage('piercing', 2)
            })
        ]
    });

    new Character('Bug C', level, {
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
                effect: target => target.damage('piercing', 2)
            })
        ]
    });

    new Character('Bug D', level, {
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
                effect: target => target.damage('piercing', 2)
            })
        ]
    });

    new Character('Armour Devourer', level, {
        imageUrl: "./assets/armour-devourer.png",
        speed: 4,
        size: 'medium',
        maxHP: 20,
        defaultLocation: { x: 8, y: 2 },
        actions: [
            new Action('Bite', {
                description: 'Bites the target fiercely to do 5 points of piercing damage and removes 3 points of armor',
                type: 'melee',
                range: 1,
                effect: target => {
                    target.damage('piercing', 5);
                    if (target.currentArmor && target.currentArmor > 0) target.currentArmor = Math.max(0, target.currentArmor - 3);
                }
            })
        ]
    });

    // setting up the PCs
    new Character('Knight', level, {
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
                effect: target => target.damage('slashing', 3)
            })
        ]
    });

    new Character('Mage', level, {
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
                effect: target => target.damage('magical', 2)
            })
        ]
    });

    new Character('Cleric', level, {
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
                effect: target => target.damage('peircing', 1)
            }), new Action('Prayer', {
                description: 'Sings a soothing prayer for one target upto 4 blocks away, healing them by 2 points of HP',
                type: 'rangedSingleTarget',
                range: 4,
                effect: target => target.heal('HP', 2)
            })
        ]
    });

    return level
}

export default getLevel1;