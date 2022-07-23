export interface MapType {
  COLS: number;
  ROWS: number;
  X_START: number;
  Y_START: number;

  layers: number[][];
  getTile: (layer: number, col: number, row: number) => number;
  isSolidTileAtXY: (x: number, y: number, dirx: number, diry: number) => boolean;
  getCol: (x: number) => number;
  getRow: (y: number) => number;
  getX: (col: number) => number;
  getY: (row: number) => number;
}

export interface Keyboard {
  LEFT: string;
  RIGHT: string;
  UP: string;
  DOWN: string;

  _keys: Keys;
  listenForEvents: (keys: string[]) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  isDown: (keyCode: string) => boolean;
}

export interface Keys {
  a: boolean;
  d: boolean;
  w: boolean;
  s: boolean;
}

export interface pokemonIndexType {
  [level: string]: {
    [environment: string]: {
      [pokemonKey: string]: pokemonType
    }
  }
}

export interface pokemonType {
  id_string: string;
  encounter_rate: number;
}

export interface pokedexType {
  id: number;
  name: string;
  order: number;
  species: string;
  game_index: number;
  weight: number;
  height: number;
  base_experience: number;
  is_default: boolean;
  forms: string[];
  stats: {
    base_stat: number;
    effort: number;
    stat: string;
  }[]
  abilities: {
    ability: string;
    is_hidden: boolean;
    slot: number;
  }[];
  held_items: {
    item: string;
  }[];
  moves: {
    move: string;
  }[];
  types: {
    slot: number;
    type: string;
  }[];
}

export interface pokedexCombType extends pokedexType, pokemonType {}