import { id } from './utils.js';
import getLevel1 from './levels/level1.js';

const statsDiv = id('controls');
const canvas = id('game');

const level = getLevel1(canvas, statsDiv);

level.init();

(function run() {
    level.show()
    requestAnimationFrame(run);
})();