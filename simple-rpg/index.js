import { id } from './utils.js';
import Character from "./character.js";
import Grid from "./grid.js";
import GridObject from "./gridObject.js";

const grid = new Grid(
    id('game-canvas'),
    {
        height: 14,
        width: 18,
        cellSize: 30,
        frameRate: 60,
    },
    {
        lineColor: 'black',
        fillColor: 'gray',
        mapUrl: 'https://shacknews-ugc.s3.us-east-2.amazonaws.com/user/196763/article-inline/2020-12/Laboratory.png'//?versionId=QbMnTMGa0Um7Rl0ygUPSwjM6yclxKVuC'
    }
)

const statsDiv = id('highlighted-object');


const tree = new GridObject('tree', grid, statsDiv, {
    height: 2,
    width: 2,
    imageUrl: 'https://www.freeiconspng.com/uploads/palm-tree-9.png'
})

const thing2 = new Character('thing2', grid, statsDiv, {
    imageUrl: 'https://yasashiikyojinstudio.com/cdn/shop/files/Marut_01_Token_Round_A.png?v=1683157583',
    speed: 2,
    size: 'small',
    maxHP: 15,
    currentHP: 10
})

const thing3 = new Character('thing3', grid, statsDiv, {
    imageUrl: 'https://yasashiikyojinstudio.com/cdn/shop/files/Marut_01_Token_Round_A.png?v=1683157583',
    size: 'large',
    speed: 4,
    maxHP: 30,
    currentHP: 17
})

grid.place(new GridObject(
    'pillar 1', grid, statsDiv, {
        height: 1,
        width: 1,
    }
), 5, 4)

grid.place(new GridObject(
    'pillar 2', grid, statsDiv, {
        height: 1,
        width: 1,
    }
), 12, 4)

grid.place(new GridObject(
    'pillar 3', grid, statsDiv, {
        height: 1,
        width: 1,
    }
), 12, 8)

grid.place(new GridObject(
    'pillar 4', grid, statsDiv, {
        height: 1,
        width: 1,
    }
), 5, 8)

grid.place(tree, 8, 5)
grid.place(thing2, 6, 10)
grid.place(thing3, 3, 5)

grid.draw();

(function run() {
    grid.draw();
    requestAnimationFrame(run);
})();