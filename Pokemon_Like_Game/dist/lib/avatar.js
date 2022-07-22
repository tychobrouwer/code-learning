"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const constants_1 = require("../utils/constants");
class Avatar {
    constructor(loader, map) {
        this.screenX = 0;
        this.screenY = 0;
        this.loader = loader;
        this.map = map;
        this.x = map.X_START;
        this.y = map.Y_START;
        this.maxX = this.map.COLS * constants_1.constants.MAP_TSIZE;
        this.maxY = this.map.ROWS * constants_1.constants.MAP_TSIZE;
        this.avatarAsset = this.loader.loadImageToCanvas('avatar', constants_1.constants.ASSETS_AVATAR_HEIGHT, constants_1.constants.ASSETS_AVATAR_WIDTH);
    }
    move(delta, dirx, diry) {
        const x = this.x;
        const y = this.y;
        this.x += dirx * constants_1.constants.AVATAR_SPEED * delta;
        this.y += diry * constants_1.constants.AVATAR_SPEED * delta;
        this._collide(dirx, diry, x, y);
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    }
    _collide(dirx, diry, x, y) {
        const left = this.x - constants_1.constants.AVATAR_WIDTH / 2;
        const right = this.x + constants_1.constants.AVATAR_WIDTH / 2 - 1;
        const bottom = this.y + constants_1.constants.AVATAR_HEIGHT / 2 - 1;
        const middleY = (this.y + bottom) / 2;
        const collision = this.map.isSolidTileAtXY(left, this.y, dirx, diry) ||
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
    }
}
exports.Avatar = Avatar;
//# sourceMappingURL=avatar.js.map