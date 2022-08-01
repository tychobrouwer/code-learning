import { Avatar } from './avatar';

import { MapType } from '../utils/types';

import { constants } from '../utils/constants';

export class Camera {
  public x = 0;
  public y = 0;
  public width: number;
  public height: number;
  private maxX: number;
  private maxY: number;
  private following?: Avatar;

  constructor(map: MapType, width: number, height: number) {
    this.width = width;
    this.height = height;

    this.maxX = map.COLS * constants.MAP_TSIZE - width;
    this.maxY = map.ROWS * constants.MAP_TSIZE - height;
  }

  updateMap(currentMap: MapType) {
    this.maxX = currentMap.COLS * constants.MAP_TSIZE - this.width;
    this.maxY = currentMap.ROWS * constants.MAP_TSIZE - this.height;
  }

  follow(sprite: Avatar): void {
    this.following = sprite;
  }

  update(): void {
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
