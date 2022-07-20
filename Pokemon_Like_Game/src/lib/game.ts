import tileMap from '../assets/tiles.png';
import characterMap from '../assets/character.png';
import battleAssets from '../assets/battle_assets.png';
import pokemonGeneration1 from '../assets/pokemon_1st_generation.png'
import font from '../assets/font.png';

import { map } from './map'
import { keyboard } from './keyboard'

import { Loader } from './loader' 
import { Camera } from './camera';
import { Avatar } from './avatar';
import { PokemonBattle } from './pokemon';

export class Game {
  GAME_HEIGHT = 320;
  GAME_WIDTH = 480;

  avatar!: Avatar;
  camera!: Camera;
  loader: Loader;

  tileAtlas?: HTMLImageElement;
  ctx!: CanvasRenderingContext2D;
  _previousElapsed = 0;
  dirx = 0;
  diry = 0;
  direction = 0;
  animation = 0;
  tileX = 0;
  tileY = 0;

  constructor(context: CanvasRenderingContext2D) {
    this.loader = new Loader();

    const p = this.load();

    Promise.all(p).then(() => {
      this.init();

      this.avatar = new Avatar(this.loader, map, 200, 200);
      this.camera = new Camera(map, this.GAME_WIDTH, this.GAME_HEIGHT);
  
      this.ctx = context;
      this.camera.follow(this.avatar);
  
      window.requestAnimationFrame(() => this.tick(0));
    });
  }

  load() {
    return [
      this.loader.loadImage('tiles', tileMap),
      this.loader.loadImage('avatar', characterMap),
      this.loader.loadImage('battleAssets', battleAssets),
      this.loader.loadImage('pokemonGeneration1', pokemonGeneration1),
      this.loader.loadImage('font', font),
    ];
  }

  init() {
    keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN]);

    this.tileAtlas = this.loader.getImage('tiles');
  }

  async tick(elapsed: number) {
    this.ctx?.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

    // let delta = (elapsed - this._previousElapsed) / 1000.0;
    // delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    const delta = 0.01;
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();

    await this.findPokemon();
    
    window.requestAnimationFrame(() => this.tick(elapsed));
  }

  async findPokemon() {
    const tileX = Math.floor(this.avatar.x / map.TSIZE);
    const tileY = Math.floor(this.avatar.y / map.TSIZE);

    if (tileX !== this.tileX || tileY !== this.tileY) {
      this.tileX = tileX;
      this.tileY = tileY;

      const tile = map.getTile(0, this.tileX, this.tileY);

      if (tile === 2 && Math.random() < 0.1) {
        const pokemonBattle = new PokemonBattle(this.ctx, this.loader, this.GAME_WIDTH, this.GAME_HEIGHT, 0, 0);
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
    this.drawLayer(0);

    this.drawPlayer(false);

    this.drawLayer(1);

    this.drawPlayer(true);
  }

  drawLayer(layer: number) {
    const startCol = Math.floor(this.camera.x / map.TSIZE);
    const endCol = startCol + (this.camera.width / map.TSIZE);
    const startRow = Math.floor(this.camera.y / map.TSIZE);
    const endRow = startRow + (this.camera.height / map.TSIZE);
    const offsetX = -this.camera.x + startCol * map.TSIZE;
    const offsetY = -this.camera.y + startRow * map.TSIZE;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const tile = map.getTile(layer, c, r);
        
        const x = (c - startCol) * map.TSIZE + offsetX;
        const y = (r - startRow) * map.TSIZE + offsetY;

        if (tile !== 0 && this.tileAtlas) {
          this.ctx.drawImage(
            this.tileAtlas,
            (tile - 1) % 16 * map.TSIZE,
            Math.floor((tile - 1) / 16) * map.TSIZE,
            map.TSIZE,
            map.TSIZE,
            Math.round(x),
            Math.round(y),
            map.TSIZE,
            map.TSIZE
          );
        }
      }
    }
  }

  drawPlayer(onlyDrawTop: boolean) {
    if (!onlyDrawTop) {
      this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
      if (this.diry === 0 && this.dirx === 0) { this.animation = 0; }

      this.animation = this.animation < 87 ? this.animation + 1 : 0;
    }

    const pixelHeight = onlyDrawTop ? 30 : 40;
    const characterStart = this.direction * 84 + Math.floor(this.animation / 30) * 28;

    if (this.avatar.image) {
      this.ctx.drawImage(
        this.avatar.image,
        characterStart,
        0,
        28,
        pixelHeight,
        this.avatar.screenX - this.avatar.AVATAR_WIDTH / 2,
        this.avatar.screenY - this.avatar.AVATAR_HEIGHT / 2,
        28,
        pixelHeight
      );
    }
  }
}
