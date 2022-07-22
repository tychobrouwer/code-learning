import { MapType } from '../utils/types';
import { Loader } from '../utils/loader';

import { constants } from '../utils/constants';

export class Avatar {
  map: MapType;
  loader: Loader;

  x: number;
  y: number;
  maxX: number;
  maxY: number;
  screenX = 0;
  screenY = 0;
  avatarAsset: HTMLCanvasElement;

  constructor(loader: Loader, map: MapType) {
    this.loader = loader;
    this.map = map;
    this.x = map.X_START;
    this.y = map.Y_START;

    this.maxX = this.map.COLS * constants.MAP_TSIZE;
    this.maxY = this.map.ROWS * constants.MAP_TSIZE;
    this.avatarAsset = this.loader.loadImageToCanvas('avatar', constants.ASSETS_AVATAR_HEIGHT, constants.ASSETS_AVATAR_WIDTH);
  }

  move(delta: number, dirx: number, diry: number): void {
    const x = this.x;
    const y = this.y;

    this.x += dirx * constants.AVATAR_SPEED_WALK * delta;
    this.y += diry * constants.AVATAR_SPEED_WALK * delta;  

    this._collide(dirx, diry, x, y);


    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }

  _collide(dirx: number, diry: number, x: number, y: number): void {
    const left = this.x - constants.AVATAR_WIDTH / 2;
    const right = this.x + constants.AVATAR_WIDTH / 2 - 1;
    const bottom = this.y + constants.AVATAR_HEIGHT / 2 - 1;
    const middleY = (this.y + bottom) / 2;

    const collision =
      this.map.isSolidTileAtXY(left, this.y, dirx, diry) ||
      this.map.isSolidTileAtXY(right, this.y, dirx, diry) ||

      this.map.isSolidTileAtXY(left, middleY, dirx, diry) ||
      this.map.isSolidTileAtXY(right, middleY, dirx, diry) ||

      this.map.isSolidTileAtXY(right, bottom, dirx, diry) ||
      this.map.isSolidTileAtXY(left, bottom, dirx, diry) ||

      this.map.isSolidTileAtXY(this.x, this.y, dirx, diry) ||
      this.map.isSolidTileAtXY(this.x, bottom, dirx, diry);
      if (!collision) { return; }

    if (diry !== 0) {
      this.y = y;
    } else if (dirx !== 0) {
      this.x = x;
    }
  }
}
