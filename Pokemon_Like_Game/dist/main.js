"use strict";
exports.__esModule = true;
var game_1 = require("./lib/game");
window.onload = function () {
    var canvas = document.getElementById('demo');
    var context = canvas.getContext('2d');
    if (context) {
        var game = new game_1.Game(context);
        // game.run(context);
        canvas.height = game.GAME_HEIGHT;
        canvas.width = game.GAME_WIDTH;
    }
};
//# sourceMappingURL=main.js.map