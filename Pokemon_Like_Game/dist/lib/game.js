"use strict";
exports.__esModule = true;
exports.Game = void 0;
var tiles_png_1 = require("../assets/tiles.png");
var map_1 = require("./map");
var keyboard_1 = require("./keyboard");
var camera_1 = require("./camera");
var character_1 = require("./character");
var Game = /** @class */ (function () {
    function Game() {
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.character = new character_1.Character(map_1.map, 200, 200);
        this.camera = new camera_1.Camera(map_1.map, 384, 256);
        this.camera.follow(this.character);
    }
    Game.prototype.run = function (context) {
        var _this = this;
        this.ctx = context;
        this.loadAssetMap();
        this.init();
        window.requestAnimationFrame(function () { return _this.tick(0); });
    };
    Game.prototype.loadAssetMap = function () {
        var img = new Image();
        img.src = tiles_png_1["default"];
        this.tileAtlas = img;
    };
    Game.prototype.init = function () {
        keyboard_1.keyboard.listenForEvents([keyboard_1.keyboard.LEFT, keyboard_1.keyboard.RIGHT, keyboard_1.keyboard.UP, keyboard_1.keyboard.DOWN]);
    };
    Game.prototype.tick = function (elapsed) {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.tick(elapsed); });
        this.ctx.clearRect(0, 0, 384, 256);
        // let delta = (elapsed - this._previousElapsed) / 1000.0;
        // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
        var delta = 0.01;
        this._previousElapsed = elapsed;
        this.update(delta);
        this.render();
        this.findPokemon();
    };
    Game.prototype.findPokemon = function () {
        var tileX = Math.floor(this.character.x / map_1.map.tsize);
        var tileY = Math.floor(this.character.y / map_1.map.tsize);
        if (tileX !== this.tileX || tileY !== this.tileY) {
            this.tileX = tileX;
            this.tileY = tileY;
            var tile = map_1.map.getTile(0, this.tileX, this.tileY);
            if (tile === 2 && Math.random() < 0.05) {
                console.log('Pokemon found!');
            }
        }
    };
    Game.prototype.update = function (delta) {
        this.dirx = 0;
        this.diry = 0;
        if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.LEFT)) {
            this.dirx = -1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.RIGHT)) {
            this.dirx = 1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.UP)) {
            this.diry = -1;
        }
        else if (keyboard_1.keyboard.isDown(keyboard_1.keyboard.DOWN)) {
            this.diry = 1;
        }
        this.character.move(delta, this.dirx, this.diry);
        this.camera.update();
    };
    Game.prototype.render = function () {
        this._drawLayer(0);
        this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
        if (this.diry === 0 && this.dirx === 0) {
            this.animation = 0;
        }
        var characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;
        this.animation = this.animation < 87 ? this.animation + 1 : 0;
        this.ctx.drawImage(this.character.image, characterStart, 0, 28, 40, this.character.screenX - this.character.width / 2, this.character.screenY - this.character.height / 2, 28, 40);
        this._drawLayer(1);
        this.ctx.drawImage(this.character.image, characterStart, 0, 28, 30, this.character.screenX - this.character.width / 2, this.character.screenY - this.character.height / 2, 28, 30);
    };
    Game.prototype._drawLayer = function (layer) {
        var startCol = Math.floor(this.camera.x / map_1.map.tsize);
        var endCol = startCol + (this.camera.width / map_1.map.tsize);
        var startRow = Math.floor(this.camera.y / map_1.map.tsize);
        var endRow = startRow + (this.camera.height / map_1.map.tsize);
        var offsetX = -this.camera.x + startCol * map_1.map.tsize;
        var offsetY = -this.camera.y + startRow * map_1.map.tsize;
        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = map_1.map.getTile(layer, c, r);
                var x = (c - startCol) * map_1.map.tsize + offsetX;
                var y = (r - startRow) * map_1.map.tsize + offsetY;
                if (tile !== 0) {
                    this.ctx.drawImage(this.tileAtlas, (tile - 1) % 16 * map_1.map.tsize, Math.floor((tile - 1) / 16) * map_1.map.tsize, map_1.map.tsize, map_1.map.tsize, Math.round(x), Math.round(y), map_1.map.tsize, map_1.map.tsize);
                }
            }
        }
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map