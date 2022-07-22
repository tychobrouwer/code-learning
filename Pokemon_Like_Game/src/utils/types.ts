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
  [level: number]: {
    [environment: number]: {
      [pokemonName: string]: pokemonType;
    }
  }
}

export interface pokemonType {
  name: string;
  level: number[];
  encounterRate: number;
  tilePosX: number;
  tilePosY: number;
}
