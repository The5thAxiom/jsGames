import { id } from './utils.js';
import Character from "./character.js";
import Grid from "./grid.js";
import GridObject from "./gridObject.js";

const grid = new Grid(
    id('game-canvas'),
    {
        height: 10,
        width: 20,
        cellSize: 70,
        frameRate: 60,
    },
    {
        lineColor: 'black',
        fillColor: 'gray',
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
    size: 'huge',
    speed: 4,
    maxHP: 30,
    currentHP: 17
})

grid.place(tree, 0, 0)
grid.place(thing2, 1, 2)
grid.place(thing3, 3, 3)

grid.draw();

(function run() {
    grid.draw();
    requestAnimationFrame(run);
})();