import { Loader } from '../utils/loader';
import { Map } from './map';

import { constants } from '../utils/constants';

export class Avatar {
  private loader: Loader;

  private map: Map;

  public x = 0;
  public y = 0;
  public screenX = 0;
  public screenY = 0;
  public avatarAsset: HTMLCanvasElement;

  constructor(loader: Loader, map: Map) {  
    this.loader = loader;
    this.avatarAsset = this.loader.loadImageToCanvas('avatar', constants.ASSETS_AVATAR_HEIGHT, constants.ASSETS_AVATAR_WIDTH);

    this.map = map;
  }

  loadMapUpdate(map: Map, x: number, y: number) {
    this.map = map;

    this.x = x;
    this.y = y;
  }

  newAreaMapUpdate(map: Map, addedTiles: number[]) {
    this.map = map;

    this.x = this.x + addedTiles[0] * constants.MAP_TSIZE;
    this.y = this.y + addedTiles[1] * constants.MAP_TSIZE;
  }

  move(delta: number, dirx: number, diry: number): void {
    if (this.map) {
      const x = this.x;
      const y = this.y;

      this.x += dirx * constants.AVATAR_SPEED_WALK * delta;
      this.y += diry * constants.AVATAR_SPEED_WALK * delta;  

      this._collide(dirx, diry, x, y);

      const maxX = this.map.currentMap.COLS * constants.MAP_TSIZE;
      const maxY = this.map.currentMap.ROWS * constants.MAP_TSIZE;

      this.x = Math.max(0, Math.min(this.x, maxX));
      this.y = Math.max(0, Math.min(this.y, maxY));
    }
  }

  _collide(dirx: number, diry: number, x: number, y: number): void {
    if (this.map) {
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
}
