"use strict";
// import characterMap from '../assets/character.png';
exports.__esModule = true;
exports.Avatar = void 0;
var Avatar = /** @class */ (function () {
    function Avatar(loader, map, x, y) {
        this.SPEED = 64;
        this.AVATAR_WIDTH = 28;
        this.AVATAR_HEIGHT = 40;
        this.screenX = 0;
        this.screenY = 0;
        this.loader = loader;
        this.map = map;
        this.x = x;
        this.y = y;
        this.maxX = this.map.COLS * this.map.TSIZE;
        this.maxY = this.map.ROWS * this.map.TSIZE;
        this.image = this.loader.getImage('avatar');
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
        var left = this.x - this.AVATAR_WIDTH / 2;
        var right = this.x + this.AVATAR_WIDTH / 2 - 1;
        var bottom = this.y + this.AVATAR_HEIGHT / 2 - 1;
        var middleY = (this.y + bottom) / 2;
        var collision = this.map.isSolidTileAtXY(left, this.y, dirx, diry) ||
            this.map.isSolidTileAtXY(right, this.y, dirx, diry) ||
            this.map.isSolidTileAtXY(left, middleY, dirx, diry) ||
            this.map.isSolidTileAtXY(right, middleY, dirx, diry) ||
            this.map.isSolidTileAtXY(right, bottom, dirx, diry) ||
            this.map.isSolidTileAtXY(left, bottom, dirx, diry) ||
            this.map.isSolidTileAtXY(this.x, this.y, dirx, diry) ||
            this.map.isSolidTileAtXY(this.x, bottom, dirx, diry);
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
//# sourceMappingURL=avatar.js.map