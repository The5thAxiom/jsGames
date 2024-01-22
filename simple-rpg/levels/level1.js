import Character from "../character.js";
import GridObject from "../gridObject.js";
import Level from "../level.js"

function getLevel1(container, statsDiv) {
    const level = new Level('Level 1', container, {
        mapUrl: 'https://shacknews-ugc.s3.us-east-2.amazonaws.com/user/196763/article-inline/2020-12/Laboratory.png',//?versionId=QbMnTMGa0Um7Rl0ygUPSwjM6yclxKVuC'
        statsDiv: statsDiv,
        height: 14,
        width: 18,
        cellSize: 40
    })

    new GridObject('tree', level, {
        size: 'large',
        imageUrl: 'https://www.freeiconspng.com/uploads/palm-tree-9.png',
        defaultLocation: {x: 8, y: 5}
    })

    new Character('thing2', level, {
        imageUrl: 'https://yasashiikyojinstudio.com/cdn/shop/files/Marut_01_Token_Round_A.png?v=1683157583',
        speed: 2,
        size: 'small',
        maxHP: 15,
        currentHP: 10,
        defaultLocation: {x: 6, y: 10}
    })

    new Character('thing3', level, {
        imageUrl: 'https://yasashiikyojinstudio.com/cdn/shop/files/Marut_01_Token_Round_A.png?v=1683157583',
        size: 'large',
        speed: 4,
        maxHP: 30,
        currentHP: 17,
        defaultLocation: {x: 3, y: 5}
    })

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

    return level
}

export default getLevel1;