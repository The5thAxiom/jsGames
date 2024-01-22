import Character from "../character.js";
import GridObject from "../gridObject.js";
import Level from "../level.js";

function getLevel1(container, statsDiv) {
    const level = new Level('Level 1', container, {
        mapUrl: 'https://shacknews-ugc.s3.us-east-2.amazonaws.com/user/196763/article-inline/2020-12/Laboratory.png',//?versionId=QbMnTMGa0Um7Rl0ygUPSwjM6yclxKVuC'
        statsDiv: statsDiv,
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
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 10, y: 3 }
    });

    new Character('Bug B', level, {
        imageUrl: "./assets/bug.png",
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 7, y: 3 }
    });

    new Character('Bug C', level, {
        imageUrl: "./assets/bug.png",
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 8, y: 4 }
    });

    new Character('Bug D', level, {
        imageUrl: "./assets/bug.png",
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 9, y: 4 }
    });

    new Character('Bug D', level, {
        imageUrl: "./assets/armour-devourer.png",
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 8, y: 2 }
    });

    // setting up the PCs
    new Character('Knight', level, {
        imageUrl: "./assets/knight.png",
        speed: 2,
        size: 'medium',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 8, y: 7 }
    });

    new Character('Mage', level, {
        imageUrl: "./assets/mage.png",
        speed: 2,
        size: 'medium',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 9, y: 9 }
    });

    new Character('Cleric', level, {
        imageUrl: "./assets/cleric.png",
        speed: 2,
        size: 'medium',
        maxHP: 15,
        currentHP: 15,
        defaultLocation: { x: 8, y: 9 }
    });

    return level
}

export default getLevel1;