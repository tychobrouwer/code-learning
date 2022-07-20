import { MapType } from './types';
import { Avatar } from './avatar';

export class Camera {
  x = 0;
  y = 0;
  width: number;
  height: number;
  maxX: number;
  maxY: number;
  following?: Avatar;

  constructor(map: MapType, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maxX = map.COLS * map.TSIZE - width;
    this.maxY = map.ROWS * map.TSIZE - height;
  }

  follow(sprite: Avatar) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
  }

  update() {
    if (this.following) {
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
    }
  }
}
