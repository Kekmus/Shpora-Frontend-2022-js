import { run } from './game.js';
import pacmanDirectionHandler from './task.js';
import { GAME_SETTINGS } from './settings.js';

run({
    settings: GAME_SETTINGS.secondTask,
    pacmanDirectionHandler,
    showTestOutput: false,
    turnLimit: 0,
    turnTimeMs: 100,
});
