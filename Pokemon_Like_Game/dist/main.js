"use strict";
exports.__esModule = true;
var character_png_1 = require("./assets/character.png");
var tiles_png_1 = require("./assets/tiles.png");
var map = {
    cols: 24,
    rows: 21,
    tsize: 32,
    layers: [[
            10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 1, 1, 1, 1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
            12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 1, 1, 1, 1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
            10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 1, 1, 1, 1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
            12, 13, 12, 13, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
            10, 11, 10, 11, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 12, 13, 12, 13, 12, 13,
            12, 13, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 10, 11, 10, 11, 10, 11,
            10, 11, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 12, 13, 12, 13,
            12, 13, 12, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 10, 11, 10, 11,
            10, 11, 10, 11, 1, 1, 1, 1, 5, 3, 3, 3, 4, 12, 13, 2, 2, 2, 2, 1, 1, 1, 12, 13,
            12, 13, 12, 13, 7, 3, 3, 3, 6, 1, 1, 1, 1, 10, 11, 12, 13, 1, 1, 1, 1, 1, 10, 11,
            10, 11, 10, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 13, 10, 11, 1, 1, 22, 23, 1, 12, 13,
            12, 13, 12, 13, 1, 1, 1, 1, 1, 22, 18, 23, 1, 10, 11, 2, 2, 1, 22, 17, 20, 1, 10, 11,
            10, 11, 10, 11, 12, 13, 1, 22, 18, 17, 17, 20, 1, 2, 2, 2, 2, 2, 24, 17, 17, 23, 12, 13,
            12, 13, 12, 13, 10, 11, 1, 24, 17, 17, 17, 25, 1, 2, 2, 2, 2, 2, 2, 24, 17, 20, 10, 11,
            10, 11, 10, 11, 12, 13, 1, 1, 24, 19, 25, 1, 1, 2, 2, 2, 2, 2, 2, 1, 24, 25, 12, 13,
            12, 13, 12, 13, 10, 11, 1, 1, 1, 1, 7, 3, 3, 4, 2, 2, 2, 2, 2, 1, 1, 1, 10, 11,
            10, 11, 10, 11, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 12, 13, 2, 2, 1, 1, 1, 1, 12, 13,
            12, 13, 12, 13, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 10, 11, 2, 2, 1, 1, 1, 1, 10, 11,
            10, 11, 10, 11, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,
            12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 1, 1, 1, 1, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,
            10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 1, 1, 1, 1, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13
        ], [
            14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,
            14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 14, 15, 14, 15,
            14, 15, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 0, 0, 0, 0, 0, 0,
            0, 0, 16, 16, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 14, 15, 14, 15,
            14, 15, 26, 27, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 16, 0, 0, 0, 0,
            0, 0, 12, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 27, 16, 16, 16, 16, 16, 0, 0, 14, 15,
            14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 27, 16, 16, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 0, 0, 0, 0, 14, 15,
            14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 0, 0, 0, 0, 0, 14, 15,
            14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 14, 15, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 16, 0, 0, 0, 14, 15,
            14, 15, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 16, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 27, 16, 16, 16, 0, 0, 0, 14, 15,
            14, 15, 14, 15, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 14, 15, 26, 27, 14, 15, 14, 15, 14, 15,
            14, 15, 14, 15, 26, 27, 26, 27, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 10 || tile === 11 || tile === 12 || tile === 13;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};
var keyboard = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's',
    _keys: {},
    listenForEvents: function (keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        keys.forEach(function (key) {
            this._keys[key] = false;
        }.bind(this));
    },
    _onKeyDown: function (event) {
        var keyCode = event.key;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = true;
        }
    },
    _onKeyUp: function (event) {
        var keyCode = event.key;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = false;
        }
    },
    isDown: function (keyCode) {
        if (!(keyCode in this._keys)) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return this._keys[keyCode];
    }
};
var Camera = /** @class */ (function () {
    function Camera(map, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.maxX = map.cols * map.tsize - width;
        this.maxY = map.rows * map.tsize - height;
    }
    Camera.prototype.follow = function (sprite) {
        this.following = sprite;
        sprite.screenX = 0;
        sprite.screenY = 0;
    };
    Camera.prototype.update = function () {
        this.following.screenX = this.width / 2;
        this.following.screenY = this.height / 2;
        this.x = this.following.x - this.width / 2;
        this.y = this.following.y - this.height / 2;
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
        if (this.following.x < this.width / 2 ||
            this.following.x > this.maxX + this.width / 2) {
            this.following.screenX = this.following.x - this.x;
        }
        if (this.following.y < this.height / 2 ||
            this.following.y > this.maxY + this.height / 2) {
            this.following.screenY = this.following.y - this.y;
        }
    };
    return Camera;
}());
var Character = /** @class */ (function () {
    function Character(map, x, y) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 40;
        this.SPEED = 64;
        this.image = new Image();
        this.image.src = character_png_1["default"];
    }
    Character.prototype.move = function (delta, dirx, diry) {
        this.x += dirx * this.SPEED * delta;
        this.y += diry * this.SPEED * delta;
        this._collide(dirx, diry);
        var maxX = this.map.cols * this.map.tsize;
        var maxY = this.map.rows * this.map.tsize;
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    };
    Character.prototype._collide = function (dirx, diry) {
        var row, col;
        var left = this.x - this.width / 2;
        var right = this.x + this.width / 2 - 1;
        var top = this.y - this.height / 2;
        var bottom = this.y + this.height / 2 - 1;
        var collision = this.map.isSolidTileAtXY(left, top) ||
            this.map.isSolidTileAtXY(right, top) ||
            this.map.isSolidTileAtXY(right, bottom) ||
            this.map.isSolidTileAtXY(left, bottom);
        if (!collision) {
            return;
        }
        if (diry > 0) {
            row = this.map.getRow(bottom);
            this.y = -this.height / 2 + this.map.getY(row);
        }
        else if (diry < 0) {
            row = this.map.getRow(top);
            this.y = this.height / 2 + this.map.getY(row + 1);
        }
        else if (dirx > 0) {
            col = this.map.getCol(right);
            this.x = -this.width / 2 + this.map.getX(col);
        }
        else if (dirx < 0) {
            col = this.map.getCol(left);
            this.x = this.width / 2 + this.map.getX(col + 1);
        }
    };
    return Character;
}());
var Game = /** @class */ (function () {
    function Game() {
        this._previousElapsed = 0;
        this.dirx = 0;
        this.diry = 0;
        this.direction = 0;
        this.animation = 0;
        this.character = new Character(map, 200, 200);
        this.camera = new Camera(map, 384, 256);
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
        keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN]);
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
        var tileX = Math.floor(this.character.x / map.tsize);
        var tileY = Math.floor(this.character.y / map.tsize);
        if (tileX !== this.tileX || tileY !== this.tileY) {
            this.tileX = tileX;
            this.tileY = tileY;
            var tile = map.getTile(0, this.tileX, this.tileY);
            if (tile === 2 && Math.random() < 0.05) {
                console.log('Pokemon found!');
            }
        }
    };
    Game.prototype.update = function (delta) {
        this.dirx = 0;
        this.diry = 0;
        if (keyboard.isDown(keyboard.LEFT)) {
            this.dirx = -1;
        }
        else if (keyboard.isDown(keyboard.RIGHT)) {
            this.dirx = 1;
        }
        else if (keyboard.isDown(keyboard.UP)) {
            this.diry = -1;
        }
        else if (keyboard.isDown(keyboard.DOWN)) {
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
        var startCol = Math.floor(this.camera.x / map.tsize);
        var endCol = startCol + (this.camera.width / map.tsize);
        var startRow = Math.floor(this.camera.y / map.tsize);
        var endRow = startRow + (this.camera.height / map.tsize);
        var offsetX = -this.camera.x + startCol * map.tsize;
        var offsetY = -this.camera.y + startRow * map.tsize;
        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = map.getTile(layer, c, r);
                var x = (c - startCol) * map.tsize + offsetX;
                var y = (r - startRow) * map.tsize + offsetY;
                if (tile !== 0) {
                    this.ctx.drawImage(this.tileAtlas, (tile - 1) % 16 * map.tsize, Math.floor((tile - 1) / 16) * map.tsize, map.tsize, map.tsize, Math.round(x), Math.round(y), map.tsize, map.tsize);
                }
            }
        }
    };
    return Game;
}());
window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    var game = new Game;
    game.run(context);
};
//# sourceMappingURL=main.js.map