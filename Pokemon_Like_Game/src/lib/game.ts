import tileMap from '../assets/tiles.png';

import { map } from './map'
import { keyboard } from './keyboard'

import { Camera } from './camera';
import { Avatar } from './avatar';
import { Pokemon } from './pokemon';

export class Game {
  ctx: CanvasRenderingContext2D | undefined;
  _previousElapsed = 0;
  tileAtlas: HTMLImageElement | undefined;
  avatar: Avatar;
  camera: Camera;
  dirx = 0;
  diry = 0;
  direction = 0;
  animation = 0;
  tileX = 0;
  tileY = 0;

  constructor() {
    this.avatar = new Avatar(map, 200, 200);
    this.camera = new Camera(map, 384, 256);

    this.camera.follow(this.avatar);
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
    
    this.ctx?.clearRect(0, 0, 384, 256);

    // let delta = (elapsed - this._previousElapsed) / 1000.0;
    // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    const delta = 0.01;
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();

    this.findPokemon();

  }

  findPokemon() {
    const tileX = Math.floor(this.avatar.x / map.tsize);
    const tileY = Math.floor(this.avatar.y / map.tsize);

    if (tileX !== this.tileX || tileY !== this.tileY) {
      this.tileX = tileX;
      this.tileY = tileY;

      const tile = map.getTile(0, this.tileX, this.tileY);

      if (tile === 2 && Math.random() < 0.5) {
        const foundPokemon = new Pokemon(1, 'grassland');
        const pokemon = foundPokemon.getPokemon();

        console.log(pokemon.name + ' found!');
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

    this.avatar.move(delta, this.dirx, this.diry);
    this.camera.update();
  }

  render() {
    this._drawLayer(0);

    this._drawPlayer(false);

    this._drawLayer(1);

    this._drawPlayer(true);
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

        if (tile !== 0 && this.tileAtlas) {
          this.ctx?.drawImage(
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

  _drawPlayer(onlyDrawTop: boolean) {
    if (!onlyDrawTop) {
      this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
      if (this.diry === 0 && this.dirx === 0) { this.animation = 0; }

      this.animation = this.animation < 87 ? this.animation + 1 : 0;
    }

    const pixelHeight = onlyDrawTop ? 30 : 40;
    const characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;

    this.ctx?.drawImage(
      this.avatar.image,
      characterStart,
      0,
      28,
      pixelHeight,
      this.avatar.screenX - this.avatar.width / 2,
      this.avatar.screenY - this.avatar.height / 2,
      28,
      pixelHeight
    );
  }
}
