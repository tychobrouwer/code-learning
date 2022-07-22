import { pokemonIndexType } from '../utils/types';

const GAME_HEIGHT = 160;
const GAME_WIDTH = 240;
const MAP_TSIZE = 16;

const CHAR_IN_FONT = [
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

const ASSETS_TILES_HEIGHT = 256;
const ASSETS_TILES_WIDTH = 256;

const ASSETS_AVATAR_HEIGHT = 128;
const ASSETS_AVATAR_WIDTH = 256;

const ASSETS_BATTLE_HEIGHT = 720;
const ASSETS_BATTLE_WIDTH = 720;

const ASSETS_FONT_HEIGHT = 26;
const ASSETS_FONT_WIDTH = 235;

const AVATAR_HEIGHT = 20;
const AVATAR_WIDTH = 14;
const AVATAR_SPEED_WALK = MAP_TSIZE * 3;

const BATTLE_ARENA_HEIGHT = 112;

const BATTLE_SCENE_HEIGHT = 32;
const BATTLE_SCENE_WIDTH = 128;

const TEXT_BOX_HEIGHT = 48;

const FONT_HEIGHT = 13;
const FONT_WIDTH = 6;


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


export const constants = {
  GAME_HEIGHT,
  GAME_WIDTH,
  MAP_TSIZE,

  CHAR_IN_FONT,

  ASSETS_TILES_HEIGHT,
  ASSETS_TILES_WIDTH,

  ASSETS_AVATAR_HEIGHT,
  ASSETS_AVATAR_WIDTH,

  ASSETS_BATTLE_HEIGHT,
  ASSETS_BATTLE_WIDTH,

  ASSETS_FONT_HEIGHT,
  ASSETS_FONT_WIDTH,

  AVATAR_SPEED_WALK,
  AVATAR_HEIGHT,
  AVATAR_WIDTH,

  BATTLE_ARENA_HEIGHT,

  BATTLE_SCENE_HEIGHT,
  BATTLE_SCENE_WIDTH,

  TEXT_BOX_HEIGHT,

  FONT_HEIGHT,
  FONT_WIDTH,

  POKEMON_INDEX,
}