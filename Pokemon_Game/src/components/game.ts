import tileMap from '../assets/tiles.png';
import avatarAssets from '../assets/character.png';
import battleAssets from '../assets/battle_assets.png';
import starterAssets from '../assets/choose_starter.png';
import pokemonGeneration1 from '../assets/pokemon_1st_generation.png';
import pokemonGeneration2 from '../assets/pokemon_2st_generation.png';
import pokemonGeneration3 from '../assets/pokemon_3st_generation.png';
import font from '../assets/font.png';
import buildingAtlas from '../assets/building_assets.png';

import { Player } from './player';
import { Map } from './map';
import { Loader } from '../utils/loader';
import { Camera } from './camera';
import { Avatar } from './avatar';
import { PokemonBattle } from './pokemon';

import { constants } from '../utils/constants';
import { keyboard } from '../utils/keyboard';
import { randomFromMinMax, setLocalStorage, drawText } from '../utils/helper';


import { AddMapReturnType, PlayerDataType } from '../utils/types';

export class Game {
  private player = new Player();
  private loader = new Loader();
  private map!: Map;
  private avatar!: Avatar;
  private camera!: Camera;

  private tileAtlas!: HTMLCanvasElement;
  private starterAtlas!: HTMLCanvasElement;
  private font!: HTMLCanvasElement;
  private buildingAtlas!: HTMLCanvasElement;

  private gameCtx: CanvasRenderingContext2D;
  private overlayCtx: CanvasRenderingContext2D;
  public static GAME_WIDTH = constants.GAME_WIDTH;
  public static GAME_HEIGHT = constants.GAME_HEIGHT;

  private _previousElapsed = 0;
  private dirx = 0;
  private diry = 0;
  private direction = 0;
  private animation = 0;
  private currentTileX = 0;
  private currentTileY = 0;
  private currentMap: string;
  private gameTriggers: {[trigger: string]: boolean};
  private gameStatus = 'game';

  private selectedStarter = 1;
  private keyDown = false;

  constructor(gameCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) {
    this.gameCtx = gameCtx;
    this.overlayCtx = overlayCtx;

    let playerData: PlayerDataType = this.player.getStoredPlayerData('playerData');
    let gameTriggers: {[trigger: string]: boolean} = this.player.getStoredPlayerData('gameTriggers');

    if (!playerData.location) {
      playerData = this.player.createNewPlayer(true);
    }

    if (!gameTriggers.chooseStarter) {
      gameTriggers = {
        chooseStarter: false,
      }
    }
    
    this.currentMap = playerData.location;
    this.gameTriggers = gameTriggers;

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

      setInterval(() => this.updateSaveDataLoop(), 1000);

      window.requestAnimationFrame(this.tick.bind(this));
    });
  }

  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadImage('tiles', tileMap),
      this.loader.loadImage('avatar', avatarAssets),
      this.loader.loadImage('battleAssets', battleAssets),
      this.loader.loadImage('starterAssets', starterAssets),
      this.loader.loadImage('pokemonGeneration1', pokemonGeneration1),
      this.loader.loadImage('pokemonGeneration2', pokemonGeneration2),
      this.loader.loadImage('pokemonGeneration3', pokemonGeneration3),
      this.loader.loadImage('font', font),
      this.loader.loadImage('buildingAtlas', buildingAtlas),
    ];
  }

  init(): void {
    keyboard.listenForEvents([keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN, keyboard.ENTER]);

    this.tileAtlas = this.loader.loadImageToCanvas('tiles', constants.ASSETS_TILES_HEIGHT, constants.ASSETS_TILES_WIDTH);
    this.starterAtlas = this.loader.loadImageToCanvas('starterAssets', constants.ASSETS_STARTER_HEIGHT, constants.ASSETS_STARTER_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', constants.ASSETS_FONT_HEIGHT, constants.ASSETS_FONT_WIDTH);
    this.buildingAtlas = this.loader.loadImageToCanvas('buildingAtlas', constants.ASSETS_BUILDING_TILES_HEIGHT, constants.ASSETS_BUILDING_TILES_WIDTH);
  }

  async tick(elapsed: number) {
    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms

    this._previousElapsed = elapsed;

    if (this.gameStatus === 'chooseStarter') {

      this.chooseStarter(delta);
    } else {
      this.overlayCtx.clearRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);
      this.gameCtx.clearRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);

      this.update(delta);
      this.render(delta);
  
      await this.findPokemon();
    }
    
    window.requestAnimationFrame(this.tick.bind(this));
  }

  updateSaveDataLoop() {
    if (this.avatar) {
      this.player.setPlayerPosition(this.currentMap, this.avatar.x, this.avatar.y);
      const playerData = this.player.getPlayerData();
  
      setLocalStorage('playerData', playerData);
      setLocalStorage('gameTriggers', this.gameTriggers);
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
        const pokemonBattle = new PokemonBattle(this.overlayCtx, this.loader, this.player, this.currentMap, 0);

        const battleResult = await pokemonBattle.battle();
        
        if (battleResult) {
          console.log('battle with ' + battleResult.pokemon.pokemonName + ' won!')
          // this.player.addPokemon(foundPokemon);
        }
      }
    }
  }

  chooseStarter(delta: number) {
    this.animation = this.animation < 9.94 ? this.animation + 10 * delta : 0;

    let pokeballSource0 = 110;
    let pokeballSource1 = 110;
    let pokeballSource2 = 110;

    if (this.animation < 4) {
      pokeballSource0 = (this.selectedStarter === 0) ? 110 + (this.animation << 0) * 23 : 110;
      pokeballSource1 = (this.selectedStarter === 1) ? 110 + (this.animation << 0) * 23 : 110;
      pokeballSource2 = (this.selectedStarter === 2) ? 110 + (this.animation << 0) * 23 : 110;  
    }

    const handXcoor = (this.selectedStarter === 0) ? 48 : (this.selectedStarter === 1) ? 108 : 169;
    const handYcoor = (this.selectedStarter === 1) ? 33 : 9;

    this.overlayCtx.drawImage(
      this.starterAtlas,
      0,
      0,
      constants.GAME_WIDTH,
      constants.GAME_HEIGHT,
      0,
      0,
      constants.GAME_WIDTH,
      constants.GAME_HEIGHT,
    );

    this.overlayCtx.drawImage(
      this.starterAtlas,
      0,
      160,
      110,
      64,
      65,
      8,
      110,
      64,
    );

    this.overlayCtx.drawImage(
      this.starterAtlas,
      pokeballSource0,
      160,
      23,
      20,
      50,
      54,
      23,
      20,
    );

    this.overlayCtx.drawImage(
      this.starterAtlas,
      pokeballSource1,
      160,
      23,
      20,
      110,
      78,
      23,
      20,
    );

    this.overlayCtx.drawImage(
      this.starterAtlas,
      pokeballSource2,
      160,
      23,
      20,
      170,
      54,
      23,
      20,
    );

    this.overlayCtx.drawImage(
      this.starterAtlas,
      202,
      160,
      25,
      27,
      handXcoor,
      handYcoor,
      25,
      27,
    );

    if (this.selectedStarter === 0) {
      this.overlayCtx.globalAlpha = 0.4;
      this.overlayCtx.beginPath();
      this.overlayCtx.rect(0, 72, 108, 32);
      this.overlayCtx.fill();
      this.overlayCtx.globalAlpha = 1;

      this.overlayCtx.drawImage(
        this.starterAtlas,
        0,
        224,
        86,
        10,
        6,
        76,
        86,
        10,
      );

      this.overlayCtx.drawImage(
        this.starterAtlas,
        0,
        234,
        42,
        10,
        31,
        92,
        42,
        10,
      );
    } else if (this.selectedStarter === 1) {
      this.overlayCtx.globalAlpha = 0.4;
      this.overlayCtx.beginPath();
      this.overlayCtx.rect(132, 80, 104, 32);
      this.overlayCtx.fill();
      this.overlayCtx.globalAlpha = 1;

      this.overlayCtx.drawImage(
        this.starterAtlas,
        86,
        224,
        62,
        10,
        140,
        82,
        62,
        10,
      );

      this.overlayCtx.drawImage(
        this.starterAtlas,
        86,
        234,
        42,
        10,
        186,
        98,
        42,
        10,
      );
    } else {
      this.overlayCtx.globalAlpha = 0.4;
      this.overlayCtx.beginPath();
      this.overlayCtx.rect(60, 32, 112, 32);
      this.overlayCtx.fill();
      this.overlayCtx.globalAlpha = 1;

      this.overlayCtx.drawImage(
        this.starterAtlas,
        148,
        224,
        75,
        10,
        78,
        36,
        75,
        10,
      );

      this.overlayCtx.drawImage(
        this.starterAtlas,
        148,
        234,
        42,
        10,
        98,
        52,
        42,
        10,
      );
    }

    this.overlayCtx.drawImage(
      this.starterAtlas,
      0,
      244,
      206,
      46,
      17,
      114,
      206,
      46,
    );

    drawText(this.overlayCtx, this.font, 'PROF. BIRCH is in trouble!', 0, 0, 24, 121);
    drawText(this.overlayCtx, this.font, 'Release a POKéMON and rescue him!', 0, 0, 24, 137);

    if (!this.keyDown) {
      if (keyboard.isDown(keyboard.LEFT) && this.selectedStarter !== 0) {
        this.selectedStarter--;
        this.keyDown = true;
      } else if (keyboard.isDown(keyboard.RIGHT) && this.selectedStarter !== 2) {
        this.selectedStarter++;
        this.keyDown = true;
      }
    }
    
    if (!keyboard.isDown(keyboard.LEFT) && !keyboard.isDown(keyboard.RIGHT)) {
      this.keyDown = false;
    }

    if (keyboard.isDown(keyboard.ENTER)) {
      const chosenPokemonId = (this.selectedStarter === 0) ? 252 : (this.selectedStarter === 1) ? 255 : 258;
      this.player.addPlayerPokemon(chosenPokemonId, [5, -1]);

      this.gameTriggers.chooseStarter = true;
      this.gameStatus = 'game';
    }
  }

  loadAdjacentMaps(fromDirection: string | boolean = false) {
    const Adjacent = this.map.getAjacent(this.currentMap);
    let updatedData: AddMapReturnType | undefined;
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

  update(delta: number) {
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

      // const fileName = this.currentMap.replace(' ', '_');
      // console.log(fileName)
      // this.buildingTiles = this.loader.loadImageToCanvas(fileName, constants.ASSETS_LOCATION_TILES[fileName].height, constants.ASSETS_LOCATION_TILES[fileName].width);
      
      this.map.updateMap(this.currentMap)
      const addedTiles = this.loadAdjacentMaps(isNextMap[1]);

      if (addedTiles) {
        this.avatar.newAreaMapUpdate(this.map, addedTiles);
      }

      if (this.currentMap === 'route 101' && this.gameTriggers.chooseStarter === false) {
        this.gameStatus = 'chooseStarter';
        // await this.chooseStarter();
      }
    }

    this.avatar.move(delta, this.dirx, this.diry);
    this.camera.update();
  }

  render(delta: number): void {
    this.drawLayer(0);

    this.drawPlayer(delta, false);

    this.drawLayer(1);

    this.drawPlayer(delta, true);

    this.drawLayer(2);
  }

  drawLayer(layer: number): void {
    const startCol = Math.floor(this.camera.x / constants.MAP_TSIZE);
    const endCol = startCol + (this.camera.width / constants.MAP_TSIZE);
    const startRow = Math.floor(this.camera.y / constants.MAP_TSIZE);
    const endRow = startRow + (this.camera.height / constants.MAP_TSIZE);
    const offsetX = -this.camera.x + startCol * constants.MAP_TSIZE;
    const offsetY = -this.camera.y + startRow * constants.MAP_TSIZE;

    // tiles 0-499 for general tiles
    // tiles 500- for building tiles

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        let tile = this.map.getTile(layer, c, r);
        if (tile === -1) break; 
        const x = (c - startCol) * constants.MAP_TSIZE + offsetX;
        const y = (r - startRow) * constants.MAP_TSIZE + offsetY;

        let atlas: HTMLCanvasElement;

        if (500 <= tile) {
          atlas = this.buildingAtlas;
          tile = tile - 500;
        } else {
          atlas = this.tileAtlas;
        }


        if (tile !== 0 && atlas) {
          this.gameCtx.drawImage(
            atlas,
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

  drawPlayer(delta: number, onlyDrawTop: boolean): void {
    if (!onlyDrawTop) {
      this.direction = this.diry === 1 ? 0 : this.dirx === -1 ? 1 : this.diry === -1 ? 2 : this.dirx === 1 ? 3 : this.direction;
      if (this.diry === 0 && this.dirx === 0) {
        this.animation = 0;
      } else {
        this.animation = this.animation < 3.95 ? this.animation + 6 * delta : 0;
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