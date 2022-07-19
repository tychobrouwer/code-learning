import tileMap from '../assets/tiles.png';

import { map } from './map'
import { keyboard } from './keyboard'

import { Camera } from './camera';
import { Character } from './character';

export class Game {
  ctx: CanvasRenderingContext2D;
  _previousElapsed: number;
  tileAtlas: HTMLImageElement;
  character: Character;
  camera: Camera;
  dirx: number;
  diry: number;
  direction: number;
  animation: number;
  tileX: number;
  tileY: number;

  constructor() {
    this._previousElapsed = 0;
    this.dirx = 0;
    this.diry = 0;
    this.direction = 0;
    this.animation = 0;

    this.character = new Character(map, 200, 200);
    this.camera = new Camera(map, 384, 256);

    this.camera.follow(this.character);
  }

  run(context: CanvasRenderingContext2D) {
    this.ctx = context;

    this.loadAssetMap();
    this.init();

    window.requestAnimationFrame(() => this.tick(0));
  }

  loadAssetMap() {
    const img = new Image();

    img.src = tileMap;
    this.tileAtlas = img;
  }

  init() {
    keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN]);
  }

  tick(elapsed: number) {
    window.requestAnimationFrame(() => this.tick(elapsed));

    this.ctx.clearRect(0, 0, 384, 256);

    // let delta = (elapsed - this._previousElapsed) / 1000.0;
    // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    const delta = 0.01;
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();

    this.findPokemon();

  }

  findPokemon() {
    const tileX = Math.floor(this.character.x / map.tsize);
    const tileY = Math.floor(this.character.y / map.tsize);

    if (tileX !== this.tileX || tileY !== this.tileY) {
      this.tileX = tileX;
      this.tileY = tileY;

      const tile = map.getTile(0, this.tileX, this.tileY);

      if (tile === 2 && Math.random() < 0.05) {
        console.log('Pokemon found!');
      }
    }
  }

  update(delta: number) {
    this.dirx = 0;
    this.diry = 0;

    if (keyboard.isDown(keyboard.LEFT)) { this.dirx = -1; }
    else if (keyboard.isDown(keyboard.RIGHT)) { this.dirx = 1; }
    else if (keyboard.isDown(keyboard.UP)) { this.diry = -1; }
    else if (keyboard.isDown(keyboard.DOWN)) {this. diry = 1; }

    this.character.move(delta, this.dirx, this.diry);
    this.camera.update();
  }

  render() {
    this._drawLayer(0);

    this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
    if (this.diry === 0 && this.dirx === 0) { this.animation = 0; }
    const characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;

    this.animation = this.animation < 87 ? this.animation + 1 : 0;

    this.ctx.drawImage(
      this.character.image,
      characterStart,
      0,
      28,
      40,
      this.character.screenX - this.character.width / 2,
      this.character.screenY - this.character.height / 2,
      28,
      40
    );

    this._drawLayer(1);

    this.ctx.drawImage(
      this.character.image,
      characterStart,
      0,
      28,
      30,
      this.character.screenX - this.character.width / 2,
      this.character.screenY - this.character.height / 2,
      28,
      30
    );
  }

  _drawLayer(layer: number) {
    const startCol = Math.floor(this.camera.x / map.tsize);
    const endCol = startCol + (this.camera.width / map.tsize);
    const startRow = Math.floor(this.camera.y / map.tsize);
    const endRow = startRow + (this.camera.height / map.tsize);
    const offsetX = -this.camera.x + startCol * map.tsize;
    const offsetY = -this.camera.y + startRow * map.tsize;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const tile = map.getTile(layer, c, r);
        
        const x = (c - startCol) * map.tsize + offsetX;
        const y = (r - startRow) * map.tsize + offsetY;

        if (tile !== 0) {
          this.ctx.drawImage(
            this.tileAtlas,
            (tile - 1) % 16 * map.tsize,
            Math.floor((tile - 1) / 16) * map.tsize,
            map.tsize,
            map.tsize,
            Math.round(x),
            Math.round(y),
            map.tsize,
            map.tsize
          );
        }
      }
    }
  }
}
