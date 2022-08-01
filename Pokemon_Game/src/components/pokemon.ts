import * as pokedex from '../pokedex.json';
import * as encounterTable from '../encounter_table.json';

import { Loader } from '../utils/loader';
import { Player } from './player';

import { randomFromArray, generatePokemon, drawText } from '../utils/helper';
import { constants } from '../utils/constants';
import { keyboard } from '../utils/keyboard';

import { PlayerDataType, EncounterTableType, PokedexType, PokemonDataType } from '../utils/types';

const BATTLE_STATUS = [
  'slidePokemonIn',
  'writeAppearText',
  'writeGoText',
  'throwPokemon',
  'playerActionSelect',
  'playerAction',
  'finished',
];

// const BATTLE_ACTIONS = [
//   'fight',
//   'bag',
//   'pokemon',
//   'run'
// ];

export class PokemonBattle {
  private loader: Loader;
  private pokedex: PokedexType;
  private encounterTable: EncounterTableType;

  private encounterMethod: number;
  private route: string;
  private ctx: CanvasRenderingContext2D;
  private battleAssets!: HTMLCanvasElement;
  private font!: HTMLCanvasElement;
  private avatarAssets!: HTMLCanvasElement;

  private enemyPokemonSprite!: HTMLCanvasElement;
  private enemyPokemon: PokemonDataType;

  private playerPokemonSprite!: HTMLCanvasElement;
  private playerData: PlayerDataType;
  private playerPokemon: PokemonDataType;

  private battleAction = 0;
  private battleResultWin = false;

  private _previousElapsed = 0;
  private battleStatus = 0;
  private X_slidePokemonIn = 0;
  private X_slideEnemyHealth = 0;
  private X_slidePlayerHealth = 0;
  private X_throwPokemon = 0;
  private X_throwPokeball = 0;
  private pokeballAnimation = 0;
  private pokemoinAlternativeOpacity = 1;
  private X_writeTextToBattleBox = 0;

  constructor(context: CanvasRenderingContext2D, loader: Loader, player: Player, route: string, encounterMethod: number) {
    this.loader = loader;
    this.pokedex = pokedex;
    this.encounterTable = encounterTable;

    this.encounterMethod = encounterMethod;
    this.route = route;
    this.ctx = context;

    this.playerData = player.getPlayerData();

    this.playerPokemon = this.playerData.pokemon[this.playerData.currentPokemon];

    const enemyPokemonData = this.init();
    this.enemyPokemon = enemyPokemonData;

    console.log(this.enemyPokemon);
    console.log(this.playerPokemon);
  }

  init() {
    const candinates = this.encounterTable[this.route][this.encounterMethod.toString()];

    const candinateIds: number[] = [];
    for (const pokemonIndex in candinates) {
      candinateIds.push(...Array(candinates[pokemonIndex].rate).fill(parseInt(pokemonIndex)))
    }

    const pokemonId = randomFromArray(candinateIds);
    const enemyPokemon = generatePokemon(this.pokedex[pokemonId.toString()], candinates[pokemonId].level, pokemonId, -1);

    this.battleAssets = this.loader.loadImageToCanvas('battleAssets', constants.ASSETS_BATTLE_HEIGHT, constants.ASSETS_BATTLE_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', constants.ASSETS_FONT_HEIGHT, constants.ASSETS_FONT_WIDTH);
    this.avatarAssets = this.loader.loadImageToCanvas('avatar', constants.ASSETS_AVATAR_HEIGHT, constants.ASSETS_AVATAR_WIDTH);
    this.enemyPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (enemyPokemon.generation + 1), constants.ASSETS_POKEMON_HEIGHT[enemyPokemon.generation], constants.ASSETS_POKEMON_WIDTH);
    if (enemyPokemon.generation === this.playerPokemon.generation) {
      this.playerPokemonSprite = this.enemyPokemonSprite;
    } else {
      this.playerPokemonSprite = this.loader.loadImageToCanvas('pokemonGeneration' + (this.playerPokemon.generation + 1), constants.ASSETS_POKEMON_HEIGHT[this.playerPokemon.generation], constants.ASSETS_POKEMON_WIDTH);
    }
    
    return enemyPokemon;
  }
  
  async battle() {
    window.requestAnimationFrame(this.tick.bind(this));

    await this.waitForBattleFinised();

    const battleData = {
      result: this.battleResultWin,
      pokemon: this.enemyPokemon,
    };

    this.ctx.clearRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);

    return battleData;
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
      this.drawActionBox(false);

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeAppearText') {
      this.drawBattleArena();
      this.drawEnemyPokemon(0, true);
      this.drawActionBox(false);
      this.writeTextToBattleBox('Wild ' + this.enemyPokemon.pokemonName.toUpperCase() + ' appeared!|', 0, 1, delta, 1, 0, true, true);
      this.drawEnemyHealth(delta, true);

    } else if (BATTLE_STATUS[this.battleStatus] === 'writeGoText') {
      this.writeTextToBattleBox('Go! ' + this.playerPokemon.pokemonName.toUpperCase() + '!', 0, 1, delta, 0, 0, true, true);

    } else if (BATTLE_STATUS[this.battleStatus] === 'throwPokemon') {
      this.drawBattleArena();
      this.drawEnemyPokemon(0);
      this.drawEnemyHealth(0, false);
      this.drawPlayerPokemon(delta, true, true);
      this.drawActionBox(false);
      drawText(this.ctx, this.font, 'Go! ' + this.playerPokemon.pokemonName.toUpperCase() + '!', 0, 1, 16, 121)

    } else if (BATTLE_STATUS[this.battleStatus] === 'playerActionSelect') {
      this.drawActionBox(true);
      this.writeTextToBattleBox('What should ', 0, 1, delta, 0, 0, false, false);
      this.writeTextToBattleBox(this.playerPokemon.pokemonName.toUpperCase() + ' do?', 0, 1, delta, 0, 1, false, false);

      if (keyboard.isDown(keyboard.LEFT)) {
        if (this.battleAction === 1 || this.battleAction === 3) {
          this.battleAction--;
        }
      } else if (keyboard.isDown(keyboard.RIGHT)) { 
        if (this.battleAction === 0 || this.battleAction === 2) {
          this.battleAction++;
        }
      } else if (keyboard.isDown(keyboard.UP)) { 
        if (this.battleAction === 2 || this.battleAction === 3) {
          this.battleAction -= 2;
        }
      } else if (keyboard.isDown(keyboard.DOWN)) { 
        if (this.battleAction === 0 || this.battleAction === 1) {
          this.battleAction += 2;
        }
      } else if (keyboard.isDown(keyboard.ENTER)) {
        this.nextBattlePhase();
      }

      let xOffset = this.battleAction * 46;
      let yColumn = 0;
  
      if (this.battleAction === 2 || this.battleAction === 3)  {
        xOffset = (this.battleAction - 2) * 46;
        yColumn = 1;
      }
  
      this.drawActionSelector(constants.GAME_WIDTH - constants.ACTION_BOX_WIDTH + 8 + xOffset, constants.GAME_WIDTH - constants.ACTION_BOX_WIDTH + 8 + 42 + xOffset, yColumn);
    
    } else if (BATTLE_STATUS[this.battleStatus] === 'playerAction') {
      console.log(this.battleAction);
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
      ((0.5 + this.encounterMethod / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.ACTION_BOX_HEIGHT,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
      xPixel - constants.BATTLE_SCENE_WIDTH,
      48,
      constants.BATTLE_SCENE_WIDTH,
      constants.BATTLE_SCENE_HEIGHT,
    );

    const enemyPokemonCtx = this.enemyPokemonSprite.getContext('2d');

    if (enemyPokemonCtx && xPixel <= constants.GAME_WIDTH - 1) {
      this.ctx.globalAlpha = 0.8;
    }

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

    this.ctx.globalAlpha = 1;

    this.ctx.drawImage(
      this.battleAssets,
      this.encounterMethod % 3 * constants.BATTLE_SCENE_WIDTH,
      ((0.5 + this.encounterMethod / 3) << 0) * constants.BATTLE_SCENE_HEIGHT + 3 * constants.BATTLE_ARENA_HEIGHT + constants.ACTION_BOX_HEIGHT,
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

  drawEnemyHealth(delta: number, slideIn: boolean) {
    const speed = 224;
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

    const healthFrac = this.enemyPokemon.health / this.enemyPokemon.stats.hp;
    const healthbarWidth = (healthFrac * 48) << 0
    const healthbarOffset = (healthFrac < 0.2) ? 4 : (healthFrac < 0.5) ? 2: 0;

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

    drawText(this.ctx, this.font, this.enemyPokemon.pokemonName.toUpperCase() + ((this.enemyPokemon.gender) ? '#' : '^'), 1, 0, xPixel - 13 + 20, 22);
    drawText(this.ctx, this.font, this.enemyPokemon.level.toString(), 1, 0, xPixel - 13 + 89, 22);

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

        const speedHealth = 224;
        let xPixelPlayerHealth = (this.X_slidePlayerHealth - delta * speedHealth + constants.GAME_WIDTH) << 0;
    
        if (xPixelPlayerHealth < 127) xPixelPlayerHealth = 127;

        this.ctx.drawImage(
          this.battleAssets,
          0,
          constants.ASSETS_HEALTH_OFFSET,
          constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_PLAYER_HEALTH_HEIGHT,
          xPixelPlayerHealth,
          75,
          constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_PLAYER_HEALTH_HEIGHT,
        );

        const healthFrac = this.playerPokemon.health / this.playerPokemon.stats.hp;
        const healthbarOffset = (healthFrac < 0.2) ? 4 : (healthFrac < 0.5) ? 2: 0;
        const healthbarWidth = (healthFrac * 48) << 0

        this.ctx.drawImage(
          this.battleAssets,
          constants.ASSETS_ENEMY_HEALTH_WIDTH + constants.ASSETS_PLAYER_HEALTH_WIDTH,
          constants.ASSETS_HEALTH_OFFSET + healthbarOffset,
          healthbarWidth,
          2,
          xPixelPlayerHealth + 47,
          75 + 17,
          healthbarWidth,
          2,
        );

        drawText(this.ctx, this.font, this.playerPokemon.pokemonName.toUpperCase() + ((this.playerPokemon.gender) ? '#' : '^'), 1, 0, xPixelPlayerHealth + 14, 74 + 6)
        drawText(this.ctx, this.font, this.playerPokemon.level.toString(), 1, 0, xPixelPlayerHealth + 84, 75 + 6)
        drawText(this.ctx, this.font, this.playerPokemon.health.toString().padStart(3, '_') + '/' + this.playerPokemon.stats.hp.toString().padStart(3, '_'), 1, 0, xPixelPlayerHealth + 59, 75 + 22)

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

    if (xPixelPokeball >= 100 && nextPhase) {
      this.nextBattlePhase();
    }

    if (throwPokemon) {
      this.X_throwPokemon += delta * speed;
    }
  }

  drawActionSelector(xStart: number, xEnd: number, column: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(xStart, 121 + column * 16 - 0.5);
    this.ctx.lineTo(xEnd - 1, 121 + column * 16 - 0.5);
    this.ctx.moveTo(xEnd - 0.5, 121 + column * 16);
    this.ctx.lineTo(xEnd - 0.5, 121 + 14 + column * 16);
    this.ctx.moveTo(xEnd - 1, 121 + 14 + column * 16 + 0.5);
    this.ctx.lineTo(xStart, 121 + 14 + column * 16 + 0.5);
    this.ctx.moveTo(xStart - 0.5, 121 + 14 + column * 16);
    this.ctx.lineTo(xStart - 0.5, 121 + column * 16);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#f86058';
    this.ctx.stroke();
  }

  writeTextToBattleBox(text: string, fontsize: number, fontColor: number, delta: number, delayAfter: number, textLine: number, writeOut: boolean, nextPhase = false) {
    const speed = 304;
    const yText = 121 + 16 * textLine;

    if (writeOut) {
      const i = ((this.X_writeTextToBattleBox + delta * speed) / 6) << 0;
      const textToDisplay =  text.slice(0, i);
  
      drawText(this.ctx, this.font, textToDisplay, fontsize, fontColor, 16, yText);
  
      if (i >= text.length + delayAfter * speed / 6) {
        this.X_writeTextToBattleBox = 0;
  
        this.drawActionBox(false);
  
        if (nextPhase) {
          this.nextBattlePhase();
        }
      } else {
        this.X_writeTextToBattleBox += delta * speed;
      }
    } else {
      drawText(this.ctx, this.font, text, fontsize, fontColor, 16, yText);
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

  drawActionBox(actionchoice: boolean) {
    this.ctx.drawImage(
      this.battleAssets,
      0,
      3 * constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.ACTION_BOX_HEIGHT,
      0,
      constants.BATTLE_ARENA_HEIGHT,
      constants.GAME_WIDTH,
      constants.ACTION_BOX_HEIGHT,
    );  

    if (actionchoice) {
      this.ctx.drawImage(
        this.battleAssets,
        constants.GAME_WIDTH,
        3 * constants.BATTLE_ARENA_HEIGHT,
        constants.ACTION_BOX_WIDTH,
        constants.ACTION_BOX_HEIGHT,
        constants.GAME_WIDTH - constants.ACTION_BOX_WIDTH,
        constants.BATTLE_ARENA_HEIGHT,
        constants.ACTION_BOX_WIDTH,
        constants.ACTION_BOX_HEIGHT,
      );
    }
  }
}