// import characterMap from '../assets/character.png';

import { MapType } from './types';
import { Loader } from './loader' 

export class Avatar {
  SPEED = 128;
  AVATAR_HEIGHT = 40;
  AVATAR_WIDTH = 28;
  ASSETS_AVATAR_HEIGHT = 256;
  ASSETS_AVATAR_WIDTH = 512;

  map: MapType;
  loader: Loader;

  x: number;
  y: number;
  maxX: number;
  maxY: number;
  screenX = 0;
  screenY = 0;
  avatarAsset: HTMLCanvasElement;

  constructor(loader: Loader, map: MapType, startX: number, startY: number) {
    this.loader = loader;
    this.map = map;
    this.x = startX;
    this.y = startY;

    this.maxX = this.map.COLS * this.map.TSIZE;
    this.maxY = this.map.ROWS * this.map.TSIZE;
    this.avatarAsset = this.loader.loadImageToCanvas('avatar', this.ASSETS_AVATAR_HEIGHT, this.ASSETS_AVATAR_WIDTH);
  }

  move(delta: number, dirx: number, diry: number) {
    const x = this.x;
    const y = this.y;

    this.x += dirx * this.SPEED * delta;
    this.y += diry * this.SPEED * delta;  

    this._collide(dirx, diry, x, y);


    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }

  _collide(dirx: number, diry: number, x: number, y: number): void {
    const left = this.x - this.AVATAR_WIDTH / 2;
    const right = this.x + this.AVATAR_WIDTH / 2 - 1;
    const bottom = this.y + this.AVATAR_HEIGHT / 2 - 1;
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
