import { id } from './utils.js';
import getLevel1 from './levels/level1.js';
import getLevel2 from './levels/level2.js';

const statsDiv = id('stats-div');
const turnDiv = id('turn-div');
const canvas = id('game');


let levels = null;
let currentLevelIndex = 0;
let currentLevel = null;

function init() {
    levels = [getLevel1, getLevel2];
    currentLevelIndex = 0;
    currentLevel = levels[0](canvas, turnDiv, statsDiv);
    currentLevel.init();
}

function nextLevel() {
    currentLevel.remove();
    currentLevelIndex++;
    currentLevel = levels[currentLevelIndex](canvas, turnDiv, statsDiv);
    currentLevel.init();
    currentLevel.init();
}

function run() {
    const levelOver = currentLevel.show();
    if (levelOver === 'won') {
        alert(`congratulations, you won ${currentLevel.name}`);
        nextLevel();
    } else if (levelOver === 'lost') {
        alert(`oh no! you lost, starting new game`);
        init();
    }
    requestAnimationFrame(run);
}

init();
run();