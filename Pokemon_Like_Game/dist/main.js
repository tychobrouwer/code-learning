"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./lib/game");
window.onload = function () {
    const canvas = document.getElementById('demo');
    const context = canvas.getContext('2d');
    if (context) {
        const game = new game_1.Game(context);
        // game.run(context);
        canvas.height = game.GAME_HEIGHT;
        canvas.width = game.GAME_WIDTH;
    }
};
//# sourceMappingURL=main.js.map