"use strict";
exports.__esModule = true;
exports.Game = void 0;
var tiles_png_1 = require("../assets/tiles.png");
var map_1 = require("./map");
var keyboard_1 = require("./keyboard");
var camera_1 = require("./camera");
var avatar_1 = require("./avatar");
var pokemon_1 = require("./pokemon");
var Game = /** @class */ (function () {
    function Game() {
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.tileX = 0;
        this.tileY = 0;
        this.avatar = new avatar_1.Avatar(map_1.map, 200, 200);
        this.camera = new camera_1.Camera(map_1.map, 384, 256);
        this.camera.follow(this.avatar);
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
        var _a;
        window.requestAnimationFrame(function () { return _this.tick(elapsed); });
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 384, 256);
        // let delta = (elapsed - this._previousElapsed) / 1000.0;
        // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
        var delta = 0.01;
        this._previousElapsed = elapsed;
        this.update(delta);
        this.render();
        this.findPokemon();
    };
    Game.prototype.findPokemon = function () {
        var tileX = Math.floor(this.avatar.x / map_1.map.tsize);
        var tileY = Math.floor(this.avatar.y / map_1.map.tsize);
        if (tileX !== this.tileX || tileY !== this.tileY) {
            this.tileX = tileX;
            this.tileY = tileY;
            var tile = map_1.map.getTile(0, this.tileX, this.tileY);
            if (tile === 2 && Math.random() < 0.5) {
                var foundPokemon = new pokemon_1.Pokemon(1, 'grassland');
                var pokemon = foundPokemon.getPokemon();
                console.log(pokemon.name + ' found!');
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
        this.avatar.move(delta, this.dirx, this.diry);
        this.camera.update();
    };
    Game.prototype.render = function () {
        this._drawLayer(0);
        this._drawPlayer(false);
        this._drawLayer(1);
        this._drawPlayer(true);
    };
    Game.prototype._drawLayer = function (layer) {
        var _a;
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
                if (tile !== 0 && this.tileAtlas) {
                    (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(this.tileAtlas, (tile - 1) % 16 * map_1.map.tsize, Math.floor((tile - 1) / 16) * map_1.map.tsize, map_1.map.tsize, map_1.map.tsize, Math.round(x), Math.round(y), map_1.map.tsize, map_1.map.tsize);
                }
            }
        }
    };
    Game.prototype._drawPlayer = function (onlyDrawTop) {
        var _a;
        if (!onlyDrawTop) {
            this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
            if (this.diry === 0 && this.dirx === 0) {
                this.animation = 0;
            }
            this.animation = this.animation < 87 ? this.animation + 1 : 0;
        }
        var pixelHeight = onlyDrawTop ? 30 : 40;
        var characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(this.avatar.image, characterStart, 0, 28, pixelHeight, this.avatar.screenX - this.avatar.width / 2, this.avatar.screenY - this.avatar.height / 2, 28, pixelHeight);
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map