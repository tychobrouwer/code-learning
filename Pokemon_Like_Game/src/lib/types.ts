export type MapType = {
  cols: number;
  rows: number;
  tsize: number;
  layers: Array<Array<number>>
  getTile: (layer: number, col: number, row: number) => number;
  isSolidTileAtXY: (x: number, y: number, dirx: number, diry: number) => boolean;
  getCol: (x: number) => number;
  getRow: (y: number) => number;
  getX: (col: number) => number;
  getY: (row: number) => number;
};

export type Keyboard = {
  LEFT: string;
  RIGHT: string;
  UP: string;
  DOWN: string;
  _keys: Keys;
  listenForEvents: (keys: Array<string>) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  isDown: (keyCode: string) => boolean;
}

export type Keys = {
  a: boolean;
  d: boolean;
  w: boolean;
  s: boolean;
}