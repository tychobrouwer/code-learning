import { Loader } from '../utils/loader';

import { encounterTableType, pokemonInfoType, pokedexType } from '../utils/types';
import { randomFromArray, randomFromMinMax } from '../utils/helper';
import { constants } from '../utils/constants';

import * as pokedex from '../pokedex.json';
import * as encounterTable from '../encounter_table.json';

const BATTLE_STATUS = [
  'slidePokemonIn',
  'writeAppearText',
  'writeGoText',
  'throwPokemon',
  'finished',
]

export class PokemonBattle {
  loader: Loader;
  pokedex: pokedexType;
  encounterTable: encounterTableType;

  encounterMethod: number;
  route: string;
  ctx: CanvasRenderingContext2D;
  battleAssets!: HTMLCanvasElement;
  font!: HTMLCanvasElement;
  avatarAssets!: HTMLCanvasElement;

  enemyGeneration!: number;
  enemyPokemonSprite!: HTMLCanvasElement;
  enemyPokemon: {
    pokemon: pokemonInfoType;
    health: number;
    level: number;
    male: boolean;
    xSource: number;
    ySource: number;
  }

  playerPokemonSprite!: HTMLCanvasElement;
  playerGeneration: number;
  playerPokemon: {
    pokemon: pokemonInfoType;
    health: number;
    level: number;
    male: boolean;
    pokeball: number;
    xSource: number;
    ySource: number;  
  }

  battleResultWin = false;

  _previousElapsed = 0;
  battleStatus = 0;
  X_slidePokemonIn = 0;
  X_slideEnemyHealth = 0;
  X_slidePlayerHealth = 0;
  X_throwPokemon = 0;
  X_throwPokeball = 0;
  pokeballAnimation = 0;
  pokemoinAlternativeOpacity = 1;
  X_writeTextToBattleBox = 0;

  constructor(context: CanvasRenderingContext2D, loader: Loader, route: string, encounterMethod: number) {
    this.loader = loader;
    this.pokedex = pokedex;
    this.encounterTable = encounterTable;

    const playerPokemonId = '12';
    const playerPokemonLevel = 5;
    const playerPokemonPokeball = 2;
    const playerPokemonHealth = 19;
    const playerPokemonGender = true;

    this.encounterMethod = encounterMethod;
    this.route = route;
    this.ctx = context;
    this.playerGeneration = (parseInt(playerPokemonId) <= 151) ? 0 : (parseInt(playerPokemonId) < 251) ? 1 : 2;

    const enemyPokemonData = this.init();

    const pokedexDataEnemy = this.pokedex[enemyPokemonData[0].toString()]
    this.enemyPokemon = {
      pokemon: pokedexDataEnemy,
      health: 100,
      level: enemyPokemonData[1],
      male: !randomFromArray([0, 1]),
      xSource: (pokedexDataEnemy.id - constants.ASSETS_GENERATION_OFFSET[this.enemyGeneration] - 1) % 3 * constants.POKEMON_SPRITE_WIDTH,
      ySource: (((pokedexDataEnemy.id - constants.ASSETS_GENERATION_OFFSET[this.enemyGeneration] - 1) / 3) << 0) * constants.POKEMON_SIZE,
    }

    const pokedexDataPlayer = this.pokedex[playerPokemonId];
    this.playerPokemon = {
      pokemon: pokedexDataPlayer,
      health: playerPokemonHealth,
      level: playerPokemonLevel,
      male: playerPokemonGender,
      pokeball: playerPokemonPokeball,
      xSource: (pokedexDataPlayer.id - constants.ASSETS_GENERATION_OFFSET[this.playerGeneration] - 1) % 3 * constants.POKEMON_SPRITE_WIDTH,
      ySource: (((pokedexDataPlayer.id - constants.ASSETS_GENERATION_OFFSET[this.playerGeneration] - 1) / 3) << 0) * constants.POKEMON_SIZE,
    }

    console.log(this.enemyPokemon)
    console.log(this.playerPokemon)
  }

  init(): number[] {
    const candinates = this.encounterTable[this.route][this.encounterMethod.toString()];

    const candinateIds: number[] = [];
    for (const pokemonIndex in candinates) {
      candinateIds.push(...Array(candinates[pokemonIndex].rate).fill(parseInt(pokemonIndex)))
    }

    const pokemonId = randomFromArray(candinateIds);
    const pokemonLevel = randomFromMinMax(candinates[pokemonId].level[0], candinates[pokemonId].level[1]);

    this.enemyGeneration = (pokemonId <= 151) ? 0 : (pokemonId < 251) ? 1 : 2;

    this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants.ASSETS_BATTLE_HEIGHT, constants.ASSETS_BATTLE_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', constants.ASSETS_FONT_HEIGHT, constants.ASSETS_FONT_WIDTH);
    this.avatarAssets = this.loader.loadImageToCanvas('avatar', constants.ASSETS_AVATAR_HEIGHT, constants.ASSETS_AVATAR_WIDTH);
    this.enemyPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.enemyGeneration + 1), constants.ASSETS_POKEMON_HEIGHT[this.enemyGeneration], constants.ASSETS_POKEMON_WIDTH);
    if (this.enemyGeneration === this.playerGeneration) {
      this.playerPokemonSprite = this.enemyPokemonSprite;
    } else {
      this.playerPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.playerGeneration + 1), constants.ASSETS_POKEMON_HEIGHT[this.playerGeneration], constants.ASSETS_POKEMON_WIDTH);
    }
    
    return [
      pokemonId,
      pokemonLevel,
    ];
  }

  getPokemon(): pokemonInfoType {
    return this.enemyPokemon.pokemon;
  }

  async battle(): Promise<boolean> {
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
      this.drawEnemyPokemon(delta, true, true);
      this.drawActionBox();

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
      this.drawBattleArena();
      this.drawEnemyPokemon(0, true);
      this.drawActionBox();
      this.writeTextToBattleBox('Wild ' + this.enemyPokemon.pokemon.name.toUpperCase() + ' appeared!|', 0, 1, delta, 1, true);
      this.drawEnemyHealth(delta, true);

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
      this.writeTextToBattleBox('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 0, 1, delta, 0, true);

    } else if (BATTLE_STATUS[this.battleStatus] === 'throwPokemon') {
      this.drawBattleArena();
      this.drawEnemyPokemon(0);
      this.drawEnemyHealth(0);
      this.drawPlayerPokemon(delta, true, true);
      this.drawActionBox();
      this.drawText('Go! ' + this.playerPokemon.pokemon.name.toUpperCase() + '!', 0, 1, 16, 122)
    }
    
    if (BATTLE_STATUS[this.battleStatus] !== 'finished') {
      window.requestAnimationFrame(this.tick.bind(this));

      return false;
    } else {
      return true;
    }
  }

  drawEnemyPokemon(delta: number, drawPlayer = false, nextPhase = false) {
    const speed = 176;
    const xPixel = (this.X_slidePokemonIn + delta * speed) << 0;

    this.ctx.drawImage(
      this.battleAssets,
      this.encounterMethod % 3 * constants.BATTLE_SCENE_WIDTH,
      ((0.5 + this.encounterMethod / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.TEXT_BOX_HEIGHT,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
      xPixel - constants.BATTLE_SCENE_WIDTH,
      48,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
    );

    this.ctx.drawImage(
      this.enemyPokemonSprite,
      this.enemyPokemon.xSource,
      this.enemyPokemon.ySource,
      constants.POKEMON_SIZE,
      constants.POKEMON_SIZE,
      xPixel - 0.75 * constants.BATTLE_SCENE_WIDTH,
      48 - constants.POKEMON_SIZE / 2,
      constants.POKEMON_SIZE,
      constants.POKEMON_SIZE,
    );

    this.ctx.drawImage(
      this.battleAssets,
      this.encounterMethod % 3 * constants.BATTLE_SCENE_WIDTH,
      ((0.5 + this.encounterMethod / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.TEXT_BOX_HEIGHT,
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

  drawEnemyHealth(delta: number, slideIn = false) {
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

    const healthbarOffset = (this.enemyPokemon.health < 20) ? 4 : (this.enemyPokemon.health < 50) ? 2: 0;
    const healthbarWidth = (this.enemyPokemon.health / 100 * 48) << 0

    this.ctx.drawImage(
      this.battleAssets,
      constants.ASSETS_ENEMY_HEALTH_WIDTH + constants.ASSETS_PLAYER_HEALTH_WIDTH,
      constants.ASSETS_HEALTH_OFFSET + healthbarOffset,
      healthbarWidth,
      2,
      xPixel + 39,
      16 + 17,
      healthbarWidth,
      2,
    );

    this.drawText(this.enemyPokemon.pokemon.name.toUpperCase() + ((this.enemyPokemon.male) ? '#' : '^'), 1, 0, xPixel - 13 + 20, 22);
    this.drawText(this.enemyPokemon.level.toString(), 1, 0, xPixel - 13 + 89, 22);

    if (slideIn) {
      this.X_slideEnemyHealth += delta * speed;
    }
  }

  drawPlayerPokemon(delta: number, throwPokemon = false, nextPhase = false) {
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

      if (throwPokemon) {
        this.X_throwPokeball += delta * speedPokeball;
      }
    }

    if (xPixelPokeball >= 30) {
      const opacity = (this.pokemoinAlternativeOpacity > 0) ? this.pokemoinAlternativeOpacity : 0;
      this.ctx.globalAlpha = opacity;

      if (opacity > 0) {
        this.ctx.drawImage(
          this.playerPokemonSprite,
          this.playerPokemon.xSource + 2 * constants.POKEMON_SIZE + constants.POKEMON_ALTERNATIVE_OFFSET,
          this.playerPokemon.ySource,
          constants.POKEMON_SIZE,
          constants.POKEMON_SIZE,
          (0.5 * (constants.BATTLE_SCENE_WIDTH - constants.POKEMON_SIZE) + 0.5 * (constants.POKEMON_SIZE - (xPixelPokeball - 30) / 40 * constants.POKEMON_SIZE) << 0),
          (constants.BATTLE_ARENA_HEIGHT - constants.AVATAR_BATTLE_HEIGHT + constants.POKEMON_SIZE - (xPixelPokeball - 30) / 40 * constants.POKEMON_SIZE) << 0,
          constants.POKEMON_SIZE * (xPixelPokeball - 30) / 40,
          constants.POKEMON_SIZE * (xPixelPokeball - 30) / 40,
        );  
      }

      this.ctx.globalAlpha = 1 - opacity;
      
      if (xPixelPokeball >= 70) {
        this.ctx.drawImage(
          this.playerPokemonSprite,
          this.playerPokemon.xSource + 2 * constants.POKEMON_SIZE,
          this.playerPokemon.ySource,
          constants.POKEMON_SIZE,
          constants.POKEMON_SIZE,
          0.5 * (constants.BATTLE_SCENE_WIDTH - constants.POKEMON_SIZE),
          constants.BATTLE_ARENA_HEIGHT - constants.AVATAR_BATTLE_HEIGHT,
          constants.POKEMON_SIZE,
          constants.POKEMON_SIZE,
        );

        this.pokemoinAlternativeOpacity -= delta * 8;

        const speedHealth = 128;
        let xPixelPlayerHealth = (this.X_slidePlayerHealth - delta * speedHealth + constants.GAME_WIDTH) << 0;
    
        if (xPixelPlayerHealth < 127) xPixelPlayerHealth = 127;
    
        this.ctx.drawImage(
          this.battleAssets,
          0,
          constants.ASSETS_HEALTH_OFFSET,
          constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_PLAYER_HEALTH_HEIGHT,
          xPixelPlayerHealth,
          74,
          constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_PLAYER_HEALTH_HEIGHT,
        );

        const healthbarOffset = (this.playerPokemon.health < 20) ? 4 : (this.playerPokemon.health < 50) ? 2: 0;
        const healthbarWidth = (this.playerPokemon.health / 100 * 48) << 0

        this.ctx.drawImage(
          this.battleAssets,
          constants.ASSETS_ENEMY_HEALTH_WIDTH + constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_HEALTH_OFFSET + healthbarOffset,
          healthbarWidth,
          2,
          xPixelPlayerHealth + 47,
          74 + 17,
          healthbarWidth,
          2,
        );

        this.drawText(this.playerPokemon.pokemon.name.toUpperCase() + ((this.playerPokemon.male) ? '#' : '^'), 1, 0, xPixelPlayerHealth + 14, 74 + 6)
        this.drawText(this.playerPokemon.level.toString(), 1, 0, xPixelPlayerHealth + 83, 74 + 6)

        if (throwPokemon) {
          this.X_slidePlayerHealth -= delta * speedHealth;
        }
      }

      this.ctx.globalAlpha = 1;
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

    if (xPixelPokeball >= 200 && nextPhase) {
      this.nextBattlePhase();
    }

    if (throwPokemon) {
      this.X_throwPokemon += delta * speed;
    }
  }

  writeTextToBattleBox(text: string, fontsize: number, fontColor: number, delta: number, delayAfter: number, nextPhase = false) {
    const speed = 304;
    
    const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
    const textToDisplay =  text.slice(0, i);

    this.drawText(textToDisplay, fontsize, fontColor, 16, 122);

    if (i >= text.length + delayAfter * speed / 6) {
      this.X_writeTextToBattleBox = 0;

      this.drawActionBox();

      if (nextPhase) {
        this.nextBattlePhase();
      }
      } else {
      this.X_writeTextToBattleBox += delta * speed;
    }
  } 

  drawBattleArena() {
    this.ctx.drawImage(
      this.battleAssets,
      this.encounterMethod % 4 * constants.GAME_WIDTH,
      ((0.5 + this.encounterMethod / 4) << 0) * constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.BATTLE_ARENA_HEIGHT,
      0,
      0,
      constants.GAME_WIDTH,
      constants.BATTLE_ARENA_HEIGHT,
    );
  }

  drawActionBox() {
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

  drawText(text: string, fontsize: number, fontColor: number, posX: number, posY: number) {
    for (let i = 0; i < text.length; i++) {
      const positions = {
        posX: constants.CHAR_IN_FONT.indexOf(text[i]) % 39 * constants.FONT_WIDTH[fontsize],
        posY: ((constants.CHAR_IN_FONT.indexOf(text[i]) / 39) << 0) * constants.FONT_HEIGHT[fontsize],
      }

      let width = constants.FONT_WIDTH[fontsize];
      if (text[i] === '|') { // caret is 1 pixel wider
        width = constants.FONT_WIDTH[fontsize] + 1;
      }

      const yOffset = (fontsize === 0) ? fontColor * 2 * constants.FONT_HEIGHT[fontsize] : 52 + fontColor * 2 * constants.FONT_HEIGHT[fontsize];

      this.ctx.drawImage(
        this.font,
        positions.posX,
        positions.posY + yOffset,
        width,
        constants.FONT_HEIGHT[fontsize],
        posX + constants.FONT_WIDTH[fontsize] * i,
        posY,
        width,
        constants.FONT_HEIGHT[fontsize]
      );
    }
  }
}