import { Loader } from '../utils/loader';

import { pokemonType, pokedexType, pokedexCombType } from '../utils/types';
import { constants } from '../utils/constants';

import * as pokedex from '../pokedex.json';

const BATTLE_STATUS = [
  'slidePokemonIn',
  'writeAppearText',
  'writeGoText',
  'throwPokemon',
  'finished',
]

export class PokemonBattle {
  loader: Loader;

  environment: number;
  route: number;
  ctx: CanvasRenderingContext2D;
  battleAssets!: HTMLCanvasElement;
  font!: HTMLCanvasElement;
  avatarAssets!: HTMLCanvasElement;

  enemyGeneration!: number;
  enemyPokemonSprite!: HTMLCanvasElement;
  enemyPokemon: {
    pokemon: pokedexCombType;
    xSource: number;
    ySource: number;
  }

  playerPokemonId = '12';
  playerPokemonSprite!: HTMLCanvasElement;
  playerGeneration: number;
  playerPokemon: {
    pokemon: pokedexType;
    xSource: number;
    ySource: number;  
    pokeball: number;
  }

  battleResultWin = false;

  _previousElapsed = 0;
  battleStatus = 0;
  X_slidePokemonIn = 0;
  X_slideEnemyHealth = 0;
  X_throwPokemon = 0;
  X_throwPokeball = 0;
  pokeballAnimation = 0;
  X_writeTextToBattleBox = 0;

  constructor(context: CanvasRenderingContext2D, loader: Loader, route: number, environment: number) {
    this.loader = loader;

    this.environment = environment;
    this.route = route;
    this.ctx = context;
    this.playerGeneration = (parseInt(this.playerPokemonId) <= 151) ? 0 : (parseInt(this.playerPokemonId) < 251) ? 1 : 2;

    const pokemonInfo = this.init();

    const pokedexDataEnemy = pokedex[pokemonInfo.id_string as keyof typeof pokedex];
    this.enemyPokemon = {
      pokemon: { ...pokemonInfo, ...pokedexDataEnemy },
      xSource: (pokedexDataEnemy.id - constants.ASSETS_GENERATION_OFFSET[this.enemyGeneration] - 1) % 3 * constants.POKEMON_SPRITE_WIDTH,
      ySource: (((pokedexDataEnemy.id - constants.ASSETS_GENERATION_OFFSET[this.enemyGeneration] - 1) / 3) << 0) * constants.POKEMON_SPRITE_HEIGHT,
    }

    const pokedexDataPlayer = pokedex[this.playerPokemonId as keyof typeof pokedex];
    this.playerPokemon = {
      pokemon: pokedexDataPlayer,
      xSource: (pokedexDataPlayer.id - constants.ASSETS_GENERATION_OFFSET[this.playerGeneration] - 1) % 3 * constants.POKEMON_SPRITE_WIDTH,
      ySource: (((pokedexDataPlayer.id - constants.ASSETS_GENERATION_OFFSET[this.playerGeneration] - 1) / 3) << 0) * constants.POKEMON_SPRITE_HEIGHT,
      pokeball: 2,
    }

    console.log(this.enemyPokemon)
    console.log(this.playerPokemon)
  }

  init(): pokemonType {
    const candinates = constants.POKEMON_INDEX[this.route][this.environment];
    
    const items: string[] = [];
    for (const pokemonIndex in candinates) {
      for (let i = 1; i <= candinates[pokemonIndex].encounter_rate; i++) {
        items.push(pokemonIndex)
      }
    }

    const id = items[Math.floor(Math.random() * items.length)];
    this.enemyGeneration = (parseInt(id) <= 151) ? 0 : (parseInt(id) < 251) ? 1 : 2;

    this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants.ASSETS_BATTLE_HEIGHT, constants.ASSETS_BATTLE_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', constants.ASSETS_FONT_HEIGHT, constants.ASSETS_FONT_WIDTH);
    this.avatarAssets = this.loader.loadImageToCanvas('avatar', constants.ASSETS_AVATAR_HEIGHT, constants.ASSETS_AVATAR_WIDTH);
    this.enemyPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.enemyGeneration + 1), constants.ASSETS_POKEMON_HEIGHT[this.enemyGeneration], constants.ASSETS_POKEMON_WIDTH);
    if (this.enemyGeneration === this.playerGeneration) {
      this.playerPokemonSprite = this.enemyPokemonSprite;
    } else {
      this.playerPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.playerGeneration + 1), constants.ASSETS_POKEMON_HEIGHT[this.playerGeneration], constants.ASSETS_POKEMON_WIDTH);
    }

    return candinates[items[Math.floor(Math.random() * items.length)]];
  }

  getPokemon(): pokedexCombType {
    return this.enemyPokemon.pokemon;
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

    if (BATTLE_STATUS[this.battleStatus] === 'slidePokemonIn') {
      this.drawBattleArena();
      this.drawSlidePokemonIn(delta);
      this.drawBattleBox();

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
      this.drawBattleArena();
      this.drawSlidePokemonIn(0, true, false);
      this.drawBattleBox();
      this.writeTextToBattleBox('Wild ' + this.enemyPokemon.pokemon.name.toUpperCase() + ' appeared!|', 1, delta, 1);
      this.drawSlideEnemyHealth(delta);

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
      this.writeTextToBattleBox('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 1, delta, 0);

    } else if (BATTLE_STATUS[this.battleStatus] === 'throwPokemon') {
      this.drawBattleArena();
      this.drawSlidePokemonIn(0, false, false);
      this.drawThrowPokemon(delta);
      this.drawBattleBox();
      this.drawText('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 1, 16, 122)
      this.drawSlideEnemyHealth(0);
    }
    
    if (BATTLE_STATUS[this.battleStatus] !== 'finished') {
      window.requestAnimationFrame(this.tick.bind(this));

      return false;
    } else {
      return true;
    }
  }

  drawSlidePokemonIn(delta: number, drawPlayer = true, nextPhase = true) {
    const speed = 176;
    const xPixel = (this.X_slidePokemonIn + delta * speed) << 0;

    this.ctx.drawImage(
      this.battleAssets,
      this.environment % 3 * constants.BATTLE_SCENE_WIDTH,
      ((0.5 + this.environment / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.TEXT_BOX_HEIGHT,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
      xPixel - constants.BATTLE_SCENE_WIDTH,
      48,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
    );

    this.ctx.drawImage(
      this.enemyPokemonSprite,
      this.enemyPokemon.xSource + 8,
      this.enemyPokemon.ySource + 8,
      constants.POKEMON_SIZE,
      constants.POKEMON_SIZE,
      xPixel - 0.75 * constants.BATTLE_SCENE_WIDTH,
      48 - constants.POKEMON_SIZE / 2,
      constants.POKEMON_SIZE,
      constants.POKEMON_SIZE,
    );

    this.ctx.drawImage(
      this.battleAssets,
      this.environment % 3 * constants.BATTLE_SCENE_WIDTH,
      ((0.5 + this.environment / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.TEXT_BOX_HEIGHT,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
      constants.GAME_WIDTH - xPixel,
      100,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
    );
    
    if (drawPlayer) {
      this.ctx.drawImage(
        this.avatarAssets,
        constants.AVATAR_BATTLE_OFFSET,
        0,
        constants.AVATAR_BATTLE_WIDTH,
        constants.AVATAR_BATTLE_HEIGHT,
        constants.GAME_WIDTH - xPixel + 0.5 * constants.BATTLE_SCENE_WIDTH,
        constants.BATTLE_ARENA_HEIGHT - constants.AVATAR_BATTLE_HEIGHT,
        constants.AVATAR_BATTLE_WIDTH,
        constants.AVATAR_BATTLE_HEIGHT,
      );

      if (xPixel >= constants.GAME_WIDTH && nextPhase) {
        this.nextBattlePhase();
      }

      this.X_slidePokemonIn += delta * speed;
      this.X_throwPokemon = this.X_slidePokemonIn;
    }
  }

  drawSlideEnemyHealth(delta: number) {
    const speed = 128;
    let xPixel = (this.X_slideEnemyHealth + delta * speed - constants.ASSETS_ENEMY_HEALTH_WIDTH) << 0;

    if (xPixel > 13) xPixel = 13;

    this.ctx.drawImage(
      this.battleAssets,
      constants.ASSETS_PLAYER_HEALTH_WIDTH,
      constants.ASSETS_HEALTH_OFFSET,
      constants.ASSETS_ENEMY_HEALTH_WIDTH,
      constants.ASSETS_ENEMY_HEALTH_HEIGHT,
      xPixel,
      16,
      constants.ASSETS_ENEMY_HEALTH_WIDTH,
      constants.ASSETS_ENEMY_HEALTH_HEIGHT,
    );

    this.X_slideEnemyHealth += delta * speed;
  }

  drawThrowPokemon(delta: number) {
    const speed = 176;
    const speedPokeball = 48;

    const xPixel = (this.X_throwPokemon + delta * speed) << 0;

    const assetOffset = (xPixel < constants.GAME_WIDTH + 0.6 * constants.BATTLE_SCENE_WIDTH) ? constants.AVATAR_BATTLE_HEIGHT : 
                        (xPixel < constants.GAME_WIDTH + 0.75 * constants.BATTLE_SCENE_WIDTH) ? 2 * constants.AVATAR_BATTLE_HEIGHT : 
                        3 * constants.AVATAR_BATTLE_HEIGHT;
                    
    let xPixelPokeball = 0;
    if (xPixel >= 340) {
      this.pokeballAnimation = this.pokeballAnimation < 7.2 ? this.pokeballAnimation + 0.2 : 0;

      xPixelPokeball = (this.X_throwPokeball + delta * speedPokeball) << 0;
      const yPixelPokeball = (0.08 * xPixelPokeball ** 2 - 2.2 * xPixelPokeball + 70) << 0

      this.ctx.drawImage(
        this.battleAssets,
        constants.POKEBALL_OFFSET_X + this.playerPokemon.pokeball * constants.POKEBALL_SIZE,
        constants.POKEBALL_OFFSET_Y + 37 + (this.pokeballAnimation << 0) * constants.POKEBALL_SIZE,
        constants.POKEBALL_SIZE,
        constants.POKEBALL_SIZE,
        xPixelPokeball + 25,
        yPixelPokeball,
        constants.POKEBALL_SIZE,
        constants.POKEBALL_SIZE,
      );

      this.X_throwPokeball += delta * speedPokeball;
    }

    if (xPixelPokeball >= 40) {
      this.ctx.drawImage(
        this.playerPokemonSprite,
        this.playerPokemon.xSource + 8 + 2 * (8 + constants.POKEMON_SIZE),
        this.playerPokemon.ySource + 8,
        constants.POKEMON_SIZE,
        constants.POKEMON_SIZE,
        0.5 * (constants.BATTLE_SCENE_WIDTH - constants.POKEMON_SIZE),
        constants.BATTLE_ARENA_HEIGHT - constants.AVATAR_BATTLE_HEIGHT,
        constants.POKEMON_SIZE,
        constants.POKEMON_SIZE,
      );
    }
                    
    this.ctx.drawImage(
      this.avatarAssets,
      constants.AVATAR_BATTLE_OFFSET,
      assetOffset,
      constants.AVATAR_BATTLE_WIDTH,
      constants.AVATAR_BATTLE_HEIGHT,
      constants.GAME_WIDTH - xPixel + 0.5 * constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_ARENA_HEIGHT - constants.AVATAR_BATTLE_HEIGHT,
      constants.AVATAR_BATTLE_WIDTH,
      constants.AVATAR_BATTLE_HEIGHT,
    );

    if (xPixelPokeball >= 400) {
      this.nextBattlePhase();
    }

    this.X_throwPokemon += delta * speed;
  }

  writeTextToBattleBox(text: string, fontColor: number, delta: number, delayAfter: number) {
    const speed = 304;
    
    const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
    const textToDisplay =  text.slice(0, i);

    this.drawText(textToDisplay, fontColor, 16, 122);

    if (i >= text.length + delayAfter * speed / 6) {
      this.X_writeTextToBattleBox = 0;

      this.nextBattlePhase();
      this.drawBattleBox();
    } else {
      this.X_writeTextToBattleBox += delta * speed;
    }
  } 

  drawBattleArena() {
    this.ctx.drawImage(
      this.battleAssets,
      this.environment % 4 * constants.GAME_WIDTH,
      ((0.5 + this.environment / 4) << 0) * constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.BATTLE_ARENA_HEIGHT,
      0,
      0,
      constants.GAME_WIDTH,
      constants.BATTLE_ARENA_HEIGHT,
    );
  }

  drawBattleBox() {
    this.ctx.drawImage(
      this.battleAssets,
      0,
      3 * constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.TEXT_BOX_HEIGHT,
      0,
      constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.TEXT_BOX_HEIGHT,
    );
  }

  drawText(text: string, fontColor: number, posX: number, posY: number) {
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
          positions.posY + fontColor * 2 * constants.FONT_HEIGHT,
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