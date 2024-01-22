import { id } from './utils.js';
import getLevel1 from './levels/level1.js';

const statsDiv = id('highlighted-object');
const canvas = id('game');

const level = getLevel1(canvas, statsDiv);

(function run() {
    level.show()
    requestAnimationFrame(run);
})();