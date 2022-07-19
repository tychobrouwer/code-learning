"use strict";
exports.__esModule = true;
var game_1 = require("./lib/game");
window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    var game = new game_1.Game;
    game.run(context);
};
//# sourceMappingURL=main.js.map