"use strict";
exports.__esModule = true;
exports.Avatar = void 0;
var character_png_1 = require("../assets/character.png");
var Avatar = /** @class */ (function () {
    function Avatar(map, x, y) {
        this.width = 28;
        this.height = 40;
        this.SPEED = 64;
        this.screenX = 0;
        this.screenY = 0;
        this.map = map;
        this.x = x;
        this.y = y;
        this.maxX = this.map.cols * this.map.tsize;
        this.maxY = this.map.rows * this.map.tsize;
        this.image = new Image();
        this.image.src = character_png_1["default"];
    }
    Avatar.prototype.move = function (delta, dirx, diry) {
        var x = this.x;
        var y = this.y;
        this.x += dirx * this.SPEED * delta;
        this.y += diry * this.SPEED * delta;
        this._collide(dirx, diry, x, y);
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    };
    Avatar.prototype._collide = function (dirx, diry, x, y) {
        var left = this.x - this.width / 2;
        var right = this.x + this.width / 2 - 1;
        var top = this.y - this.height / 2;
        var bottom = this.y + this.height / 2 - 1;
        var collision = this.map.isSolidTileAtXY(left, top, dirx, diry) ||
            this.map.isSolidTileAtXY(right, top, dirx, diry) ||
            this.map.isSolidTileAtXY(right, bottom, dirx, diry) ||
            this.map.isSolidTileAtXY(left, bottom, dirx, diry);
        if (!collision) {
            return;
        }
        if (diry !== 0) {
            this.y = y;
        }
        else if (dirx !== 0) {
            this.x = x;
        }
    };
    return Avatar;
}());
exports.Avatar = Avatar;
//# sourceMappingURL=character.js.map