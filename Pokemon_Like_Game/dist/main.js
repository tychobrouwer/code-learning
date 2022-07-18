// type loader = {
//   images: object;
//   loadImage: (key: string, source: string) => HTMLImageElement
//   getImage: (key: string) => HTMLImageElement;
// }
var map = {
    cols: 12,
    rows: 12,
    tsize: 64,
    layers: [[
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
            3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
            3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
        ], [
            4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
        ]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
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
        this.SPEED = 256;
    }
    Camera.prototype.move = function (delta, dirx, diry) {
        // move camera
        this.x += dirx * this.SPEED * delta;
        this.y += diry * this.SPEED * delta;
        // clamp values
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    };
    return Camera;
}());
var Keyboard = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
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
var Game = /** @class */ (function () {
    function Game() {
        this._previousElapsed = 0;
        this.camera = new Camera(map, 512, 512);
    }
    Game.prototype.run = function (context) {
        var _this = this;
        this.ctx = context;
        this.loadAssetMap('tiles', 'assets/tiles.png');
        this.init();
        window.requestAnimationFrame(function () { return _this.tick(0); });
    };
    Game.prototype.loadAssetMap = function (key, source) {
        var img = new Image();
        img.src = source;
        this.tileAtlas = img;
    };
    Game.prototype.init = function () {
        Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    };
    Game.prototype.tick = function (elapsed) {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.tick(elapsed); });
        // clear previous frame
        this.ctx.clearRect(0, 0, 512, 512);
        var delta = (elapsed - this._previousElapsed) / 1000.0;
        delta = Math.min(delta, 0.25); // maximum delta of 250 ms
        this._previousElapsed = elapsed;
        this.update(delta);
        this.render();
    };
    Game.prototype.update = function (delta) {
        var dirx = 0;
        var diry = 0;
        if (Keyboard.isDown(Keyboard.LEFT)) {
            dirx = -1;
        }
        if (Keyboard.isDown(Keyboard.RIGHT)) {
            dirx = 1;
        }
        if (Keyboard.isDown(Keyboard.UP)) {
            diry = -1;
        }
        if (Keyboard.isDown(Keyboard.DOWN)) {
            diry = 1;
        }
        this.camera.move(delta, dirx, diry);
    };
    Game.prototype.render = function () {
        // draw map background layer
        this._drawLayer(0);
        // draw map top layer
        this._drawLayer(1);
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
                if (tile !== 0) { // 0 => empty tile
                    this.ctx.drawImage(this.tileAtlas, // image
                    (tile - 1) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(x), // target x
                    Math.round(y), // target y
                    map.tsize, // target width
                    map.tsize // target height
                    );
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