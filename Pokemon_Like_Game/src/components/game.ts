import tileMap from '../assets/tiles.png';
import characterAssets from '../assets/character.png';
import battleAssets from '../assets/battle_assets.png';
import pokemonGeneration1 from '../assets/pokemon_1st_generation.png';
import pokemonGeneration2 from '../assets/pokemon_2st_generation.png';
import pokemonGeneration3 from '../assets/pokemon_3st_generation.png';
import font from '../assets/font.png';

import { constants } from '../utils/constants';
import { map } from './map';
import { keyboard } from '../utils/keyboard';

import { Loader } from '../utils/loader';
import { Camera } from './camera';
import { Avatar } from './avatar';
import { PokemonBattle } from './pokemon';

export class Game {
  loader: Loader;
  avatar!: Avatar;
  camera!: Camera;

  // tileAtlas = document.createElement('canvas');
  tileAtlas!: HTMLCanvasElement;
  gameCtx: CanvasRenderingContext2D;
  overlayCtx: CanvasRenderingContext2D;
  _previousElapsed = 0;
  dirx = 0;
  diry = 0;
  direction = 0;
  animation = 0;
  currentTileX = 0;
  currentTileY = 0;
  GAME_HEIGHT: number;
  GAME_WIDTH: number;

  constructor(gameCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    this.loader = new Loader();

    this.GAME_HEIGHT = constants.GAME_HEIGHT;
    this.GAME_WIDTH = constants.GAME_WIDTH;
    this.gameCtx = gameCtx;
    this.overlayCtx = overlayCtx;

    const p = this.load();

    Promise.all(p).then(() => {
      this.init();

      this.avatar = new Avatar(this.loader, map);
      this.camera = new Camera(map, constants.GAME_WIDTH, constants.GAME_HEIGHT);
  
      this.camera.follow(this.avatar);
  
      window.requestAnimationFrame(this.tick.bind(this));
    });
  }

  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadImage('tiles', tileMap),
      this.loader.loadImage('avatar', characterAssets),
      this.loader.loadImage('battleAssets', battleAssets),
      this.loader.loadImage('pokemonGeneration1', pokemonGeneration1),
      this.loader.loadImage('pokemonGeneration2', pokemonGeneration2),
      this.loader.loadImage('pokemonGeneration3', pokemonGeneration3),
      this.loader.loadImage('font', font),
    ];
  }

  init(): void {
    keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN]);

    this.tileAtlas = this.loader.loadImageToCanvas('tiles', constants.ASSETS_TILES_HEIGHT, constants.ASSETS_TILES_WIDTH);
  }

  async tick(elapsed: number) {
    this.gameCtx.clearRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);

    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms

    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();

    await this.findPokemon();
    
    window.requestAnimationFrame(this.tick.bind(this));
  }

  async findPokemon(): Promise<void> {
    const currentTileX = Math.floor(this.avatar.x / constants.MAP_TSIZE);
    const currentTileY = Math.floor(this.avatar.y / constants.MAP_TSIZE);

    if (currentTileX !== this.currentTileX || currentTileY !== this.currentTileY) {
      this.currentTileX = currentTileX;
      this.currentTileY = currentTileY;

      const tile = map.getTile(0, this.currentTileX, this.currentTileY);

      if (tile === 2 && Math.random() < 0.5) {
        const pokemonBattle = new PokemonBattle(this.overlayCtx, this.loader, 0, 0);
        const pokemon = pokemonBattle.getPokemon();

        console.log(pokemon.name + ' found!');

        const battleResult = await pokemonBattle.battle();
        
        if (battleResult) {
          console.log('battle won!')
          // this.player.addPokemon(foundPokemon);
        }
      }
    }
  }

  update(delta: number): void {
    this.dirx = 0;
    this.diry = 0;

    if (keyboard.isDown(keyboard.LEFT)) { this.dirx = -1; }
    else if (keyboard.isDown(keyboard.RIGHT)) { this.dirx = 1; }
    else if (keyboard.isDown(keyboard.UP)) { this.diry = -1; }
    else if (keyboard.isDown(keyboard.DOWN)) {this. diry = 1; }

    this.avatar.move(delta, this.dirx, this.diry);
    this.camera.update();
  }

  render(): void {
    this.drawLayer(0);

    this.drawPlayer(false);

    this.drawLayer(1);

    this.drawPlayer(true);
  }

  drawLayer(layer: number): void {
    const startCol = Math.floor(this.camera.x / constants.MAP_TSIZE);
    const endCol = startCol + (this.camera.width / constants.MAP_TSIZE);
    const startRow = Math.floor(this.camera.y / constants.MAP_TSIZE);
    const endRow = startRow + (this.camera.height / constants.MAP_TSIZE);
    const offsetX = -this.camera.x + startCol * constants.MAP_TSIZE;
    const offsetY = -this.camera.y + startRow * constants.MAP_TSIZE;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const tile = map.getTile(layer, c, r);        
        const x = (0.5 + (c - startCol) * constants.MAP_TSIZE + offsetX) << 0;
        const y = (0.5 + (r - startRow) * constants.MAP_TSIZE + offsetY) << 0;

        if (tile !== 0 && this.tileAtlas) {
          this.gameCtx.drawImage(
            this.tileAtlas,
            (tile - 1) % 16 * constants.MAP_TSIZE,
            Math.floor((tile - 1) / 16) * constants.MAP_TSIZE,
            constants.MAP_TSIZE,
            constants.MAP_TSIZE,
            x,
            y,
            constants.MAP_TSIZE,
            constants.MAP_TSIZE
          );
        }
      }
    }
  }

  drawPlayer(onlyDrawTop: boolean): void {
    if (!onlyDrawTop) {
      this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
      if (this.diry === 0 && this.dirx === 0) {
        this.animation = 0;
      } else {
        this.animation = this.animation < 2.925 ? this.animation + 0.075 : 0;
      }
    }

    const pixelHeight = onlyDrawTop ? 0.75 * constants.AVATAR_HEIGHT : constants.AVATAR_HEIGHT;
    const characterStart = this.direction * constants.AVATAR_WIDTH * 3 + (this.animation << 0) * constants.AVATAR_WIDTH;

    if (this.avatar.avatarAsset) {
      this.gameCtx.drawImage(
        this.avatar.avatarAsset,
        characterStart,
        0,
        constants.AVATAR_WIDTH,
        pixelHeight,
        (0.5 + this.avatar.screenX - constants.AVATAR_WIDTH / 2) << 0,
        (0.5 + this.avatar.screenY - constants.AVATAR_HEIGHT / 2) << 0,
        constants.AVATAR_WIDTH,
        pixelHeight
      );
    }
  }
}
