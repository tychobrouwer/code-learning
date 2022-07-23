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

const ASSETS_AVATAR_HEIGHT = 192;
const ASSETS_AVATAR_WIDTH = 384;

const ASSETS_BATTLE_HEIGHT = 720;
const ASSETS_BATTLE_WIDTH = 720;

const ASSETS_POKEMON_HEIGHT = [ 3680, 3104, 3320 ]
const ASSETS_POKEMON_WIDTH = 992;
const ASSETS_GENERATION_OFFSET = [ 0, 151, 251 ];

const ASSETS_HEALTH_OFFSET = 512;
const ASSETS_ENEMY_HEALTH_HEIGHT = 28;
const ASSETS_ENEMY_HEALTH_WIDTH = 100;

const ASSETS_PLAYER_HEALTH_HEIGHT = 36;
const ASSETS_PLAYER_HEALTH_WIDTH = 103;

const ASSETS_FONT_HEIGHT = 52;
const ASSETS_FONT_WIDTH = 235;

const AVATAR_HEIGHT = 20;
const AVATAR_WIDTH = 14;
const AVATAR_SPEED_WALK = MAP_TSIZE * 3;
const AVATAR_BATTLE_HEIGHT = 48;
const AVATAR_BATTLE_WIDTH = 76;
const AVATAR_BATTLE_OFFSET = 288;

const BATTLE_ARENA_HEIGHT = 112;

const BATTLE_SCENE_HEIGHT = 32;
const BATTLE_SCENE_WIDTH = 128;

const POKEBALL_SIZE = 16;
const POKEBALL_OFFSET_X = 4 * BATTLE_SCENE_WIDTH;
const POKEBALL_OFFSET_Y = 3 * BATTLE_ARENA_HEIGHT;

const TEXT_BOX_HEIGHT = 48;

const FONT_HEIGHT = 13;
const FONT_WIDTH = 6;

const POKEMON_SIZE = 64;
const POKEMON_SPRITE_HEIGHT = 72;
const POKEMON_SPRITE_WIDTH = 328;

const POKEMON_INDEX: pokemonIndexType = {
  '0': {
    '0': {
      '263': {
        id_string: '263',
        encounter_rate: 45,
      },
      '265': {
        id_string: '265',
        encounter_rate: 45
      },
      '261': {
        id_string: '261',
        encounter_rate: 10
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

  ASSETS_POKEMON_HEIGHT,
  ASSETS_POKEMON_WIDTH,
  ASSETS_GENERATION_OFFSET,

  ASSETS_HEALTH_OFFSET,
  ASSETS_ENEMY_HEALTH_HEIGHT,
  ASSETS_ENEMY_HEALTH_WIDTH,

  ASSETS_PLAYER_HEALTH_HEIGHT,
  ASSETS_PLAYER_HEALTH_WIDTH,

  ASSETS_FONT_HEIGHT,
  ASSETS_FONT_WIDTH,

  AVATAR_SPEED_WALK,
  AVATAR_HEIGHT,
  AVATAR_WIDTH,
  AVATAR_BATTLE_HEIGHT,
  AVATAR_BATTLE_WIDTH,
  AVATAR_BATTLE_OFFSET,

  POKEBALL_SIZE,
  POKEBALL_OFFSET_X,
  POKEBALL_OFFSET_Y,

  BATTLE_ARENA_HEIGHT,

  BATTLE_SCENE_HEIGHT,
  BATTLE_SCENE_WIDTH,

  TEXT_BOX_HEIGHT,

  FONT_HEIGHT,
  FONT_WIDTH,

  POKEMON_SIZE,
  POKEMON_SPRITE_HEIGHT,
  POKEMON_SPRITE_WIDTH,

  POKEMON_INDEX,
}