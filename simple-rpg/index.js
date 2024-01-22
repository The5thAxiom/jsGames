import { id } from './utils.js';
import getLevel1 from './levels/level1.js';

const statsDiv = id('highlighted-object');
const container = id('game');

const level = getLevel1(container, statsDiv);

(function run() {
    level.show()
    requestAnimationFrame(run);
})();