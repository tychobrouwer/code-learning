import characterMap from '../assets/character.png';
import { MapType } from './types';

export class Avatar {
  map: MapType;
  x: number;
  y: number;
  width = 28;
  height = 40;
  maxX: number;
  maxY: number;
  SPEED = 64;
  screenX = 0;
  screenY = 0;
  image: HTMLImageElement;

  constructor(map: MapType, x: number, y: number) {
    this.map = map;
    this.x = x;
    this.y = y;

    this.maxX = this.map.cols * this.map.tsize;
    this.maxY = this.map.rows * this.map.tsize;


    this.image = new Image();
    this.image.src = characterMap;
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
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    const collision =
      this.map.isSolidTileAtXY(left, top, dirx, diry) ||
      this.map.isSolidTileAtXY(right, top, dirx, diry) ||
      this.map.isSolidTileAtXY(right, bottom, dirx, diry) ||
      this.map.isSolidTileAtXY(left, bottom, dirx, diry);
    if (!collision) { return; }

    if (diry !== 0) {
      this.y = y;
    } else if (dirx !== 0) {
      this.x = x;
    }
  }
}
