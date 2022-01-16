import { run } from './game.js';
import pacmanDirectionHandler from './task.js';
import { GAME_SETTINGS } from './settings.js';

run({
    settings: GAME_SETTINGS.thirdTask,
    pacmanDirectionHandler,
    showTestOutput: true,
    turnLimit: 10000,
    turnTimeMs: 0,
});
