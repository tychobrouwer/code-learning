import { pokemonIndexType, pokemonType } from './types';
import { Loader } from './loader' 

const FONT_CHARACTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  ',',
  '|', // caret
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '\'',
  '`', // high dot
  '!',
  '?',
  '^', // female
  '#', // male
  '/',
  '_', // double lower dot
  '“',
  '”',
  '‘',
  '’',
]

const POKEMON_INDEX: pokemonIndexType = {
  0: {
    0: {
      zigzagoon: {
        name: 'Zigzagoon',
        level: [2, 3],
        encounterRate: 45,
        tilePosX: 10,
        tilePosY: 10
      },
      wurmple: {
        name: 'Wurmple',
        level: [2, 3],
        encounterRate: 45,
        tilePosX: 10,
        tilePosY: 10
      },
      poochyena: {
        name: 'Poochyena',
        level: [2, 3],
        encounterRate: 10,
        tilePosX: 10,
        tilePosY: 10
      }
    }
  }
}

export class PokemonBattle {
  loader: Loader;

  ASSETS_BATTLE_HEIGHT = 1440;
  ASSETS_BATTLE_WIDTH = 1440;
  ASSETS_POKEMON_HEIGHT = 7360;
  ASSETS_POKEMON_WIDTH = 1984;
  ASSETS_FONT_HEIGHT = 52;
  ASSETS_FONT_WIDTH = 470;

  GAME_WIDTH;
  GAME_HEIGHT;

  pokemon: pokemonType;
  environment: number;
  route: number;
  ctx: CanvasRenderingContext2D;
  battleAssets!: HTMLCanvasElement;
  pokemonGeneration1!: HTMLCanvasElement;
  font!: HTMLCanvasElement;

  constructor(context: CanvasRenderingContext2D, loader: Loader, GAME_WIDTH: number, GAME_HEIGHT: number, route: number, environment: number) {
    this.loader = loader;

    this.GAME_WIDTH = GAME_WIDTH;
    this.GAME_HEIGHT = GAME_HEIGHT;

    this.environment = environment;
    this.route = route;
    this.ctx = context;

    this.pokemon = this.init();
  }

  init(): pokemonType {
    const candinates = POKEMON_INDEX[this.route][this.environment];

    const items: string[] = [];

    for (const pokemon of Object.keys(candinates)) {
      for (let i = 1; i <= candinates[pokemon].encounterRate; i++) {
        items.push(pokemon)
      }
    }

    this.battleAssets = this.loader.loadImageToCanvas('battleAssets', this.ASSETS_BATTLE_HEIGHT, this.ASSETS_BATTLE_WIDTH);
    this.pokemonGeneration1 = this.loader.loadImageToCanvas('pokemonGeneration1', this.ASSETS_POKEMON_HEIGHT, this.ASSETS_POKEMON_WIDTH);
    this.font = this.loader.loadImageToCanvas('font', this.ASSETS_POKEMON_HEIGHT, this.ASSETS_POKEMON_WIDTH);
    
    return candinates[items[Math.floor(Math.random() * items.length)]];
  }

  getPokemon(): pokemonType {
    return this.pokemon;
  }

  async battle(): Promise<boolean> {
      const playerPokemon = 'playerPokemon';

      this.drawBattleScene();
      this.drawBattleBox();

      await this.drawSlidePokemonIn();

      await this.writeTextToBattleBox('Wild ' + this.pokemon.name.toUpperCase() + ' appeared!|')
      await this.writeTextToBattleBox('GO! ' + playerPokemon + '!')

      const battleResult = true;

      return await Promise.resolve(battleResult);
  }

  writeTextToBattleBox(text: string) {
    return new Promise((resolve) => {
      for (let i = 1; i < text.length + 1; i++) {
        const textToDisplay =  text.slice(0, i);
        setTimeout(() => {
          this.drawText(textToDisplay, 32, 244);
        }, 20 * i);
      }

      setTimeout(() => {
        this.drawBattleBox();

        resolve(true);
      }, 20 * text.length + 1500);
    });
  }

  drawBattleScene() {
    if (this.battleAssets) {
      this.ctx.drawImage(
        this.battleAssets,
        this.environment % 3 * this.GAME_WIDTH,
        ((0.5 + this.environment / 3) << 0) * 224,
        this.GAME_WIDTH,
        224,
        0,
        0,
        this.GAME_WIDTH,
        224,
      );
    }
  }

  drawBattleBox() {
    if (this.battleAssets) {
      this.ctx.drawImage(
        this.battleAssets,
        0,
        896,
        this.GAME_WIDTH,
        96,
        0,
        224,
        this.GAME_WIDTH,
        96,
      );
    }
  }

  drawSlidePokemonIn() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.GAME_WIDTH + 1; i++) {
        setTimeout(() => {
          this.drawBattleScene();

          if (this.battleAssets) {
            this.ctx.drawImage(
              this.battleAssets,
              this.environment % 3 * 256,
              ((0.5 + this.environment / 3) << 0) * 64 + 992,
              256,
              64,
              i - 256,
              96,
              256,
              64,
            );

            this.ctx.drawImage(
              this.battleAssets,
              this.environment % 3 * 256,
              ((0.5 + this.environment / 3) << 0) * 64 + 992,
              256,
              64,
              this.GAME_WIDTH - i,
              200,
              256,
              64,
            );
          }

          this.drawBattleBox();
        }, 2 * i);
      }

      setTimeout(() => {
        resolve(true);
      }, 2 * this.GAME_WIDTH + 500);
    });
  }

  drawText(text: string, posX: number, posY: number) {
    for (let i = 0; i < text.length; i++) {
      const positions = {
        posX: FONT_CHARACTERS.indexOf(text[i]) % 39 * 12,
        posY: Math.floor(FONT_CHARACTERS.indexOf(text[i]) / 39) * 26,
      }

      let width = 12;
      if (text[i] === '|') { // caret is 13 pixels wide
        width = 13;
      }

      if (this.font) {
        this.ctx.drawImage(
          this.font,
          positions.posX,
          positions.posY,
          width,
          26,
          posX + 12 * i,
          posY,
          width,
          26
        );  
      }
    }
  }
}