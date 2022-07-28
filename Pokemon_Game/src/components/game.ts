import tileMap from '../assets/tiles.png';
import avatarAssets from '../assets/character.png';
import battleAssets from '../assets/battle_assets.png';
import pokemonGeneration1 from '../assets/pokemon_1st_generation.png';
import pokemonGeneration2 from '../assets/pokemon_2st_generation.png';
import pokemonGeneration3 from '../assets/pokemon_3st_generation.png';
import font from '../assets/font.png';

import { Player } from './player';
import { Map } from './map';
import { Loader } from '../utils/loader';
import { Camera } from './camera';
import { Avatar } from './avatar';
import { PokemonBattle } from './pokemon';

import { constants } from '../utils/constants';
import { keyboard } from '../utils/keyboard';
import { randomFromMinMax } from '../utils/helper';


import { addMapReturnType, PlayerDataType } from '../utils/types';

export class Game {
  player: Player;
  loader: Loader;
  map!: Map;
  avatar!: Avatar;
  camera!: Camera;

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
  currentMap = 'littleroot town';
  GAME_HEIGHT: number;
  GAME_WIDTH: number;

  constructor(gameCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    this.loader = new Loader();
    this.player = new Player();

    this.GAME_HEIGHT = constants.GAME_HEIGHT;
    this.GAME_WIDTH = constants.GAME_WIDTH;
    this.gameCtx = gameCtx;
    this.overlayCtx = overlayCtx;

    let playerData: PlayerDataType = this.player.getPlayerData('playerData');

    if (!playerData.location) {
      playerData = this.player.createNewPlayer(true);
    }
    
    this.currentMap = playerData.location;

    const p = this.load();

    Promise.all(p).then(() => {
      this.init();

      this.map = new Map({...constants.MAPS[playerData.location]});
      this.avatar = new Avatar(this.loader, this.map);
      this.camera = new Camera({...constants.MAPS[playerData.location]}, constants.GAME_WIDTH, constants.GAME_HEIGHT);
      this.camera.follow(this.avatar);

      this.map.updateMap(this.currentMap)
      this.loadAdjacentMaps(true);
      this.avatar.loadMapUpdate(this.map, playerData.position.x, playerData.position.y);

      setInterval(() => this.updatePlayerDataLoop(), 1000);

      window.requestAnimationFrame(this.tick.bind(this));
    });
  }

  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadImage('tiles', tileMap),
      this.loader.loadImage('avatar', avatarAssets),
      this.loader.loadImage('battleAssets', battleAssets),
      this.loader.loadImage('pokemonGeneration1', pokemonGeneration1),
      this.loader.loadImage('pokemonGeneration2', pokemonGeneration2),
      this.loader.loadImage('pokemonGeneration3', pokemonGeneration3),
      this.loader.loadImage('font', font),
    ];
  }

  init(): void {
    keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN, keyboard.ENTER]);

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

  updatePlayerDataLoop() {
    if (this.avatar) {
      const playerData = {
        location: this.currentMap,
        position: {
          x: this.avatar.x,
          y: this.avatar.y,
        },
        pokemon: {}
      };
  
      this.player.setPlayerData('playerData', playerData);
    }
  }

  async findPokemon(): Promise<void> {
    const currentTileX = Math.floor(this.avatar.x / constants.MAP_TSIZE);
    const currentTileY = Math.floor(this.avatar.y / constants.MAP_TSIZE);

    if (currentTileX !== this.currentTileX || currentTileY !== this.currentTileY) {
      this.currentTileX = currentTileX;
      this.currentTileY = currentTileY;

      const tile = this.map.getTile(0, this.currentTileX, this.currentTileY);
      const randomNumber = randomFromMinMax(0, 2879);

      if (tile === 2 && randomNumber < constants.GRASS_ENCOUNTER_NUMBER) {
        const pokemonBattle = new PokemonBattle(this.overlayCtx, this.loader, this.currentMap, 0);
        const pokemon = pokemonBattle.getPokemon();

        console.log(pokemon.name + ' found!');

        const battleResult = await pokemonBattle.battle();
        
        if (battleResult) {
          console.log('battle with ' + pokemon.name + ' won!')
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
    else if (keyboard.isDown(keyboard.DOWN)) {this.diry = 1; }

    const isNextMap = this.map.isNextMap(this.avatar.x, this.avatar.y);

    if (typeof isNextMap !== 'boolean') {      
      this.currentMap = isNextMap[0];
      console.log('Entered new area: ' + this.currentMap);
      
      this.map.updateMap(this.currentMap)
      const addedTiles = this.loadAdjacentMaps(isNextMap[1]);

      if (addedTiles) {
        this.avatar.newAreaMapUpdate(this.map, addedTiles);
      }
    }

    this.avatar.move(delta, this.dirx, this.diry);
    this.camera.update();
  }

  loadAdjacentMaps(fromDirection: string | boolean = false) {
    const Adjacent = this.map.getAjacent(this.currentMap);
    let updatedData: addMapReturnType | undefined;
    const addedAreas = Adjacent.map(a => a.position)

    for (const adjacentMap of Object.values(Adjacent)) {
      updatedData = this.map.addMap(adjacentMap.name, adjacentMap.position, 0);
    }

    if (updatedData) { 
      this.camera.updateMap(updatedData.currentMap);
      const addedTiles = [ 0, 0 ];
      
      // THIS SHOULD MAYBE BE UPDATED!!
      if (addedAreas.includes('top') && addedAreas.includes('bottom') && fromDirection === 'top') {
        addedTiles[1] = updatedData.diff[1];
        // console.log('first')
      } else if (addedAreas.includes('top') && !addedAreas.includes('bottom') && fromDirection === 'bottom') {
        addedTiles[1] = updatedData.diff[1];
        // console.log('second')
      }
      
      if (addedAreas.includes('left') && addedAreas.includes('bottom') && fromDirection === 'top') {
        addedTiles[0] = updatedData.diff[0];
        // console.log('third')
      } else if (addedAreas.includes('bottom') && addedAreas.includes('top') && fromDirection === 'bottom') {
        addedTiles[0] = updatedData.diff[0];
        // console.log('fourth')
      }
      // /////////////////////////// //

      return addedTiles;
    }
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
        const tile = this.map.getTile(layer, c, r);
        if (tile === -1) break; 
        const x = (c - startCol) * constants.MAP_TSIZE + offsetX;
        const y = (r - startRow) * constants.MAP_TSIZE + offsetY;

        if (tile !== 0 && this.tileAtlas) {
          this.gameCtx.drawImage(
            this.tileAtlas,
            (tile - 1) % 16 * constants.MAP_TSIZE,
            Math.floor((tile - 1) / 16) * constants.MAP_TSIZE,
            constants.MAP_TSIZE,
            constants.MAP_TSIZE,
            Math.round(x),
            Math.round(y),
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
        this.animation = this.animation < 3.96 ? this.animation + 0.04 : 0;
      }
    }

    const pixelHeight = onlyDrawTop ? 0.75 * constants.AVATAR_HEIGHT : constants.AVATAR_HEIGHT;
    const characterStart = this.direction * constants.AVATAR_WIDTH * 4 + (this.animation << 0) * constants.AVATAR_WIDTH;

    if (this.avatar.avatarAsset) {
      this.gameCtx.drawImage(
        this.avatar.avatarAsset,
        characterStart,
        0,
        constants.AVATAR_WIDTH,
        pixelHeight,
        (0.5 + this.avatar.screenX - constants.AVATAR_WIDTH / 2) << 0,
        (0.5 + this.avatar.screenY - constants.AVATAR_HEIGHT / 2 + (((1 < this.animation && this.animation < 2) || (3 < this.animation && this.animation < 4)) ? 1 : 0)) << 0,
        constants.AVATAR_WIDTH,
        pixelHeight
      );
    }
  }
}
