import { Loader } from '../utils/loader';

import { pokemonType } from '../utils/types';
import { constants } from '../utils/constants';

const BATTLE_STATUS = [
  'slidePokemonIn',
  'writeAppearText',
  'writeGoText',
  'finished',
]

export class PokemonBattle {
  loader: Loader;

  pokemon: pokemonType;
  environment: number;
  route: number;
  ctx: CanvasRenderingContext2D;
  battleAssets!: HTMLCanvasElement;
  pokemonGeneration1!: HTMLCanvasElement;
  font!: HTMLCanvasElement;

  battleResultWin = false;
  _previousElapsed = 0;
  battleStatus = 0;
  X_slidePokemonIn = 0;
  X_writeTextToBattleBox = 0;

  constructor(context: CanvasRenderingContext2D, loader: Loader, route: number, environment: number) {
    this.loader = loader;

    this.environment = environment;
    this.route = route;
    this.ctx = context;

    this.pokemon = this.init();

  }

  init(): pokemonType {
    const candinates = constants.POKEMON_INDEX[this.route][this.environment];

    const items: string[] = [];

    for (const pokemon of Object.keys(candinates)) {
      for (let i = 1; i <= candinates[pokemon].encounterRate; i++) {
        items.push(pokemon)
      }
    }

    this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants.ASSETS_BATTLE_HEIGHT, constants.ASSETS_BATTLE_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', constants.ASSETS_FONT_HEIGHT, constants.ASSETS_FONT_WIDTH);
    // this.pokemonGeneration1 = this.loader.loadImageToCanvas('pokemonGeneration1', constants.ASSETS_POKEMON_HEIGHT, constants.ASSETS_POKEMON_WIDTH);

    return candinates[items[Math.floor(Math.random() * items.length)]];
  }

  getPokemon(): pokemonType {
    return this.pokemon;
  }

  async battle(): Promise<boolean> {
    this.drawBattleArena();
    this.drawBattleBox();

    window.requestAnimationFrame(this.tick.bind(this));

    await this.waitForBattleFinised();

    this.battleResultWin = true;

    this.ctx.clearRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);

    return this.battleResultWin;
  }

  waitForBattleFinised(): Promise<void> {
    return new Promise((resolve) => {
      if (BATTLE_STATUS[this.battleStatus] === 'finished') {
        resolve();
      } else {
        setTimeout(async () => { 
          await this.waitForBattleFinised();
          resolve();
        }, 10);
      }
    })
  }

  nextBattlePhase() {
    this.battleStatus++;
  }

  async tick(elapsed: number): Promise<boolean> {
    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms

    this._previousElapsed = elapsed;

    const playerPokemon = 'playerPokemon';

    if (BATTLE_STATUS[this.battleStatus] === 'slidePokemonIn') {
      this.drawBattleArena();
      this.drawSlidePokemonIn(delta);
      this.drawBattleBox();
    } else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
      this.writeTextToBattleBox('Wild ' + this.pokemon.name.toUpperCase() + ' appeared!|', delta);

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
      this.writeTextToBattleBox('GO! ' + playerPokemon + '!|', delta);
    }
    
    if (BATTLE_STATUS[this.battleStatus] !== 'finished') {
      window.requestAnimationFrame(this.tick.bind(this));

      return false;
    } else {
      return true;
    }
  }

  drawSlidePokemonIn(delta: number) {
    if (this.battleAssets) {
      const speed = 256;
      const xPixel = (this.X_slidePokemonIn + delta * speed) << 0;

      this.ctx.drawImage(
        this.battleAssets,
        this.environment % 3 * constants.BATTLE_SCENE_WIDTH,
        ((0.5 + this.environment / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 4 * constants.BATTLE_ARENA_HEIGHT + constants.TEXT_BOX_HEIGHT,
        constants.BATTLE_SCENE_WIDTH,
        constants.BATTLE_SCENE_HEIGHT,
        xPixel - constants.BATTLE_SCENE_WIDTH,
        48,
        constants.BATTLE_SCENE_WIDTH,
        constants.BATTLE_SCENE_HEIGHT,
      );

      this.ctx.drawImage(
        this.battleAssets,
        this.environment % 3 * constants.BATTLE_SCENE_WIDTH,
        ((0.5 + this.environment / 3) << 0) * 32 + 496,
        constants.BATTLE_SCENE_WIDTH,
        constants.BATTLE_SCENE_HEIGHT,
        constants.GAME_WIDTH - xPixel,
        100,
        constants.BATTLE_SCENE_WIDTH,
        constants.BATTLE_SCENE_HEIGHT,
      );

      if (xPixel >= constants.GAME_WIDTH) {        
        this.nextBattlePhase();
      } else {
        this.X_slidePokemonIn += delta * speed;
      }
    }  
  }

  writeTextToBattleBox(text: string, delta: number) {
    const speed = 256;
    
    const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
    const textToDisplay =  text.slice(0, i);

    this.drawText(textToDisplay, 16, 122);

    if (i >= text.length + speed / 6) {
      this.X_writeTextToBattleBox = 0;

      this.nextBattlePhase();
      this.drawBattleBox();
    } else {
      this.X_writeTextToBattleBox += delta * speed;
    }
  } 

  drawBattleArena() {
    if (this.battleAssets) {
      this.ctx.drawImage(
        this.battleAssets,
        this.environment % 3 * constants.GAME_WIDTH,
        ((0.5 + this.environment / 3) << 0) * constants.BATTLE_ARENA_HEIGHT,
        constants.GAME_WIDTH,
        constants.BATTLE_ARENA_HEIGHT,
        0,
        0,
        constants.GAME_WIDTH,
        constants.BATTLE_ARENA_HEIGHT,
      );
    }
  }

  drawBattleBox() {
    if (this.battleAssets) {
      this.ctx.drawImage(
        this.battleAssets,
        0,
        4 * constants.BATTLE_ARENA_HEIGHT,
        constants.GAME_WIDTH,
        constants.TEXT_BOX_HEIGHT,
        0,
        constants.BATTLE_ARENA_HEIGHT,
        constants.GAME_WIDTH,
        constants.TEXT_BOX_HEIGHT,
      );
    }
  }

  drawText(text: string, posX: number, posY: number) {
    for (let i = 0; i < text.length; i++) {
      const positions = {
        posX: constants.CHAR_IN_FONT.indexOf(text[i]) % 39 * constants.FONT_WIDTH,
        posY: ((constants.CHAR_IN_FONT.indexOf(text[i]) / 39) << 0) * constants.FONT_HEIGHT,
      }

      let width = constants.FONT_WIDTH;
      if (text[i] === '|') { // caret is 1 pixel wider
        width = constants.FONT_WIDTH + 1;
      }

      if (this.font) {
        this.ctx.drawImage(
          this.font,
          positions.posX,
          positions.posY,
          width,
          constants.FONT_HEIGHT,
          posX + constants.FONT_WIDTH * i,
          posY,
          width,
          constants.FONT_HEIGHT
        );
      }
    }
  }
}